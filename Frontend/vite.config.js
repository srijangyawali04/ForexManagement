// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import fs from 'fs';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 443,
//     host: '0.0.0.0',
//     https: {
//       key: fs.readFileSync('/home/ubuntu/ForexManagement/key.pem'), // Path to your private key
//       cert: fs.readFileSync('/home/ubuntu/ForexManagement/cert.pem'), // Path to your certificate
//     },
//   },
// });



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,          // Set port to 80 (HTTP port) 
    host: '0.0.0.0',   // Allow access from external IPs
  },
});


//openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
// sudo pm2 start npm --name "frontend" -- run dev -- --host
//pm2 start npm --name "backend" -- run start