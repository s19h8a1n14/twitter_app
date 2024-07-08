import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { RewardPointsProvider } from "./RewardPointsContext";
import './i18n';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <RewardPointsProvider>
      <React.Suspense fallback="loading...">
        <App />
      </React.Suspense>
    </RewardPointsProvider>
  </Router>
  </React.StrictMode >
);
