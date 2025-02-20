import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { TransporteProvider } from "./TransporteContext.jsx";

const rootElement = document.getElementById("root");

// 🚀 Debug: Si `rootElement` es `null`, mostramos un mensaje en consola
if (!rootElement) {
  console.error("⚠️ ERROR: No se encontró el elemento con id='root'. Verifica index.html.");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TransporteProvider>
        <App />
      </TransporteProvider>
    </React.StrictMode>
  );
}
