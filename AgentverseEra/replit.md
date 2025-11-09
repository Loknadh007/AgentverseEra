# Agentverse - Autonomous AI Debugging Platform

## Overview

Agentverse is a full-stack autonomous AI debugging platform that uses a multi-agent system to help developers diagnose and fix code issues. The platform features three specialized AI agents (Empathy, Diagnostic, and Execution) that work together to analyze bugs, generate hypotheses, and suggest fixes through an interactive chat interface with real-time visualizations.

The application presents a modern, classy, sophisticated dark mode UI with a Bento Grid dashboard layout, featuring real-time chat, structured bug reports, ranked hypotheses, activity logs, and code diff visualizations with elegant animations and smooth transitions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite for fast development and optimized production builds.

**UI Component System**: Radix UI primitives combined with shadcn/ui components, styled with Tailwind CSS for a consistent modern, sophisticated dark-mode aesthetic. The component library follows a "new-york" style with a custom color palette centered around Deep Purple (#8B5CF6), Rose Gold (#F472B6), and elegant charcoal backgrounds with purple-tinted accents throughout.

**State Management**: React Query (@tanstack/react-query) handles server state and API interactions, with client-side state managed through React hooks. Conversation state is fetched and cached, with automatic invalidation on mutations.

**Layout Design**: Bento Grid dashboard with 70/30 split - main chat panel occupies 70% width, side panel with bug reports, hypotheses, and activity logs takes 30%. Uses glassmorphism effects (backdrop-blur-xl with semi-transparent backgrounds) for visual depth.

**Animation System**: Framer Motion provides sophisticated fade-in-scale entrance animations, 3D hover effects with subtle scale transforms, typewriter effects for code blocks, and smooth 500ms transitions throughout the UI. Pre-loader screen displays for minimum 5 seconds with floating particles (20 animated orbs), rotating rings, orbiting elements, gradient background shifts, and blur-to-focus text reveals before elegantly fading to the main application.

**Routing**: Single-page application structure - main Dashboard component handles the primary interface, with a 404 fallback page.

### Backend Architecture

**Server Framework**: Express.js running on Node.js, serving both API endpoints and static frontend assets in production.

**API Design**: RESTful API with endpoints for conversation management and message handling:
- `POST /api/conversations` - Creates new conversation with welcome message
- `POST /api/conversations/:id/messages` - Processes user messages through agent pipeline

**AI Agent Pipeline**: Three-stage sequential processing system:
1. **Empathy Agent** - Analyzes user sentiment and extracts bug context into structured JSON
2. **Diagnostic Agent** - Generates exactly three ranked hypotheses with confidence scores
3. **Execution Agent** - Proposes code fixes and simulated shell commands

Each agent uses OpenAI's API with specialized system prompts defining role, personality, and output format. Agents communicate through structured JSON responses passed between stages.

**Data Storage**: In-memory storage implementation (`MemStorage` class) using JavaScript Maps to store conversations, messages, bug reports, hypotheses, and activity entries. Each entity is keyed by UUID. This approach was chosen for rapid prototyping but is designed to be swappable with a database implementation via the `IStorage` interface.

**Schema Design**: Drizzle ORM schemas define PostgreSQL table structures for persistent storage (though currently using in-memory fallback):
- `conversations` - Tracks debugging sessions
- `messages` - Stores chat history with agent attribution
- `bugReports` - Structured bug data with severity, category, sentiment
- `hypotheses` - Ranked diagnostic hypotheses with confidence scores
- `activityEntries` - Real-time agent action log with status tracking

The schema supports relationships through foreign keys (conversationId) and uses JSONB for flexible metadata storage.

### Design System

**Design Philosophy**: Modern, classy, sophisticated aesthetic with smooth animations and elegant micro-interactions. Emphasis on visual depth through glassmorphism, gradient effects, and subtle movements.

**Typography**: Inter for all UI elements, JetBrains Mono/Fira Code for code/terminal displays. Clean, modern sans-serif fonts ensure excellent readability with proper kerning and tracking.

**Color Palette** (Modern & Sophisticated):
- **Primary**: Deep Purple/Violet (#8B5CF6 / HSL: 262 80% 65%) - sophisticated, modern accent
- **Secondary**: Rose Gold/Soft Pink (#F472B6 / HSL: 330 75% 68%) - elegant, warm accent
- **Background**: Deep Charcoal (#0F172A / HSL: 224 30% 7%) - darker, richer base
- **Accent**: Deep Purple Muted (#7C3AED / HSL: 262 50% 40%) - subtle highlights
- **Success**: Light Purple (HSL: 262 70% 70%) - positive states, purple-tinted success color
- **Destructive**: Soft Red (HSL: 0 75% 60%) - error states

**Animation System**:
- Entrance animations: fade-in-scale with cubic-bezier easing for smooth entry
- Hover effects: 500ms transitions with scale(1.02) and purple glow shadows
- Pre-loader: Floating particles, rotating rings, gradient shifts, smooth motion
- Text reveal: Blur-to-focus with staggered timing for dramatic effect
- Gradient animations: Shifting background gradients on title elements

**Visual Effects**:
- Glassmorphism: backdrop-blur-xl with semi-transparent card backgrounds (90% opacity)
- Shadow system: Purple-tinted glows (0_0_30px_rgba(139,92,246,0.25)) on hover
- Gradient overlays: Subtle primary-to-secondary gradients on hover states
- Border glow: Animated border colors pulsing with purple hues

**Component Patterns**: 
- Agent avatars with role-specific colored borders using new palette
- Message bubbles with rounded-xl corners and scale animations
- Code diffs with purple additions and soft red deletions
- Expandable hypothesis cards with smooth height/opacity transitions
- Activity log with top/bottom blur masks for continuous flow effect
- Floating particles and orbiting elements in pre-loader

**Responsive Behavior**: Mobile detection hook (`useIsMobile`) enables adaptive layouts, though primary design targets desktop debugging workflows.

## External Dependencies

### AI Services

**OpenAI API**: Powers all three AI agents using GPT models. Requires `OPENAI_API_KEY` environment variable. Each agent uses tailored system prompts to control response format and behavior. Handles natural language understanding, sentiment analysis, technical reasoning, and code generation.

### Database

**PostgreSQL**: Configured via Drizzle ORM with Neon serverless driver (`@neondatabase/serverless`). Requires `DATABASE_URL` environment variable. Currently operates with in-memory fallback but schema is production-ready for migration.

**Drizzle Kit**: Manages database migrations and schema synchronization. Configuration in `drizzle.config.ts` points to PostgreSQL dialect.

### UI Component Libraries

**Radix UI**: Headless component primitives for accessibility-compliant interactive elements (dialogs, dropdowns, tooltips, etc.). Provides unstyled base components that are customized with Tailwind.

**Framer Motion**: Animation library handling message transitions, typewriter effects, and UI state changes.

**Embla Carousel**: Carousel functionality for potential multi-view interfaces.

### Development Tools

**Vite**: Build tool and dev server with HMR (Hot Module Replacement). Custom plugins include:
- Runtime error overlay for development
- Cartographer for Replit integration
- Dev banner for environment awareness

**TypeScript**: Type safety across entire stack with path aliases (`@/`, `@shared/`) for clean imports.

**ESBuild**: Production bundler for server-side code, generating optimized Node.js modules.

### Styling

**Tailwind CSS**: Utility-first CSS framework with custom configuration extending base theme with cyberpunk color palette and custom utility classes (`hover-elevate`, `active-elevate-2`).

**PostCSS**: CSS processing pipeline with autoprefixer for vendor prefix management.

### Session Management

**connect-pg-simple**: PostgreSQL session store for Express sessions (configured but not actively used in current stateless implementation).

### Validation

**Zod**: Runtime type validation for API payloads and database schemas. Integrated with Drizzle via `drizzle-zod` for automatic schema-to-validator conversion.