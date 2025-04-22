import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { TransporteProvider } from "./TransporteContext";
import { AuthProvider } from "./AuthContext"; // Nuevo
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TransporteProvider>
          <App />
        </TransporteProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
