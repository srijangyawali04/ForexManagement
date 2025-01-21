/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                   // Include your HTML file
    "./src/**/*.{js,ts,jsx,tsx}",     // Include your JavaScript/TypeScript files
  ],
  theme: {
    extend: {
      width: {
        'a4': '210mm',                 // Custom A4 width
      },
      height: {
        'a4': '297mm',                 // Custom A4 height
      },
      padding: {
        'a4-padding': '20mm',          // Custom A4 padding
      },
      scale: {
        '80': '.8',                    // For 80% scale printing
      },
    },
  },
  plugins: [],
  safelist: [
    'print:scale-80',                // Safelisting print scale class
    'print:hidden',                  // Safelisting print hidden class
    'print:page-break-before',       // Safelisting print page-break-before class
  ],
}
