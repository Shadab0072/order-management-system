order-management/
├── public/                  # Static assets (favicon, robots.txt, SPA redirects)
│
├── src/
│   ├── main.jsx             # Application entry point
│   ├── App.jsx              # Routing, providers, lazy loading, offline handling
│   ├── index.css            # Global styles (Tailwind CSS)
│
│   ├── assets/              # Static images, SVGs, icons
│
│   ├── pages/               # Application screens/pages
│   │   ├── Dashboard
│   │   ├── Orders
│   │   ├── Kanban
│   │   ├── Notifications
│   │   ├── NotFound (404)
│   │   └── Offline
│
│   ├── components/
│   │   ├── layout/          # Layout components (Sidebar, Topbar, AppLayout)
│   │   ├── kanban/          # Kanban board (columns, cards, drag-drop)
│   │   ├── skeleton/        # Loading placeholders (skeleton UI)
│   │   └── ui/              # Reusable UI components (shadcn-style)
│
│   ├── context/             # Global state management
│   │   ├── OrderContext     # Orders & notifications logic
│   │   ├── ThemeContext     # Theme handling (dark/light)
│   │   └── AppContext       # Legacy/shared context
│
│   ├── hooks/               # Custom React hooks
│   │   ├── useOnlineStatus
│   │   ├── useMobile
│   │   └── useToast
│
│   ├── constants/           # Static config values
│   │   ├── status.js        # Status labels,Priority types,Filters,Color mappings
│      
│ 
│
│   ├── utils/               # Helper functions
│   │   ├── Formatters
│   │   └── Order utilities
│
│
│   └── lib/                 # Core utilities
│       └── cn() helper & UI helpers
│
├── index.html               # Root HTML template
├── vite.config.js           # Vite configuration (@ alias → src)
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS setup
├── eslint.config.js         # Linting rules
├── vitest.config.js         # Unit testing setup
├── components.json          # shadcn/ui configuration
├── package.json             # Dependencies & scripts
└── README.md                # Project documentation



