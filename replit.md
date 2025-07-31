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
- **Stability Scoring**: Advanced algorithms analyzing ideological alignment, size balance, leadership experience, and historical precedent
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
- June 23, 2025. Moved Current Prediction bar to top of Coalition Builder tab for better visibility
- June 23, 2025. Implemented advanced coalition stability scoring algorithms with multi-factor analysis
- June 23, 2025. Enhanced Current Prediction bar with party labels, seat numbers, and legend display
- June 23, 2025. Updated comparison chart colors (green predictions, thinner current seats bars)
- June 23, 2025. Added election countdown (October 29, 2025) to header navigation
- June 23, 2025. Made Current Prediction bar sticky and moved PartyBar to Seat Predictions tab
- June 23, 2025. Simplified Coalition Builder with read-only party selection (no seat editing)
- June 23, 2025. Enhanced Seat Predictions with integrated progress bar in sticky header
- June 23, 2025. Added hold-to-increment functionality for plus/minus seat adjustment buttons
- June 23, 2025. Repositioned poll data buttons to header top-right for better accessibility
- June 23, 2025. Implemented color-coded tab themes (blue predictions, green coalitions) with enhanced contrast
- June 23, 2025. Made party containers fully clickable for streamlined coalition building
- June 23, 2025. Improved mobile responsiveness with stacked navigation and responsive button labels
- June 23, 2025. Added advanced analytics: Swing Analysis for seat change impact visualization
- June 23, 2025. Implemented Coalition Formation Timeline with historical data and predictions
- June 23, 2025. Created Export & Sharing functionality with beautiful prediction and coalition cards
- June 23, 2025. Added Media Sentiment Tracking with simulated news coverage analysis
- June 23, 2025. Built Guided Coalition Builder tutorial for new user onboarding
- June 23, 2025. Fixed export functionality for desktop by positioning cards off-screen during generation
- June 23, 2025. Enhanced prediction export to show all parties with predicted seats instead of just top parties
- June 23, 2025. Improved Coalition Suggestions mobile layout with full-width select buttons placed underneath options
- June 23, 2025. Reorganized interface into 4 tabs: Seat Predictions, Coalition Builder, Analytics, and Export & Share
- June 23, 2025. Created dedicated Analytics tab with Swing Analysis, Stability Analysis, Coalition Timeline, and Media Sentiment
- June 23, 2025. Created dedicated Export & Share tab containing export functionality and preview cards
- June 23, 2025. Enhanced mobile responsiveness with 2x2 grid layout for tabs on small screens
- June 23, 2025. Comprehensive UI improvements: removed Load Current and Reset buttons from header, added election countdown banner
- June 23, 2025. Enhanced Current Prediction bar: removed majority indicators and simplified to show only seat counts
- June 23, 2025. Updated majority threshold label and removed majority status indicators throughout
- June 23, 2025. Added Blank/Reset button to poll data section for easy clearing of custom values
- June 23, 2025. Converted Seat Predictions to two-column layout for better screen space utilization
- June 23, 2025. Improved Coalition Suggestions responsive layout with side buttons on wide screens
- June 23, 2025. Repositioned Scenario Manager to bottom on narrow screens for better mobile experience
- June 23, 2025. Moved Parliament Chart (Zetelverdeling Tweede Kamer) to Analytics tab for better organization
- June 23, 2025. Updated poll data button labels: TK2023, Peilingwijzer, Peil.nl, added 1V button with official seat data
- June 23, 2025. Added ideological coalition options (Purple, Centre, Right, Left) as additional suggestions in Coalition Builder
- June 23, 2025. Made Totaal Zetels progress bar sticky when scrolling and updated banner with "Nederland Coalitieland"
- June 23, 2025. Conditional display of CoalitionPredictionBar only when parties are selected in Seat Predictions
- June 24, 2025. Implemented mobile-first bottom tab navigation for native app feel on phones while keeping desktop tabs at top
- June 24, 2025. Enhanced top banner with smaller countdown font, moved guided tour and settings to banner with icon-only buttons, fixed mobile seat increment bug
- June 24, 2025. Streamlined interface by removing clear button from Coalition Builder and settings buttons next to tabs for cleaner design
- June 24, 2025. Optimized mobile layout with full-width design using minimal margins for better screen utilization
- June 24, 2025. Made tab bar sticky on desktop with proper z-index layering and adjusted positioning of other sticky elements
- June 24, 2025. Moved Scenario Manager to bottom of Coalition Builder tab for better organization
- June 24, 2025. Made Ideological Coalitions more compact with 4-column layout and smaller design
- June 24, 2025. Added Save Coalition button to CoalitionBuilder header with toast notifications
- June 24, 2025. Swapped tab order: Coalition Builder now first tab, Seat Predictions second
- June 24, 2025. Enhanced visual contrast with darker page background (gray-100/gray-800)
- June 24, 2025. Streamlined CoalitionPredictionBar: removed "Coalitie" label and "Meerderheidslijn" text, centered majority indicator
- June 26, 2025. Fixed mobile plus/minus button issue: removed long press logic, now increments by 1 per tap
- June 26, 2025. Enhanced PoliticalPredictor: fixed insights functionality, swapped badge/seats layout, implemented complete Dutch/English translation
- June 26, 2025. Comprehensive code refactoring: extracted utility functions, created shared constants, organized components into common folder, improved type safety
- June 26, 2025. Created beautiful landing page with hero section and two-track user experience: Simpel mode (coming soon) and Geavanceerd mode (current full experience)
- January 8, 2025. Added poll dates to polling data structure (TK2023: 2023-11-22, Peilingwijzer: 2025-06-28, Peil.nl: 2025-07-07, 1V: 2025-06-28)
- January 8, 2025. Set default polling data to Peil.nl (latest date: 2025-07-07) on app initialization
- January 8, 2025. Created functional Simple Coalition Viewer page with poll selection and coalition building functionality
- January 8, 2025. Added new parties to parties.json: 50PLUS (0 TK, 1 EK), OPNL (0 TK, 1 EK), updated existing party data
- January 8, 2025. Added "Polls Plus" button to landing page with new dedicated page for poll aggregator
- January 8, 2025. Created PollsPlus.tsx page with embedded HTML poll aggregator using dangerouslySetInnerHTML
- January 8, 2025. Replaced iframe approach with direct HTML embedding to avoid X-Frame-Options restrictions
- January 8, 2025. Integrated Plotly.js-based interactive poll aggregator with party selection, weight controls, and export functionality
- July 31, 2025. Rebuilt poll aggregator as native React component with proper script loading and state management
- July 31, 2025. Fixed JavaScript execution issues by replacing dangerouslySetInnerHTML with React patterns
- July 31, 2025. Successfully integrated real Dutch polling data (72 entries) from CSV files with 15 political parties
- July 31, 2025. Implemented time-weighted aggregation algorithm with pollster quality weighting system
```

## User Preferences

Preferred communication style: Simple, everyday language.
Mobile-first approach: Tabs should be at bottom on phones for native mobile app experience.