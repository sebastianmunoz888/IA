/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(240, 10%, 4%)",    // fondo oscuro
        foreground: "hsl(0, 0%, 98%)",      // texto blanco
        border: "hsl(240, 3.7%, 15%)",      // bordes
        muted: "hsl(240, 3.7%, 20%)",       // gris apagado
        accent: "hsl(210, 100%, 56%)",      // azul de acento
        // Puedes agregar más si los usas en el CSS
      },
    },
  },
  plugins: [],
};
