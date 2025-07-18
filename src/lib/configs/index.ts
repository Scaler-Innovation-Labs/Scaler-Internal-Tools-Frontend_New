// Application Configuration
export const config = {
  // Application Metadata
  app: {
    name: "SST Transport",
    version: "1.0.0",
  },

  // API Configuration
  api: {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  },

  // UI Configuration
  ui: {
    refreshIntervals: {
      busSchedules: 30000, // 30 seconds
    },
    animations: {
      duration: 200,
      easing: "ease-in-out",
    },
  },

  // Feature Flags
  features: {
    darkMode: true,
  },
} as const

export default config 