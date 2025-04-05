export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode strategy
  theme: {
    extend: {
      colors: {
        // Custom dark mode colors that are easier on the eyes
        dark: {
          // Darker but not pure black (reduces eye strain)
          background: "#121212",
          "background-alt": "#1a1a1a",
          surface: "#1e1e1e",
          "surface-alt": "#242424",

          // Text colors (not stark white, easier on eyes)
          text: "#e2e2e2",
          "text-muted": "#a0a0a0",

          // Border colors
          border: "#333333",
          "border-light": "#444444",

          // Primary accent colors (softened for dark mode)
          primary: "#8ab4f8", // Softer blue
          secondary: "#a58eff", // Softer purple
          success: "#81c995", // Softer green
          danger: "#f28b82", // Softer red
          warning: "#fdd663", // Softer yellow
        },
      },
      // Add subtle shadows for dark mode
      boxShadow: {
        "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        "dark-md": "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
        "dark-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
