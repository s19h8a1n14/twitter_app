import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Widgets from "./Widgets/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase.init";
import { signOut } from "firebase/auth";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Modal, Box, TextField, Button } from "@mui/material";

const Home = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const { t } = useTranslation();
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const deviceInfoRef = useRef({ browser: null, device: null }); 
  const isDeviceVerifiedRef = useRef(false); 
  let isDeviceVerified = false;

  useEffect(() => {
    const getData = async () => {
      if (!deviceInfoRef.current.browser && !deviceInfoRef.current.device ) {
        // Check if both browser and device are undefined (one-time check)
        const response = await fetch(`http://localhost:5000/deviceInfo?email=${email}`);
        const data = await response.json();

        deviceInfoRef.current.browser = data.deviceInfo.browser;
        deviceInfoRef.current.device = data.deviceInfo.device;
        isDeviceVerifiedRef.current = data.isdeviceCompatible;

        console.log("data", deviceInfoRef.current);
        console.log("isdeviceVerified", isDeviceVerifiedRef.current);
      }
    };
    getData();
  });


  const browser = deviceInfoRef.current.browser;
  const device = deviceInfoRef.current.device;
  isDeviceVerified = isDeviceVerifiedRef.current;

  const SentOtp = () => {
    const Email = email;
    setOtp1("");
    setOtp2("");
    setOtp3("");
    setOtp4("");
    axios.post("http://localhost:5000/sendotp", { email: Email })
      .then((res) => {
        setOpenModal(true);
      })
      .catch((error) => {
        console.log("error in send OTP", error);
      });
  };


  const verifyOTP = () => {
    const userEmail = email;
    const otp = otp1 + otp2 + otp3 + otp4;
    return axios.post("http://localhost:5000/verifyotp", { otp: otp, email: userEmail })
      .then((res) => {
        console.log(res.data);
        if (res.data === "verified") {
          setOpenModal(false);
          setOpen(true);
          isDeviceVerified = true;
          console.log("OTP verified successfully");
        } else {
          console.log("Invalid OTP. Please try again.");

        }
      })
      .catch((err) => {
        console.error("Error verifying OTP:", err);

      });
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 380,
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
  };


  const inputContainerStyle = {
    display: "flex",
    alignitems: "center",
    justifyContent: "center"
  };

  const inputStyle = {
    marginRight: "10px",
    width: "50px",
    borderRadius: "5px",
    border: "1px solid #000",
  };

  const buttonstyle = {
    textAlign: "center",
    border: "1px solid #000",
    borderRadius: "30px",
    marginLeft: "110px",

  };

  const handleOpen = () => {
    document.getElementById("otp1").focus();
  };

  const handleOtpChange = (setter, nextInputId, prevInputId, event) => {
    const value = event.target.value.slice(0, 1);
    setter(value);
    if (value && nextInputId) {
      document.getElementById(nextInputId).focus();
    } else if (!value && prevInputId && event.code === "Backspace") {
      document.getElementById(prevInputId).focus();
    }
  };

  const otpModal = (
    <Modal
      open={openModal}
      onOpen={() => handleOpen()}
      onClose={() => setOpenModal(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={modalStyle}>
        <h2 id="parent-modal-title" style={{ textAlign: "center" }}>{t("OTP Verification")}</h2>
        <h4 style={{ textAlign: "center" }}>Since you are using {browser} or {device},we need to check you.{isDeviceVerified}</h4>
        <p id="parent-modal-description" style={{ padding: "15px" }}>

          {t("code has been sent to you : ")}
          {user.email.slice(0, 3) + "*****" + user.email.slice(13, user.email.length)}
        </p>

        <div className="otpField" style={inputContainerStyle}>
          <TextField
            style={inputStyle}
            id="otp1"
            value={otp1}
            onChange={(e) => handleOtpChange(setOtp1, "otp2", null, e)}
          />
          <TextField
            style={inputStyle}
            id="otp2"
            value={otp2}
            onChange={(e) => {
              setOtp2(e.target.value.slice(0, 1));
              const value = e.target.value.slice(0, 1);
              //setter(value);
              if (value && "otp3") {
                document.getElementById("otp3").focus();
              } else if (!value && "otp1" && e.which === "Backspace") {
                document.getElementById("otp1").focus();
              }
            }}
          />
          <TextField
            style={inputStyle}
            id="otp3"
            value={otp3}
            onChange={(e) => handleOtpChange(setOtp3, "otp4", "otp2", e)}
          />
          <TextField
            style={inputStyle}
            id="otp4"
            value={otp4}
            onChange={(e) => handleOtpChange(setOtp4, null, "otp3", e)}
          />
        </div>
        <p id="parent-modal-description" style={{ textAlign: "center" }}>
          {t("didn't receive the code?")}
          <Button onClick={SentOtp}>{t("Resend")}</Button>
        </p>
        <Button onClick={verifyOTP} style={buttonstyle}>{t("Verify OTP")}</Button>
      </Box>

    </Modal>
  );

  // useEffect(()=>{
  //      setTimeout(() => {
  //        if(!isDeviceVerified){
  //            signOut(auth);
  //         }
  //      }, 60000);
  // })

  const hasSentOtp = localStorage.getItem("hasSentOtp");

  // Call SentOtp outside useEffect (but only once)
  if (!hasSentOtp) {
    SentOtp();
    localStorage.setItem("hasSentOtp", true);
  }


  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="app">
      {otpModal}
      <Sidebar handleLogout={handleLogout} user={user} />
      <Outlet />
      <Widgets />

    </div>
  );
};

export default Home;
