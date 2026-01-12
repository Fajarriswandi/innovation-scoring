# AI Innovation Scoring Dashboard

An AI-powered dashboard for evaluating and managing innovation proposals at Digital Dubai. The system analyzes innovation proposals using AI to provide scores based on feasibility, impact, and alignment with Dubai's strategic goals.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.9 (App Router)
- **UI Library**: Ant Design 5.27.4
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Redux Toolkit
- **Language**: TypeScript 5.8.3
- **Rich Text Editor**: Quill.js
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm 10.15.1+

## 🛠️ Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── innovations/        # Innovations list page
│   ├── detail/[id]/       # Innovation detail page
│   ├── form-submission/   # Form submission page
│   └── inbox/             # Inbox page
├── features/              # Feature-based modules
│   ├── agent/             # Dashboard components
│   ├── innovations/       # Innovations page
│   ├── detail/            # Detail page
│   ├── form-submission/   # Form submission
│   ├── inbox/             # Inbox functionality
│   └── auth/              # Authentication
├── layouts/               # Layout components
│   ├── AppLayout.tsx      # Main app layout with sidebar
│   └── AuthLayout.tsx     # Auth layout
├── store/                 # Redux store
└── assets/                # Static assets & styles
```

## 🎨 Features

### 1. Dashboard
- Innovation overview with AI scoring
- Board view and List view
- Filtering and sorting capabilities
- Real-time updates

### 2. Innovations
- List of all innovation proposals
- Filter by status, AI recommendation, and score
- Search functionality
- Pagination support

### 3. Innovation Detail
- Complete proposal details
- AI-generated summary
- Score breakdown analysis
- Similarity analysis with other projects
- Committee actions (Approve, Request Info, Reject)
- Activity history timeline

### 4. Form Submission
- Multi-step form for submitting new innovations
- Rich text editor (Quill) for Problem Statement and Proposed Solution
- File upload support
- Edit mode for updating existing proposals

### 5. Inbox
- Thread view for communication
- Reply with rich text editor
- File attachments
- Status tracking

### 6. Dark Mode
- Full dark mode support across all pages
- Toggle in header
- Preference persisted in localStorage

## 🎯 Key Pages & Routes

- `/` - Login page
- `/dashboard` - Main dashboard
- `/innovations` - Innovations list
- `/detail/[id]` - Innovation detail
- `/form-submission` - Submit/edit innovation
- `/inbox` - Inbox messages

## 🔧 Configuration

### Styling
- Tailwind CSS for utility classes
- Ant Design for UI components
- Custom CSS in `globals.css` for dark mode and custom styles
- SCSS for global styles

## 📝 Development Notes

- Uses Next.js App Router with Client Components (`"use client"`)
- Redux for global state management
- Ant Design v5 with React 19 compatibility patch
- Quill editor loaded dynamically to avoid SSR issues
- Dark mode uses `data-theme` attribute
- TypeScript strict mode enabled
- ESLint configuration with React and TypeScript rules

## Push ke repo kantor
### Push ke office
- git push office main
## atau
- git push office master

## 📄 License

Private project - Digital Dubai
