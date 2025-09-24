# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build the project (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview built application

### Docker Development
- `docker-compose up` - Run the application in Docker container
- `docker-compose up --build` - Rebuild and run the container
- `docker-compose down` - Stop the container

### CI/CD
- Pipeline automatically builds and pushes Docker images on commits to `main` branch only
- Production deployment requires manual approval
- Built images are tagged with commit SHA and `latest`

### Package Manager
This project uses `pnpm` as the package manager (see `packageManager` field in package.json).

## Architecture Overview

This is a React TypeScript application for an AI-powered call center dashboard, built with:

### Core Stack
- **React 19** with TypeScript
- **Vite** for build tooling and development
- **Ant Design (antd)** as the UI component library
- **Redux Toolkit** for state management
- **React Router DOM** for routing
- **Socket.IO Client** for real-time communication
- **MSW (Mock Service Worker)** for API mocking
- **Recharts** for data visualization

### Project Structure

#### Key Directories
- `src/features/` - Feature-based organization:
  - `auth/` - Authentication (LoginPage, LoginForm)
  - `agent/` - Agent dashboard functionality
  - `anomaly/` - Anomaly detection pages
  - `notavailable/` - Placeholder pages for unimplemented features
- `src/layouts/` - Layout components (AppLayout, AuthLayout)
- `src/components/` - Shared UI components (SmallStatCard, SentimentChart, TalkListenRatio)
- `src/store/` - Redux store configuration and slices
- `src/api/` - API utilities (socket.io, MSW handlers)
- `src/data/` - Mock data and constants
- `src/hooks/` - Custom hooks (Redux hooks)
- `src/assets/` - Static assets (images, styles)

#### Configuration
- Path alias `@/*` maps to `src/*` (configured in vite.config.ts and tsconfig.json)
- Global styles in `src/assets/styles/global.scss`
- Uses Sass for styling

### Architecture Patterns

#### State Management
- Redux Toolkit store in `src/store/index.ts`
- Layout state managed in `layoutSlice.ts` (controls page titles, UI state)
- Custom Redux hooks in `src/hooks/redux.ts`

#### Routing
- React Router with feature-based route organization in `src/pages/routes.tsx`
- AppLayout wrapper for authenticated pages
- Login page without layout wrapper

#### Component Organization
- Feature-based structure with pages, components, and index files
- Shared components in root `components/` directory
- Layout components separate from features

#### Real-time Communication
- Socket.IO client configured in `src/api/socket.ts`
- Manual connection management (autoConnect: false)
- Environment variable `VITE_SOCKET_URL` for socket endpoint

#### Styling
- Ant Design theming with custom color tokens
- Dark/light mode toggle functionality in AppLayout
- Custom SCSS styles in `src/assets/styles/`
- Responsive design using Ant Design's Grid system

#### Data Mocking
- MSW configured for API mocking in development
- Handlers in `src/api/handlers.ts`
- Faker.js for generating mock data

### Key Components
- **AppLayout**: Main application shell with sidebar navigation, header, theme switching, fullscreen support
- **DashboardPage**: Main agent dashboard with stats, case lists, charts
- **SmallStatCard**: Reusable metric display component
- **SentimentChart** & **TalkListenRatio**: Data visualization components using Recharts

### Development Notes
- TypeScript strict mode enabled
- ESLint configuration with React and TypeScript rules
- Uses React 19's new JSX transform
- Hot module replacement via Vite
- Static assets referenced from `/src/assets/` in development

## Docker Setup

The project includes Docker configuration for local development:

### Files
- `Dockerfile` - Multi-stage build with Node.js 18 Alpine
- `docker-compose.yml` - Development environment with volume mounting
- `.dockerignore` - Excludes unnecessary files from Docker context

### Usage
1. Ensure Docker and Docker Compose are installed
2. Run `docker-compose up` to start the development server
3. Access the application at `http://localhost:5173`
4. Code changes are automatically reflected due to volume mounting

### Configuration
- Container exposes port 5173 for Vite dev server
- Environment variable `VITE_SOCKET_URL` set to `ws://localhost:3001`
- Volume mounting enables hot reload during development
- Uses pnpm for faster dependency installation

## CI/CD Pipeline

The project includes GitLab CI/CD configuration for automated builds and deployments:

### Pipeline Stages
1. **Build** - Installs dependencies, builds the application, and runs linting
2. **Build Image** - Creates production Docker image and pushes to GitLab Container Registry
3. **Deploy** - Manual production deployment

### Files
- `.gitlab-ci.yml` - Main CI/CD pipeline configuration
- `Dockerfile.prod` - Multi-stage production Dockerfile using Nginx
- `nginx.conf` - Nginx configuration with SPA routing, compression, and security headers

### Production Docker Image
- Multi-stage build: Node.js for building, Nginx Alpine for serving
- Optimized with gzip compression and static asset caching
- Includes health check endpoint at `/health`
- Security headers configured (XSS, CSRF, Content-Type protection)

### Deployment
- **Production only**: Manual deployment from `main` branch
- Images tagged with commit SHA and `latest`
- Uses GitLab Container Registry

### Required GitLab Variables
Configure these in GitLab Project → Settings → CI/CD → Variables:
- `CI_REGISTRY` - GitLab container registry URL (auto-provided)
- `CI_REGISTRY_USER` - Registry username (auto-provided)
- `CI_REGISTRY_PASSWORD` - Registry password (auto-provided)

### Usage
1. Push to `main` - Triggers build, Docker image creation, and enables manual production deployment
2. Go to GitLab Pipelines → Click "Deploy" button to manually deploy to production