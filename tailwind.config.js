module.exports = {
  future: "all",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: [],
  variants: {
    variants: {
      opacity: ({ after }) => after(["disabled"]),
    },
  },
  plugins: [require("@tailwindcss/ui")],
}
