
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Target container 'root' not found.");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error("BOOT_ERROR:", err);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="color:#00ff41; font-family:monospace; padding:2rem; border:1px solid #00ff41; margin:2rem;">[ SYSTEM_HALT ]<br/><br/>${err.message}</div>`;
  }
}
