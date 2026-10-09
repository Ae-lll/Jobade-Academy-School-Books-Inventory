import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import EduStockProvider from "./context/EduStockContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <EduStockProvider>
        <App />
      </EduStockProvider>
    </AuthProvider>
  </StrictMode>,
)
