import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
        },
        "auth-shell": "hsl(var(--auth-shell))",
        "auth-card-border": "hsl(var(--auth-card-border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        auth: "var(--shadow-auth)",
      },
      spacing: {
        "auth-sidebar": "var(--auth-sidebar-width)",
        "auth-card-pad": "var(--auth-card-padding)",
        "auth-stack": "var(--auth-field-stack)",
        "auth-rule-gap": "var(--auth-rule-gap)",
      },
      maxWidth: {
        "auth-card": "var(--auth-card-max-width)",
      },
      minHeight: {
        auth: "var(--auth-min-height)",
      },
      fontSize: {
        "auth-title": [
          "var(--auth-title-size)",
          { lineHeight: "var(--auth-title-leading)" },
        ],
        "auth-lead": [
          "var(--auth-lead-size)",
          { lineHeight: "var(--auth-lead-leading)" },
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
