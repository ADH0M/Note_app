# TaskFlow - Project Management Application

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D2?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge" alt="Prisma">
</p>

TaskFlow is a comprehensive, full-featured task management and project tracking application built with modern web technologies. It provides multiple project types, real-time collaboration features, and a seamless user experience with drag-and-drop Kanban boards.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Database Schema](#database-schema)
5. [Project Types](#project-types)
6. [Getting Started](#getting-started)
7. [Project Structure](#project-structure)
8. [API Endpoints](#api-endpoints)
9. [Environment Variables](#environment-variables)
10. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

TaskFlow is a sophisticated task management system designed to help individuals and teams organize their work efficiently. The application supports multiple project types including simple todo lists, project tracking with Kanban boards, time tracking for billable tasks, and meeting notes documentation.

### Core Capabilities
- **Multiple Project Types**: Todo lists, Project Trackers, Task Trackers, Meeting Notes
- **Kanban Boards**: Drag-and-drop task organization
- **Time Tracking**: Built-in timer with hourly rate calculation
- **User Management**: Authentication with role-based access (customer/admin)
- **Real-time Stats**: Dashboard with live project and task statistics

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.3 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4 | Utility-first CSS framework |
| Radix UI | Latest | Accessible UI components |
| dnd-kit | Latest | Drag and drop functionality |
| Lucide React | Latest | Icon library |
| Redux Toolkit | Latest | State management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.3 | Full-stack framework |
| Prisma | 6.19.0 | ORM for MongoDB |
| MongoDB | Latest | NoSQL database |
| bcryptjs | Latest | Password hashing |

### Development Tools
| Technology | Purpose |
|------------|---------|
| ESLint | Code linting |
| TypeScript | Type checking |
| PostCSS | CSS processing |

---

## 🚀 Features

### 1. Authentication System
- Cookie-based authentication
- Secure password hashing with bcrypt
- Role-based access control (Customer/Admin)
- Login/Register flows

### 2. Dashboard
- Real-time statistics (projects, tasks, notes count)
- Recent projects display
- Quick project creation
- Project type overview

### 3. Projects Management
- Create new projects (4 types)
- Edit project titles
- Delete projects with confirmation
- Search and filter projects
- Project task/note counts

### 4. Todo Lists
- Create, edit, delete tasks
- Mark tasks as complete/incomplete
- Filter by status (All/Active/Completed)
- Progress percentage tracking

### 5. Project Tracker (Kanban)
- Multiple columns: To Do, In Progress, Review, Done
- Drag-and-drop between columns
- Priority levels: Low, Medium, High, Urgent
- Due date tracking
- Color-coded priority badges

### 6. Task Tracker (Time Tracking)
- Live timer with start/stop
- Time spent tracking per task
- Hourly rate input
- Cost calculation (time × rate)
- Total time and cost statistics

### 7. Meeting Notes
- Rich note editor
- Meeting date tracking
- Attendees management
- Tags for categorization
- Search within notes

### 8. Kanban Board
- Custom drag-and-drop implementation
- Multiple columns
- Task cards with details
- Burn barrel (delete zone)
- Real-time reorder persistence

---

## 🗄 Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  username  String
  email     String   @unique
  password  String
  isActive  Boolean  @default(false)
  type      UserType @default(customer)
  phone     String?  @unique
  photo    String?
  
  projects   Project[]
  notes      Note[]
  tasks      Task[]
  adminLogs  AdminAction[]
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum UserType {
  customer
  admin
}
```

### Project Model
```prisma
model Project {
  id    String      @id @default(auto()) @map("_id") @db.ObjectId
  title String
  type  ProjectType @default(todo)
  order Float       @default(0)
  
  userId String @db.ObjectId
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  columns Column[]
  tasks   Task[]
  notes  Note[]
  
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}

enum ProjectType {
  todo               // Simple todo list
  project_tracker    // Kanban board with columns
  meeting_notes   // Meeting documentation
  task_tracker    // Time tracking
}
```

### Column Model
```prisma
model Column {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  title String
  order Float  @default(0)
  
  projectId String  @db.ObjectId
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  tasks Task[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([projectId])
}
```

### Task Model
```prisma
model Task {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String?
  favorite  Boolean @default(false)
  state     Boolean @default(false)    // is completed
  order     Float   @default(0)
  
  // Project Tracker fields
  priority   Priority  @default(medium)
  dueDate    DateTime?
  startDate  DateTime?
  
  // Task Tracker fields
  timeSpent  Int     @default(0)    // seconds
  hourlyRate Float?
  
  projectId String  @db.ObjectId
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  columnId String?  @db.ObjectId
  column   Column?  @relation(fields: [columnId], references: [id], onDelete: Cascade)
  
  userId String @db.ObjectId
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([projectId])
  @@index([columnId])
  @@index([userId])
}

enum Priority {
  low
  medium
  high
  urgent
}
```

### Note Model
```prisma
model Note {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  projectId String  @db.ObjectId
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  userId    String @db.ObjectId
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Meeting Notes fields
  meetingDate  DateTime?
  attendees  String[]
  tags       String[]
  actionItems Json?    // [{ taskId, completed }]
  
  createdAt   DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@index([projectId])
}
```

### Admin Action Model
```prisma
model AdminAction {
  id      String @id @default(auto()) @map("_id") @db.ObjectId
  adminId String @db.ObjectId
  admin   User   @relation(fields: [adminId], references: [id], onDelete: Cascade)
  
  action String
  data   Json
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([adminId])
}
```

### Database Relationships
```
User (1) ──────< (N) Project
                    │
                    ├────< (N) Column
                    │          │
                    │          └────< (N) Task
                    │
                    ├────< (N) Task
                    │
                    └────< (N) Note
```

---

## 📁 Project Structure

```
my-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   └── users/
│   │   └── notes/
│   ├── (tasks-system)/
│   │   ├── dash/
│   │   ├── projects/
│   │   │   └── [id]/
│   │   ├── task-dashboard/
│   │   └── user-dashboard/
│   ├── api/
│   │   ├── admin/
│   │   ├── projects/
│   │   └── tasks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # Radix UI components
│   ├── kanban/           # Kanban components
│   └── layout/           # Layout components
├── lib/
│   ├── actions/         # Server actions
│   ├── db/            # Database connection
│   └── store/         # Redux store
├── pages/
│   └── projects/       # Project type pages
├── prisma/
│   └── schema.prisma  # Database schema
└── public/
```

---

## 🎯 Project Types

### 1. Todo
Simple task list for personal productivity
- Task creation/deletion
- Mark complete/incomplete
- Filter by status
- Progress tracking

### 2. Project Tracker
Kanban-style project management
- Four columns: To Do, In Progress, Review, Done
- Drag-and-drop tasks between columns
- Priority assignment (Low/Medium/High/Urgent)
- Due date tracking

### 3. Task Tracker
Time tracking for billable work
- Start/stop timer
- Time logging per task
- Hourly rate input
- Cost calculation

### 4. Meeting Notes
Documentation for meetings
- Rich text notes
- Meeting date/time
- Attendees list
- Action items
- Tags

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm/yarn/pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database URL
```

4. Generate Prisma client
```bash
npx prisma generate
```

5. Run the development server
```bash
npm run dev
```

6. Open http://localhost:3000

### Environment Variables
```env
DATABASE_URL=mongodb://localhost:27017/taskflow
# Or MongoDB Atlas connection string
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow
```

---

## 🔌 API Endpoints

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all user projects |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get project tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/[id]` | Update task |
| DELETE | `/api/tasks/[id]` | Delete task |
| POST | `/api/tasks/reorder` | Reorder tasks |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get project notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/[id]` | Update note |
| DELETE | `/api/notes/[id]` | Delete note |

---

## 🔧 Server Actions

### lib/actions/projects.ts
```typescript
createProject(type, userId, order)
updateProject(projectId, userId, title, type?)
deleteProjet(userId, projectId)
getProjects(userId)
getProject(userId, projectId)
```

### lib/actions/task-action.ts
```typescript
createTask(projectId, title)
updateTask(taskId, { title?, completed? })
deleteTaskAction(taskId)
getTasksForProject(projectId)
updateTaskTime(taskId, timeSpent)
```

### lib/actions/notes-action.ts
```typescript
createNote(projectId, { title, content, meetingDate?, attendees?, tags? })
updateNote(noteId, { ... })
deleteNote(noteId)
getNotesForProject(projectId)
```

### lib/actions/stats.ts
```typescript
getDashboardStats(userId)
getRecentProjects(userId, limit?)
```

---

## 📱 UI Components

### Core Components
- **UserSidebar**: Navigation sidebar with user info and project list
- **NewProjectBtn**: Dropdown to create new projects
- **TodoCard/TodoItem**: Todo list components
- **Kanban Board**: Drag-and-drop columns and cards

### Radix UI Components
- Button, Input, Label
- Switch (toggle)
- Menubar (dropdown)
- Dialog/Modal support

---

## 🔐 Security Features

- Password hashing with bcryptjs
- Cookie-based session management
- Role-based access (customer/admin)
- Server-side authentication checks
- Prisma queries with userId filtering

---

## 🚧 Future Enhancements

- [ ] Admin panel with user management
- [ ] Activity logs display
- [ ] Real-time collaboration (WebSocket)
- [ ] Project sharing between users
- [ ] Comments on tasks
- [ ] File attachments
- [ ] Email notifications
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive improvements
- [ ] Keyboard accessibility

---

## 📄 License

MIT License - Feel free to use this project for your own applications.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">Built with ❤️ using Next.js, React, and MongoDB</p>
