import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";
import auth from "../../firebase.init";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
];

const LanguageSelector = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [user] = useAuthState(auth);
  const email = user?.email;

  const { i18n } = useTranslation();

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguages = (code) => {
    const userEmail = email;

    axios
      .post("http://localhost:5000/sendotp", { email: userEmail })
      .then((res) => {
        console.log(res.data);
        const otp = prompt("Enter OTP sent to your email:");

        axios
          .post("http://localhost:5000/verify", { otp, email: userEmail })
          .then((res) => {
            console.log(res.data);
            if (res.data === "Verified") {
              i18n.changeLanguage(code);
            } else {
              alert("Invalid OTP. Please try again.");
            }
          })
          .catch((err) => {
            console.error("Error verifying OTP:", err);
            alert("Failed to verify OTP. Please try again later.");
          });
      })
      .catch((err) => {
        console.error("Error requesting OTP:", err);
        alert("Failed to request OTP. Please try again later.");
      });
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Select Lang
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
    </div>
  );
};

export default LanguageSelector;
