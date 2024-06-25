import React, { useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import "./Sidebar.css";
import SidebarOptions from "./SidebarOptions";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from "@mui/material/Divider";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CustomeLink from "./CustomeLink";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import { useTranslation } from "react-i18next";

const Sidebar = ({ handleLogout, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [loggedInUser] = UseLoggedInUser();
  const { t } = useTranslation();

  const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0].profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
  const result = user[0]?.email?.split("@")[0];

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="sidebar">
      <TwitterIcon className="sidebar_twitterIcon" />
      <CustomeLink to="/home/feed">
        <SidebarOptions active Icon={HomeIcon} text="Home" />
      </CustomeLink>
      <CustomeLink to="/home/explore">
        <SidebarOptions Icon={SearchIcon} text="Explore" />
      </CustomeLink>
      <CustomeLink to="/home/notifications">
        <SidebarOptions Icon={NotificationsNoneIcon} text="Notifications" />
      </CustomeLink>
      <CustomeLink to="/home/messages">
        <SidebarOptions Icon={MailOutlineIcon} text="Messages" />
      </CustomeLink>
      <CustomeLink to="/home/Premium">
        <SidebarOptions Icon={TwitterIcon} text="Premium" />
      </CustomeLink>
      <CustomeLink to="/home/lists">
        <SidebarOptions Icon={ListAltIcon} text="Lists" />
      </CustomeLink>
      <CustomeLink to="/home/profile">
        <SidebarOptions Icon={PermIdentityIcon} text="Profile" />
      </CustomeLink>
      <CustomeLink to="/home/more">
        <SidebarOptions Icon={MoreIcon} text="More" />
      </CustomeLink>
      <Button variant="outlined" className="sidebar_tweet" fullWidth>
      {t("Tweet")}
      </Button>
      <div className="Profile_info">
        <Avatar src={userProfilePic} />
        <div className="user_info">
          <h4>
            {loggedInUser[0]?.name ? loggedInUser[0]?.name : user && user[0]?.displayName}
          </h4>
          <p>@{result}</p>
        </div>
        <IconButton
          size="small"
          sx={{ ml: 1 }}
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClick={handleClose}
          onClose={handleClose}
        >
          <MenuItem >
            <Avatar src={userProfilePic} />
            <div className="subUser_info">
              <div className="user_info">
                <h4>
                  {loggedInUser[0]?.name ? loggedInUser[0]?.name : user && user[0]?.displayName}
                </h4>
                <p>@{result}</p>
              </div>
              <ListItemIcon className="done_icon">
                <DoneIcon />
              </ListItemIcon>
            </div>
          </MenuItem>
          {/* <Divider /> */}
          <MenuItem onClick={handleClose}>{t("Add an exisiting account")}</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            Log out @{loggedInUser[0]?.userName}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
