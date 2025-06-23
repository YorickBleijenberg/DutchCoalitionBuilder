# Dutch Election Coalition Builder

## Overview

This is a full-stack web application for building and analyzing Dutch political coalitions. The application allows users to predict seat distributions for Dutch political parties, visualize parliament compositions, and explore viable coalition combinations with real-time feedback. Built with React, TypeScript, Express, and PostgreSQL, it provides an interactive political analysis tool.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Context API for global state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Visualization**: D3.js for parliament seat visualization
- **Internationalization**: react-i18next for multi-language support (English/Dutch)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Build System**: Vite for frontend, esbuild for backend
- **Development**: Full-stack development with Vite dev server integration

### Key Components

#### Data Layer
- **Schema**: User management and coalition scenarios schema defined in Drizzle ORM
- **Storage Interface**: Abstracted storage layer with PostgreSQL database implementation
- **Database**: Neon PostgreSQL with coalition scenario persistence
- **Local Storage**: Browser localStorage for scenario save/load functionality

#### Frontend Components
- **SeatTable**: Interactive seat prediction input with validation and current/predicted comparison
- **ParliamentChart**: D3.js-powered semicircular parliament visualization with real-time updates
- **CoalitionBuilder**: Interactive coalition formation with checkbox selection
- **CoalitionSuggestions**: Algorithm-based coalition recommendations with ideology filtering
- **ScenarioManager**: Save/load coalition scenarios with localStorage persistence
- **Header**: Navigation with dark mode, language switching, and export functionality

#### Business Logic
- **Coalition Calculator**: Generates viable coalition combinations based on seat thresholds
- **Parliament Visualization**: Renders 150-seat Dutch parliament layout
- **Seat Validation**: Ensures total seats don't exceed 150-seat limit

## Data Flow

1. **User Input**: Users input seat predictions through the SeatTable component
2. **State Management**: AppContext manages global state including party seats and selections
3. **Real-time Calculation**: Coalition viability calculated on every state change
4. **Visualization Update**: Parliament chart updates automatically based on seat distribution
5. **Coalition Generation**: Algorithm generates top viable coalitions meeting majority threshold (76+ seats)
6. **Export Functionality**: Users can export visualizations as PNG snapshots

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **d3**: Data visualization library
- **react-i18next**: Internationalization framework
- **html-to-image**: Export functionality for visualizations

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema deployment

### Environment Configuration
- **Development**: Uses Vite dev server with HMR and middleware integration
- **Production**: Serves static files from Express with API routes
- **Database**: Environment-based DATABASE_URL configuration

### Hosting
- **Platform**: Replit autoscale deployment
- **Port Configuration**: Express serves on port 5000, mapped to external port 80
- **Static Assets**: Served directly by Express in production

## Changelog
```
Changelog:
- June 23, 2025. Initial setup with React frontend and Express backend
- June 23, 2025. Added PostgreSQL database with Drizzle ORM
- June 23, 2025. Implemented tab-based interface separating seat predictions from coalition building
- June 23, 2025. Added current Dutch parliament seats data and scenario save/load functionality
- June 23, 2025. Enhanced UI with real-time seat comparison and localStorage persistence
- June 23, 2025. Redesigned seat predictions with horizontal comparison chart and mobile-responsive controls
- June 23, 2025. Implemented sticky total seats indicator and simplified header interface
- June 23, 2025. Added settings dropdown menu with dark mode and language options
- June 23, 2025. Enhanced Coalition Builder with sticky coalition summary and seats needed indicator
- June 23, 2025. Removed ideology lock and added party exclusion dropdown for coalition suggestions
- June 23, 2025. Integrated polling data from Peilingwijzer and Peil.nl with quick load options
```

## User Preferences

Preferred communication style: Simple, everyday language.