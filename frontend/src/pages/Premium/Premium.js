import React from "react";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from '@mui/icons-material/Done';
import "./Premium.css";


const Premium = () => {
  const navigate = useNavigate();
  const [loggedInUser] = UseLoggedInUser();
  const subscribed = loggedInUser[0]?.subscription;
  const plan = loggedInUser[0]?.isSubscribed;
 
  return (
    <>
   
      <div className="container">
      
      <nav className="navbar">
      <ArrowBackIcon
        className="arrow-icon"
        onClick={() => {
          navigate("/");
        }}
      />
      </nav>
        <h1>{"Premium Plans"}</h1>
        <div class="text-color">
        <h2>Enjoy exclusive features and enhance your Twitter experience. </h2>
        </div>
        <div className="card-grid">
          <div className="plan" id="bg1">
            <h2>{"Basic"}</h2>
            <span className="price">₹99.00</span><span class="small">/month</span>
           
            {!subscribed ? (
              <a
                href="https://buy.stripe.com/test_7sI6pW3V01kx4Kc4gg"
                className="subscribe-button"
              >
                subscribe
              </a>
            ) : plan === 1 ? (
              <span className="subscribe-button">{"Your Plan"}</span>
            ) : (
              <span className="subscribe-button">{"Subscribed"}</span>
            )}
{/* if(!subscribed){
  <a
  href="https://buy.stripe.com/test_7sI6pW3V01kx4Kc4gg"
  className="subscribe-button"
>
  subscribe
</a>
}else if(plan === 1){
  <span className="subscribe-button">{"Your Plan"}</span>
} */}


             <ul className="features">
              <li><DoneIcon className="done-icon"/>{"Black tick"}</li>
              <li><DoneIcon className="done-icon"/>{"Unlimited posts per day"}</li>
              <li><DoneIcon className="done-icon"/>{"Unlimited space for videos"}</li>
            </ul>
          </div>
          <div className="plan" id="bg2">
            <h2>{"Premium"}</h2>
            <span className="price">₹299.00</span><span class="small">/month</span>
            
            {!subscribed ? (
              <a
                href="https://buy.stripe.com/test_aEU4hO4Z4fbn1y0cMN"
                className="subscribe-button"
              >
                 subscribe
              </a>
            ) : plan === 2 ? (
              <span className="subscribe-button">{"Your Plan"}</span>
            ) : (
              <span className="subscribe-button">{"Subscribed"}</span>
            )}
            <ul className="features">
              <li><DoneIcon className="done-icon"/>{"Blue tick"}</li>
              <li><DoneIcon className="done-icon"/>{"Unlimited posts per day"}</li>
              <li><DoneIcon className="done-icon"/>{"Unlimited space for videos"}</li>
            </ul>
          </div>
          <div className="plan" id="bg3">
            <h2>{"Premium+"}</h2>
            <span className="price">₹499.00</span><span class="small">/month</span>
           
            {!subscribed ? (
              <a
                href="https://buy.stripe.com/test_3csdSo0IOe7j6SkfZ0"
                className="subscribe-button"
              >
                subscribe
              </a>
            ) : plan === 3 ? (
              <span className="subscribe-button">{"Your Plan"}</span>
            ) : (
              <span className="subscribe-button">{"Subscribed"}</span>
            )}
            <ul className="features">
              <li><DoneIcon className="done-icon"/>{"Golden tick"}</li>
              <li><DoneIcon className="done-icon"/>{"Unlimited posts per day"}</li>
              <li><DoneIcon className="done-icon"/>{"Unlimited space for videos"}</li>
            </ul>
          </div>
          
        </div>
    </div>
    </>
  );
};

export default Premium;