import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SubscriptionBox.css";
import { Modal } from "@mui/material";
import Subscriptions from "../Subscriptions/Subscriptions";
import Subscribe from "./Subscribe";
import Points from "./Points";

const SubscriptionBox = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openPointModal, setOpenPointModal] = useState(false);
  const handleSubscribe = () => {
    // navigate("/home/subscribe");
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const handlePoints = () => {
    setOpenPointModal(true);
  };

  const handleModalClose = () => {
    setOpenPointModal(false);
  };

  const subscribeModal = (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Subscribe onClose={handleClose} />
    </Modal>
  );
  const pointModal = (
    <Modal
      open={openPointModal}
      onClose={handleModalClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Points onClose={handleModalClose} />
    </Modal>
  );

  return (
    <div className="subscription-box">
      <h3 className="subscription-title">Subscribe to Premium</h3>
      <p className="subscription-text">
        Subscribe to unlock new features and if eligible, receive a share of ads
        revenue.
      </p>
      <div className="button">
        <button className="subscribe-buttons" onClick={handleSubscribe}>
          Subscribe
        </button>
        <button className="subscribe-buttons" onClick={handlePoints}>
          points
        </button>
      </div>
      {subscribeModal}
      {pointModal}
    </div>
  );
};

export default SubscriptionBox;
