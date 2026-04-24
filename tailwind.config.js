/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        auth: {
          sidebar: 'hsl(var(--auth-sidebar))',
          'sidebar-muted': 'hsl(var(--auth-sidebar-muted))',
          'sidebar-foreground': 'hsl(var(--auth-sidebar-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
      width: {
        'auth-sidebar': 'var(--auth-sidebar-width)',
      },
      minHeight: {
        'auth-frame': 'var(--auth-frame-height)',
      },
      maxWidth: {
        'auth-frame': 'var(--auth-frame-width)',
      },
      spacing: {
        'login-field': 'var(--login-field-gap)',
        'login-card-x': 'var(--login-card-padding-x)',
        'login-card-y': 'var(--login-card-padding-y)',
        'login-brand-x': 'var(--login-brand-padding-x)',
        'login-brand-y': 'var(--login-brand-padding-y)',
      },
      boxShadow: {
        login: 'var(--shadow-login)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'login-title': [
          'var(--login-title-size)',
          { lineHeight: 'var(--login-title-leading)' },
        ],
        'login-subtitle': [
          'var(--login-subtitle-size)',
          { lineHeight: 'var(--login-subtitle-leading)' },
        ],
        'login-brand-head': [
          'var(--login-brand-head-size)',
          { lineHeight: 'var(--login-brand-head-leading)' },
        ],
      },
    },
  },
  plugins: [],
}
