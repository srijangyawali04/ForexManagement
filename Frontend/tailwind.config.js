/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'a4': '210mm', // Custom A4 width
      },
      height: {
        'a4': '297mm', // Custom A4 height
      },
      padding: {
        'a4-padding': '20mm', // Custom A4 padding
      },
      scale: {
        '80': '.8', // For 80% scale printing
      },
    },
  },
  plugins: [],
  safelist: [
    'print:scale-80',
    'print:hidden',
    'print:page-break-before',
  ],
}
