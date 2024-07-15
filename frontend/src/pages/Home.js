import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Feed from "./Feed/Feed";
import { Outlet } from "react-router-dom";
import Widgets from "./Widgets/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import { signOut } from "firebase/auth";
import UseLoggedInUser from "../hooks/UseLoggedInUser";
import axios from "axios";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
//import LanguageSelector from "./Feed/LanguageSelector";

const Home = () => {
  const user = useAuthState(auth);
  const [loggedInUser] = UseLoggedInUser();
  const email = loggedInUser[0]?.email;
  console.log(email);
  const { t } = useTranslation();
  const [login, setLogin] = useState([]);
  const [sent, setSent] = useState(false);
  const [check, setCheck] = useState({});
  const [otpCheck, setOtpCheck] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");

  // useEffect(() => {
  //   if (loggedInUser && loggedInUser[0]?.loginHistory) {
  //     const loginHistory = loggedInUser[0]?.loginHistory;
  //     setLogin(loginHistory);
  //     const len = loginHistory?.length;
  //     const index = len - 1;
  //     if (index >= 0) {
  //       setCheck(loginHistory[index]);
  //       console.log(check);
  //       setOtpCheck(check?.isOtpVerified);
  //       console.log(check?.isOtpVerified);
  //     }
  //   }
  // }, [loggedInUser]);

  // useEffect(() => {
  //   if (check?.isOtpVerified === false) {
  //     console.log("No need to verify OTP.");
  //   } else if (check?.isOtpVerified === true) {
  //     // setOpenModal(true);
  //     if (sent === false) {
  //       requestOTP();
  //       setSent(true);
  //     }
  //   }
  // }, [otpCheck]);

  // const sendOTP = (email) => {
  //   setOtp1("");
  //   setOtp2("");
  //   setOtp3("");
  //   setOtp4("");
  //   return axios.post(
  //     `https://twitter-1-8ggt.onrender.com/sendotp?email=${email}`,
  //     {
  //       email,
  //     }
  //   );
  // };

  // const verifyOTP = async () => {
  //   const userEmail = email;
  //   const otp = otp1 + otp2 + otp3 + otp4;
  //   console.log(otp);
  //   return axios
  //     .post("https://twitter-1-8ggt.onrender.com/verify", {
  //       otp,
  //       email: userEmail,
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //       if (res.data === "Verified") {
  //         setOpenModal(false);
  //         const response = axios.patch(
  //           "https://twitter-1-8ggt.onrender.com/verifyDevice",
  //           {
  //             email: userEmail,
  //           }
  //         );
  //         setDesc("OTP verified successfully.");
  //         setOpen(true);
  //         setSent(false);
  //       } else {
  //         alert("Invalid OTP. Please try again.");
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error verifying OTP:", err);
  //       alert("Failed to verify OTP. Please try again later.");
  //     });
  // };

  // const requestOTP = () => {
  //   const userEmail = email;
  //   sendOTP(userEmail)
  //     .then((otpResponse) => {
  //       console.log(otpResponse.data);
  //       setOpenModal(true);
  //     })
  //     .catch((err) => {
  //       console.error("Error requesting OTP:", err);
  //       alert("Failed to request OTP. Please try again later.");
  //     });
  // };

  // const modalStyle = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   width: 400,
  //   backgroundColor: "#ffffff",
  //   border: "2px solid #000",
  //   boxShadow: "0px 0px 24px rgba(0, 0, 0, 0.25)",
  //   padding: "16px",
  // };

  // const inputContainerStyle = {
  //   display: "flex", // Display children in a row
  //   justifyContent: "center", // Center-align children horizontally
  // };

  // const inputStyle = {
  //   marginRight: "8px", // Add right margin between text fields
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // fetch from router /time
  //     axios.get("https://twitter-1-8ggt.onrender.com/time").then((res) => {
  //       if (res.data === "Access granted") {
  //         // do something
  //       } else {
  //         // logout the user and redirect
  //         signOut(auth).then(() => {
  //           window.location.href = "/login";
  //         });
  //       }
  //     });
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, []);

  // const otpModal = (
  //   <Modal
  //     open={openModal}
  //     onClose={() => setOpenModal(false)}
  //     aria-labelledby="parent-modal-title"
  //     aria-describedby="parent-modal-description"
  //   >
  //     <Box sx={modalStyle}>
  //       <h2 id="parent-modal-title">Enter OTP to Verify Device</h2>
  //       <p id="parent-modal-description">
  //         {t("We have sent OTP to your email:")} {user.email}
  //       </p>
  //       <div className="otpField" style={inputContainerStyle}>
  //         <TextField
  //           style={inputStyle}
  //           value={otp1}
  //           onChange={(e) => {
  //             setOtp1(e.target.value.slice(0, 1));
  //             if (e.target.value.length === 1) {
  //               document.getElementById("otp2").focus();
  //             }
  //           }}
  //         />
  //         <TextField
  //           style={inputStyle}
  //           id="otp2"
  //           value={otp2}
  //           onChange={(e) => {
  //             setOtp2(e.target.value.slice(0, 1));
  //             if (e.target.value.length === 1) {
  //               document.getElementById("otp3").focus();
  //             }
  //           }}
  //         />
  //         <TextField
  //           style={inputStyle}
  //           id="otp3"
  //           value={otp3}
  //           onChange={(e) => {
  //             setOtp3(e.target.value.slice(0, 1));
  //             if (e.target.value.length === 1) {
  //               document.getElementById("otp4").focus();
  //             }
  //           }}
  //         />
  //         <TextField
  //           style={inputStyle}
  //           id="otp4"
  //           value={otp4}
  //           onChange={(e) => setOtp4(e.target.value.slice(0, 1))}
  //         />
  //       </div>
  //       <Button onClick={verifyOTP}>Verify OTP</Button>
  //     </Box>
  //   </Modal>
  // );

  const handleLogout = () => {
    signOut(auth);
  };
  return (
    <div className="app">
      <Sidebar handleLogout={handleLogout} user={user} />

      <Outlet />
      <Widgets />
      {/* {otpModal} */}
    </div>
  );
};

export default Home;
