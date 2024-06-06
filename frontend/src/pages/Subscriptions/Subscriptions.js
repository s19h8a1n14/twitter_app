import React from "react";
import "./Subscriptions.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Subscribe to Twitter Premium</h1>
        <p>Enjoy exclusive features and enhance your Twitter experience.</p>
        <div className="subscription-plans">
          <div className="plan">
            <h2>Monthly Plan</h2>
            <p className="price">₹189</p>
            <ul className="features">
              <li>Blue tick</li>
              <li>Unlimited posts per day</li>
              <li>Unlimited space for videos</li>
            </ul>
            <a
              href="https://buy.stripe.com/test_bIYcPY50A6web847su"
              className="subscribe-button"
            >
              Subscribe Now
            </a>
          </div>
          <div className="plan">
            <h2>Yearly Plan</h2>
            <p className="price">₹689</p>
            <ul className="features">
              <li>Blue tick</li>
              <li>Unlimited posts per day</li>
              <li>Unlimited space for videos</li>
            </ul>
            <a
              href="https://buy.stripe.com/test_cN2dU20Kkg6Oekg5kl"
              className="subscribe-button"
            >
              Subscribe Now
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
