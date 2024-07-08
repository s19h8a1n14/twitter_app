import React, { useState,useContext } from 'react'
import StarsIcon from '@mui/icons-material/Stars';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { RewardPointsContext } from '../../RewardPointsContext';
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import { useTranslation } from "react-i18next";

const RewardPoints = () => {
    const { points, updatePoints } = useContext(RewardPointsContext);
    const [loggedInUser] = UseLoggedInUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const { t } = useTranslation();
    const handleHover = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    updatePoints(loggedInUser[0]?.Points);

    const handleClickWrapper = (event) => {
        setAnchorEl(event.currentTarget);
        setIsClicked(!isClicked); // Toggle click state on button click
    };


    const handleClose = () => {
        setAnchorEl(null);
        setIsClicked(!isClicked);
    };



    return (
       
        <div>
            <Button
                id="basic-menu"
                aria-controls={isHovered ? 'basic-menu' : undefined} // Control aria-controls based on hover
                aria-haspopup="true"
                aria-expanded={isHovered ? 'true' : undefined}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
                onClick={handleClickWrapper}

            >
                <IconButton sx={{ color: 'black', backgroundColor: 'inherit', '&:hover': { color: 'orange', backgroundColor: 'rgb(237, 164, 209)' } }}>
                    <close id="points"> <StarsIcon style={{ fontSize: "30px", color: isClicked ? 'lightgreen' : 'inherit', }} /> </close>
                </IconButton>
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
               <MenuItem style={{ height: '40px', width: '160px',backgroundColor: 'rgb(237, 164, 209)'  }} onClick={handleClose}>
                  {t("Your Points")} : {points}
                </MenuItem>


            </Menu >

        </div>
    )
}

export default RewardPoints