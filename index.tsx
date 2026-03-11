import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress defaultProps warning from Recharts
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  originalConsoleError(...args);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);