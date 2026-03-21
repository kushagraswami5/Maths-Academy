# Maths Academy — Full Platform

A complete online tutoring platform for Class 8–10 Maths coaching.

## Features
- 🎓 **Admin Panel** — Manage students, courses, tests, homework, attendance, payments, analytics, notifications
- 👨‍🎓 **Student Dashboard** — Live classes, tests with timer, homework submission, attendance tracking, payment history
- 📊 **Analytics** — Class performance, top students, monthly revenue, attendance summary
- 🔔 **Notifications** — Send to all / by class / individual students
- 📡 **Live Classes** — Schedule Google Meet/Zoom classes, mark attendance
- 📝 **Auto-graded Tests** — MCQ tests with countdown timer, instant scoring
- 💰 **Fee Management** — Record cash/UPI payments, track pending fees

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in your DATABASE_URL, DIRECT_URL, and JWT_SECRET
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Create an admin user** (run once in Prisma Studio or via script)
   ```bash
   npx prisma studio
   # Manually create a user with role: "admin"
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Tech Stack
- **Next.js 15** (App Router)
- **Prisma** + PostgreSQL (Supabase recommended)
- **JWT** auth (bcrypt passwords)
- **Tailwind CSS** + custom design system

## Routes
| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` | Login (redirects to /admin or /dashboard by role) |
| `/register` | Student registration |
| `/admin` | Admin dashboard |
| `/admin/students` | Manage students |
| `/admin/courses` | Manage courses |
| `/admin/live` | Schedule live classes |
| `/admin/tests` | Create & publish tests |
| `/admin/homework` | Upload DPP/homework |
| `/admin/attendance` | Mark attendance |
| `/admin/payments` | Record fees |
| `/admin/analytics` | Analytics & reports |
| `/admin/notifications` | Send notifications |
| `/dashboard` | Student dashboard |
| `/student/courses` | Enrolled courses |
| `/student/live` | Live classes |
| `/student/tests` | Take tests (with timer) |
| `/student/homework` | View & submit homework |
| `/student/attendance` | Attendance history |
| `/student/payments` | Fee history |
| `/student/notifications` | Notifications |

## Admin First-Time Setup

Create your first admin account by running:
```bash
# Option 1: Use environment variables
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=YourPassword123 npx tsx scripts/create-admin.ts

# Option 2: Defaults to admin@mathsacademy.in / Admin@123
npx tsx scripts/create-admin.ts
```

Then login at `/login` with those credentials.

## Key Workflows

### Onboarding a new student:
1. Student registers at `/register` OR admin adds from `/admin/students`
2. Admin goes to `/admin/students` → click **Enroll** → select course
3. Student now sees the course in their dashboard

### Running a test:
1. Admin creates test at `/admin/tests` (Step 1: details, Step 2: MCQ questions)
2. Admin clicks **Publish** — all enrolled students are notified
3. Students take the test at `/student/tests` with countdown timer
4. Scores are auto-calculated and shown instantly

### Uploading a lecture:
1. Upload your video to YouTube (unlisted) or Google Drive
2. Go to `/admin/lectures` → select course → Add Lecture → paste URL
3. Students watch at `/student/lectures` with embedded player
