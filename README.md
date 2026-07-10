# FitPlan

FitPlan is a full-stack workout planning and weight-progress tracking web application built with Vue 3, Vite, Supabase, and Vue Router.

The application allows users to create an account, securely access a personalised workout dashboard, follow structured workout routines, record weekly weight measurements, visualise progress over a 10-week period, reset their progress, and permanently delete their account.

## Project Status

**Feature-complete portfolio MVP**

The core authentication, workout planning, progress tracking, account management, database integration, and responsive user interface have been implemented.

## Features

### Authentication and Account Management

- Email and password sign-up with Supabase Authentication
- Secure login with persistent browser sessions
- Protected application routes
- Automatic redirection based on authentication state
- User profile menu displaying the authenticated user's email
- Secure logout flow
- Permanent account deletion through a Supabase Edge Function

### Workout Planning

- Personalised FitPlan workout dashboard
- Structured workout routine display
- Exercise data loaded from Supabase
- Reusable workout grid components
- Workout progression interface
- Daily fitness and health tips

### Weight Progress Tracking

- User-specific weight tracking
- Custom weekly check-in day
- Weight records stored in Supabase
- Maximum 10-week progress program
- Responsive weight-progress line graph
- Automatic graph updates after each weight entry
- Progress counter showing completed weekly check-ins
- Full progress reset functionality
- Ability to restart the 10-week program from Week 1

### User Experience

- Responsive desktop, tablet, and mobile layouts
- Consistent FitPlan design system
- Reusable Vue components
- Scoped component styling
- Shared global CSS variables
- Loading, success, error, and disabled interface states
- Clear navigation between the dashboard and weight-progress page

## Tech Stack

| Technology | Purpose |
|---|---|
| Vue 3 | Front-end framework |
| Composition API | Reactive state and component logic |
| Vite | Development server and production build tool |
| Vue Router | Client-side navigation and route protection |
| JavaScript | Application logic |
| CSS | Responsive layouts and component styling |
| Supabase Auth | User registration, login, sessions, and authentication |
| Supabase PostgreSQL | Workout and user-progress data |
| Supabase Row Level Security | User-specific database access |
| Supabase Edge Functions | Secure server-side account deletion |
| Chart.js | Weight-progress data visualisation |
| vue-chartjs | Vue integration for Chart.js |
| Git and GitHub | Version control and feature-based development |

## Application Architecture

```text
Vue User Interface
        │
        ├── Vue Router
        │     ├── Public routes
        │     └── Protected routes
        │
        ├── Supabase Authentication
        │     ├── Sign up
        │     ├── Login
        │     ├── Session management
        │     └── Logout
        │
        ├── Service Layer
        │     ├── Workout data operations
        │     └── Weight-progress operations
        │
        ├── Supabase PostgreSQL
        │     ├── Workout routines
        │     ├── Workout exercises
        │     ├── Weight entries
        │     └── Weight-tracking settings
        │
        └── Supabase Edge Function
              └── Secure account deletion