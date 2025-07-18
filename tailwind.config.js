/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "hsl(var(--primary-foreground))",
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'opensans': ['var(--font-opensans)'],
        'poppins': ['var(--font-poppins)'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      strokeWidth: {
        '0': '0',
        '1': '1',
        '1.5': '1.5',
        '2': '2',
        '3': '3',
        '4': '4',
      },
    },
  },
  safelist: [
    // Status colors
    'bg-green-100',
    'text-green-800',
    'border-green-200',
    'bg-red-100', 
    'text-red-800',
    'border-red-200',
    'bg-gray-100',
    'text-gray-800',
    'border-gray-200',
    // Icon colors
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-red-600',
    'text-gray-400',
    'text-gray-500',
    // Background colors
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
    'bg-red-50',
    'bg-gray-50',
    // Hover states
    'group-hover:bg-blue-100',
    'group-hover:bg-green-100',
    'group-hover:bg-purple-100',
    // Responsive classes
    'min-h-0',
    'min-h-[44px]',
  ],
  plugins: [require("tailwindcss-animate")],
}
