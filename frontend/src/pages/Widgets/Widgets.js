import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterTweetEmbed,
} from "react-twitter-embed";
import "./Widgets.css";
import { useTranslation } from "react-i18next";
import SubscriptionBox from "./SubscriptionBox";

const Widgets = () => {
  const { t } = useTranslation();

  const handleSubscribe = () => {};
  return (
    <div className="box">
      <div className="widgets">
        <div className="widgets__input">
          <SearchIcon className="widgets__searchIcon" />
          <input placeholder={t("Search Twitter")} type="text" />
        </div>

        <SubscriptionBox />

        <div className="widgets__widgetContainer">
          <h2>{t("What's happening")}</h2>

          <TwitterTweetEmbed tweetId={"1557187138352861186"} />

          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="elonmusk"
            options={{ height: 400 }}
          />

          <TwitterShareButton
            url={"https://facebook.com/cleverprogrammer"}
            options={{ text: "#reactjs is awesome", via: "elonmusk" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Widgets;
