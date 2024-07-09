import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";
import { auth } from "../../firebase.init";
import { Button, Menu, createTheme, ThemeProvider, MenuItem, Modal, Box, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
// import { makeStyles } from '@material-ui/core/styles';
import LanguageIcon from '@mui/icons-material/Language';
import Snackbar from "@mui/material/Snackbar";
import "./Feed.css";


const languages = [
    { code: "be", name: "Bengali" },
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "hi", name: "Hindi" },
    { code: "po", name: "Portuguese" },
    { code: "sp", name: "Spanish" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" }
];


const customTheme = createTheme({
    palette: {
        background: {
            paper: '#f5f5f5', // Set custom menu background color (optional)
        },
        action: {
            hover: '#e0e0e0', // Set custom hover background color (optional)
        },
    },
});

// const useStyles = makeStyles((theme) => ({
//     button: {
//       '&:hover': {
//         backgroundColor: theme.palette.action.hover, // Change background on hover
//         '& .MuiButton-endIcon': { // Target the LanguageIcon within the button
//           borderRadius: '50%', // Make icon circular on hover
//         },
//       },
//       '& .MuiButton-endIcon': { // Target the LanguageIcon within the button
//         color: 'inherit', // Inherit button color for normal state
//         transition: 'color 0.3s ease-in-out', // Add smooth color transition
//       },
//       '&.Mui-focusVisible': { // Optional: Style for keyboard focus
//         outline: 'none', // Remove default outline on focus
//       },
//     },
//     clicked: { // Optional: Style for clicked state (if needed)
//       backgroundColor: '#90EE90', // Light green background on click (replace with desired color)
//     },
//   }));




const LanguageChanger = () => {
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
    // const classes = useStyles();
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const { i18n } = useTranslation();




    useEffect(() => {
        const storedLanguage = localStorage.getItem("selectedLanguage");
        if (storedLanguage) {

            i18n.changeLanguage(storedLanguage).catch(error => {
                console.error("Error changing language:", error);
            });
            setCode(storedLanguage);
            console.log("storedLanguage", storedLanguage);
        }
    }, [i18n]);



    const handleCloseSnackbar = () => {
        setOpen(false);
    };


    const handleClose = () => {
        setAnchorEl(null);
        setIsClicked(!isClicked);
    };


    const verifyOTP = () => {
        const userEmail = email;
        const otp = otp1 + otp2 + otp3 + otp4;
        console.log(otp);
        return axios.post("https://twitter-app-zck5.onrender.com/verifyotp", { otp: otp, email: userEmail })
            .then((res) => {
                console.log(res.data);
                if (res.data === "verified") {
                    i18n.changeLanguage(code);
                    setOpenModal(false);
                    setOpen(true);
                    localStorage.setItem("selectedLanguage", code);
                } else {
                    console.log("Invalid OTP. Please try again.");
                }
            })
            .catch((err) => {
                console.error("Error verifying OTP:", err);
            });
    };
    const requestOTP = () => {
        const userEmail = email;
        setOtp1("");
        setOtp2("");
        setOtp3("");
        setOtp4("");
        axios.post("https://twitter-app-zck5.onrender.com/sendotp", { email: userEmail })
            .then((response) => {
                console.log(response.data);
                setOpenModal(true);
            })
            .catch((error) => {
                console.log("error in send OTP", error);
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
        borderRadius: "8px",
        // border: "1px solid #000",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.25)",
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
        border: "1px solid #000"
    };

    const buttonstyle = {
        textAlign: "center",
        border: "1px solid #000",
        borderRadius: "30px",
        marginLeft: "130px",

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
                    <Button onClick={() => changeLanguages(code)}>{t("Resend")}</Button>
                </p>
                <Button onClick={verifyOTP} style={buttonstyle}>{t("Verify OTP")}</Button>
            </Box>

        </Modal>
    );

    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleHover = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    const handleClickWrapper = (event) => {
        setAnchorEl(event.currentTarget);
        setIsClicked(!isClicked); // Toggle click state on button click
    };



    return (
        <ThemeProvider theme={customTheme}>
            <div>
                <Button
                    id="basic-button"
                    aria-controls={isHovered ? 'basic-menu' : undefined} // Control aria-controls based on hover
                    aria-haspopup="true"
                    aria-expanded={isHovered ? 'true' : undefined}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                    onClick={handleClickWrapper}

                >
                    <IconButton sx={{ color: 'black', backgroundColor: 'inherit', '&:hover': { color: 'rgb(15, 177, 241)', backgroundColor: 'rgb(173, 226, 247)' } }}>
                        <close id="languages"> <LanguageIcon style={{ fontSize: "30px", color: isClicked ? 'lightgreen' : 'inherit', }} /> </close>

                    </IconButton>
                    {/* {isHovered && ( // Only render circle on hover
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', // Transparent circle background
                                borderRadius: '50%',
                            }}
                        />
                    )} */}
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    onClick={handleClose}
                    onClose={handleClose}
                >

                    {languages.map((language) => (
                        <div key={language.code} style={{ padding: '2px' }}>
                            <MenuItem onClick={() => changeLanguages(language.code)}>
                                {language.name}
                            </MenuItem>
                            {languages.indexOf(language) !== languages.length - 1 && (
                                <hr style={{ border: '0.5px solid #ccc', margin: '2px 0' }} />
                            )}
                        </div>
                    ))}

                </Menu >
                {otpModal}
                < Snackbar
                    open={open}
                    autoHideDuration={10000}
                    onClose={handleCloseSnackbar}
                    message={t("OTP verified successfully!")}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                />
            </div >
        </ThemeProvider>
    );
};

export default LanguageChanger;