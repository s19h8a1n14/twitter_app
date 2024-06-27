import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";
import auth from "../../firebase.init";
import { Modal, Box, TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import LanguageIcon from "@mui/icons-material/Language";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "te", name: "Telugu" },
  { code: "be", name: "Bengali" },
  { code: "sp", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "po", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
];

const LanguageSelector = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const otp1Ref = useRef(null);

  const { i18n } = useTranslation();
  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage");
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
      setCode(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  // useEffect(() => {
  //   if (openModal && otp1Ref.current) {
  //     console.log("Focusing on otp1 input field");
  //     otp1Ref.current.focus();
  //   }
  // }, [openModal]);

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const sendOTP = (email) => {
    setOtp1("");
    setOtp2("");
    setOtp3("");
    setOtp4("");
    return axios.post("http://localhost:5000/sendotp", { email });
  };
  const verify = () => {
    const userEmail = email;
    const otp = otp1 + otp2 + otp3 + otp4;
    console.log(otp);
    return axios
      .post("http://localhost:5000/verify", { otp, email: userEmail })
      .then((res) => {
        console.log(res.data);
        if (res.data === "Verified") {
          i18n.changeLanguage(code);
          setOpenModal(false);
          setOpen(true);
          localStorage.setItem("selectedLanguage", code);
        } else {
          alert("Invalid OTP. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error verifying OTP:", err);
        alert("Failed to verify OTP. Please try again later.");
      });
  };

  const requestOTP = () => {
    const userEmail = email;
    sendOTP(userEmail)
      .then((otpResponse) => {
        console.log(otpResponse.data);
        setOpenModal(true);
      })
      .catch((err) => {
        console.error("Error requesting OTP:", err);
        alert("Failed to request OTP. Please try again later.");
      });
  };

  const changeLanguages = (code) => {
    setCode(code);
    requestOTP();
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "#ffffff",
    border: "2px solid #000",
    boxShadow: "0px 0px 24px rgba(0, 0, 0, 0.25)",
    padding: "16px",
  };

  const inputContainerStyle = {
    display: "flex", // Display children in a row
    justifyContent: "center", // Center-align children horizontally
  };

  const inputStyle = {
    marginRight: "8px", // Add right margin between text fields
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
  const handleOpen = () => {
    document.getElementById("otp1").focus();
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
        <h2 id="parent-modal-title">{t("Enter OTP to Change Language")}</h2>
        <p id="parent-modal-description">
          {t("We have sent OTP to your email:")}
          {user.email}
        </p>
        <div className="otpField" style={inputContainerStyle}>
          <TextField
            style={inputStyle}
            id="otp1"
            value={otp1}
            onChange={(e) => handleOtpChange(setOtp1, "otp2", null, e)}
            //inputRef={otp1Ref}
            // onChange={(e) => {
            //   setOtp1(e.target.value.slice(0, 1));
            //   if (e.target.value.length === 1) {
            //     document.getElementById("otp2").focus();
            //   }
            // }}
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
            // onChange={(e) => {
            //   setOtp2(e.target.value.slice(0, 1));
            //   if (e.target.value.length === 1) {
            //     document.getElementById("otp3").focus();
            //   }
            // }}
          />
          <TextField
            style={inputStyle}
            id="otp3"
            value={otp3}
            onChange={(e) => handleOtpChange(setOtp3, "otp4", "otp2", e)}
            // onChange={(e) => {
            //   setOtp3(e.target.value.slice(0, 1));
            //   if (e.target.value.length === 1) {
            //     document.getElementById("otp4").focus();
            //   }
            // }}
          />
          <TextField
            style={inputStyle}
            id="otp4"
            value={otp4}
            onChange={(e) => handleOtpChange(setOtp4, null, "otp3", e)}
            // onChange={(e) => setOtp4(e.target.value.slice(0, 1))}
          />
        </div>
        <Button onClick={verify}>{t("Verify OTP")}</Button>
      </Box>
    </Modal>
  );

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <LanguageIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClick={handleClose}
        onClose={handleClose}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} onClick={() => changeLanguages(lang.code)}>
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
      {otpModal}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={t("OTP verified successfully!")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </div>
  );
};

export default LanguageSelector;
