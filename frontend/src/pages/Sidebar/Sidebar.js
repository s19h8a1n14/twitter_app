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
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
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
  const { t } = useTranslation();
  const [loggedInUser] = UseLoggedInUser();


  const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0].profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
  // const result = user[0]?.email?.split("@")[0];
  const result = loggedInUser[0]?.email?.split("@")[0];

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);
  const handleClickMore = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleCloseMore = () => {
    setAnchor(null);
  };

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

      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickMore}
        style={{ width: '160px', height: '60px', backgroundColor: 'inherit', marginLeft: '-5px' }}
      >
        <SidebarOptions Icon={MoreIcon} text="More" />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchor}
        open={open}
        onClose={handleCloseMore}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        style={{
          position: 'absolute',
          top: '0px',
          left: '15px',
        }}
      >
        {/* <MenuItem style={{ height: '47px', width: '200px', backgroundColor: 'inherit', }} onClick={handleCloseMore}>
          <SidebarOptions Icon={StarsIcon} text="Points" />
        </MenuItem> */}
        {/* <hr style={{ border: '0.5px solid #ccc' }} /> */}
        <MenuItem style={{ height: '47px', width: '200px', marginRight: '20px', backgroundColor: 'inherit', }} onClick={handleCloseMore}>

          <CustomeLink to="/home/savedPosts"><SidebarOptions Icon={BookmarkIcon} text="Saved Posts" /> </CustomeLink>
        </MenuItem>
        <hr style={{ border: '0.5px solid #ccc' }} />
        <MenuItem style={{ height: '47px', width: '200px', backgroundColor: 'inherit', }} onClick={handleCloseMore}>
          <CustomeLink to="/home/likedposts"><SidebarOptions Icon={FavoriteIcon} text="Liked Posts" /> </CustomeLink></MenuItem>
        <hr style={{ border: '0.5px solid #ccc' }} />
        <MenuItem style={{ height: '47px', width: '200px', backgroundColor: 'inherit', }} onClick={handleCloseMore}>
          <CustomeLink to="/home/settings"><SidebarOptions Icon={SettingsIcon} text="Settings" /> </CustomeLink> </MenuItem>
      </Menu>


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
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          style={{
            position: 'absolute',
            left: '-220px',
            top: '20px',
          }}
          onClick={handleClose}
          onClose={handleClose}
        >
          <MenuItem style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
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
          <hr style={{ border: '0.5px solid #ccc', margin: '2px 0' }} />
          <MenuItem onClick={handleClose} style={{ height: '50px', display: 'flex', alignItems: 'center' }}>{t("Add an exisiting account")}</MenuItem>
          <hr style={{ border: '0.5px solid #ccc', margin: '2px 0' }} />
          <MenuItem onClick={handleLogout} style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
            {t("Log out  ")}@{result}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
