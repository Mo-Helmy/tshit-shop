import { env } from 'process';

const environment = env.NODE_ENV;
console.log('🚀 ~ file: link-config.js:2 ~ environment', environment);
const prodApiUrl = env.API_URL;
const prodClientUrl = env.CLIENT_URL;
let apiUrl;
let clientUrl;

if (environment === 'development') {
  apiUrl = 'http://localhost:4000';
  clientUrl = 'http://localhost:3000';
} else {
  apiUrl = 'http://localhost:4000';
  clientUrl = 'http://localhost:3000';
}

export { apiUrl, clientUrl };
