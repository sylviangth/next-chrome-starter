import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#5A51E6",
              foreground: "#fff",
              50: "#EEF2FE",
              100: "#E0E6FD",
              200: "#C9D2FA",
              300: "#A7B4F6",
              400: "#828CF1",
              500: "#6466E9",
              600: "#4E46DC",
              700: "#4138C2",
              800: "#36309D",
              900: "#302E7D",
            },
            focus: "#5A51E6",
          },
        },
      },
    }),
  ],
}