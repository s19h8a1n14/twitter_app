import React, { useState, useContext } from "react";
import XIcon from "@mui/icons-material/X";
import "./Sidebar.css";
import SidebarOptions from "./SidebarOptions";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LabelIcon from "@mui/icons-material/Label";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from "@mui/material/Divider";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CustomeLink from "./CustomeLink";
import More from "@mui/icons-material/More";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import { PointContext } from "../../PointContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../Feed/LanguageSelector";

const Sidebar = ({ handleLogout, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [loggedInUser] = UseLoggedInUser();
  const { t } = useTranslation();

  const { points, setPoints } = useContext(PointContext);

  setPoints(loggedInUser[0]?.points);

  const userProfilePic = loggedInUser[0]?.profileImage
    ? loggedInUser[0].profileImage
    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

  const result = user[0]?.email?.split("@")[0];

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="sidebar">
      <div className="icon">
        <XIcon className="sidebar_twitterIcon" />
        <p className="point">{points}</p>
      </div>
      <LanguageSelector />
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
      <CustomeLink to="/home/bookmarks">
        <SidebarOptions Icon={BookmarkBorderIcon} text="Bookmarks" />
      </CustomeLink>
      <CustomeLink to="/home/lists">
        <SidebarOptions Icon={LabelIcon} text="Badges" />
      </CustomeLink>
      <CustomeLink to="/home/profile">
        <SidebarOptions Icon={PermIdentityIcon} text="Profile" />
      </CustomeLink>
      <CustomeLink to="/home/more">
        <SidebarOptions Icon={MoreIcon} text="More" />
      </CustomeLink>
      <CustomeLink to="/home/subscribe">
        <SidebarOptions Icon={CardMembershipIcon} text="Subscribe" />
      </CustomeLink>
      <Button variant="outlined" className="sidebar_tweet" fullWidth>
        {t("Tweet")}
      </Button>
      <div className="Profile_info">
        <Avatar src={userProfilePic} />
        <div className="user_info">
          <h4>
            {loggedInUser[0]?.name
              ? loggedInUser[0]?.name
              : user && user[0]?.displayName}
          </h4>
          <p>@{result}</p>
        </div>
        <IconButton
          size="small"
          sx={{ ml: 2 }}
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
          <MenuItem className="profile_info1">
            <Avatar src={userProfilePic} />
            <div className="user_info subUser_info">
              <div>
                <h5>
                  {loggedInUser[0]?.name
                    ? loggedInUser[0]?.name
                    : user && user[0]?.displayName}
                </h5>
                <p>@{result}</p>
              </div>
              <ListItemIcon className="done_icon">
                <DoneIcon />
              </ListItemIcon>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Add an exisiting account</MenuItem>
          <MenuItem onClick={handleLogout}>
            Log out @{loggedInUser[0]?.userName}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
