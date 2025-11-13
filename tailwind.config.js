module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0C2D57",
        accent: "#FF6B00",
        muted: "#F1F5F9"
      },
      boxShadow: {
        soft: "0 6px 18px rgba(12,45,87,0.08)"
      }
    }
  },
  plugins: []
};
