import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { PointProvider } from "./PointContext";
import "./i18n";
// import { toast } from "react-toastify";

// toast.configure({
//   autoClose: 4000,
//   draggable: false,
//   closeButton: false,
//   draggablePercent: 100,
//   progressClassName: "ourbar",
//   position: "top-left",
//   style: { top: "90px" },
// });

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
