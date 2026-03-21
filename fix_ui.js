const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src/app');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Grid replacements
  content = content.replace(/style=\{\{\s*display:\s*["']grid["'],\s*gridTemplateColumns:\s*["']1fr 280px["'][^}]*\}\}/g, 'className="grid-main" style={{ marginBottom: 16 }}');
  content = content.replace(/style=\{\{\s*display:\s*["']grid["'],\s*gridTemplateColumns:\s*["']1fr 1fr["'][^}]*\}\}/g, 'className="grid-2" style={{ marginBottom: 16 }}');
  content = content.replace(/style=\{\{\s*display:\s*["']grid["'],\s*gridTemplateColumns:\s*["']repeat\(3,\s*1fr\)["'][^}]*\}\}/g, 'className="grid-kpi" style={{ marginBottom: 20 }}');
  content = content.replace(/style=\{\{\s*display:\s*["']grid["'],\s*gridTemplateColumns:\s*["']repeat\(3,1fr\)["'][^}]*\}\}/g, 'className="grid-kpi" style={{ marginBottom: 20 }}');
  content = content.replace(/style=\{\{\s*display:\s*["']grid["'],\s*gridTemplateColumns:\s*["']repeat\(4,1fr\)["'][^}]*\}\}/g, 'className="grid-kpi grid-kpi-4" style={{ marginBottom: 16 }}');
  content = content.replace(/style=\{\{\s*display:\s*["']grid["'],\s*gridTemplateColumns:\s*["']repeat\(4,\s*1fr\)["'][^}]*\}\}/g, 'className="grid-kpi grid-kpi-4" style={{ marginBottom: 16 }}');

  // Wrap tables (if not already wrapped)
  content = content.replace(/(<div className="table-scroll">\s*)?(<table\b[^>]*>[\s\S]*?<\/table>)(\s*<\/div>)?/g, (match, prefix, table, suffix) => {
     if (prefix) return match; // Already wrapped
     return `<div className="table-scroll">${table}</div>`;
  });

  if (content !== original) {
    fs.writeFileSync(f, content);
    console.log("Updated", f);
  }
});
