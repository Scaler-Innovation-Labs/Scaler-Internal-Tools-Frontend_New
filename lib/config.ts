// Application Configuration
export const config = {
  // Application Metadata
  app: {
    name: "SST Transport",
    version: "1.0.0",
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