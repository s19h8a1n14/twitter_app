import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { PointProvider } from "./PointContext";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <PointProvider>
        <React.Suspense fallback="loading...">
          <App />
        </React.Suspense>
      </PointProvider>
    </Router>
  </React.StrictMode>
);
