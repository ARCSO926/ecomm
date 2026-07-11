@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 40 33% 98%;
    --foreground: 20 14% 12%;
    --card: 0 0% 100%;
    --card-foreground: 20 14% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 20 14% 12%;
    --primary: 158 64% 32%;
    --primary-foreground: 0 0% 100%;
    --secondary: 30 40% 94%;
    --secondary-foreground: 20 14% 12%;
    --muted: 30 20% 94%;
    --muted-foreground: 20 8% 40%;
    --accent: 24 90% 55%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 20 14% 88%;
    --input: 20 14% 88%;
    --ring: 158 64% 32%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 20 14% 8%;
    --foreground: 40 20% 96%;
    --card: 20 14% 11%;
    --card-foreground: 40 20% 96%;
    --popover: 20 14% 11%;
    --popover-foreground: 40 20% 96%;
    --primary: 158 55% 45%;
    --primary-foreground: 20 14% 8%;
    --secondary: 20 10% 16%;
    --secondary-foreground: 40 20% 96%;
    --muted: 20 10% 16%;
    --muted-foreground: 30 10% 65%;
    --accent: 24 85% 58%;
    --accent-foreground: 20 14% 8%;
    --destructive: 0 62% 45%;
    --destructive-foreground: 0 0% 100%;
    --border: 20 10% 20%;
    --input: 20 10% 20%;
    --ring: 158 55% 45%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-body antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
}
