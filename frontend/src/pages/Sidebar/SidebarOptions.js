import React from "react";
import "./SidebarOptions.css";
import { useTranslation } from "react-i18next";

const SidebarOptions = ({ active, text, Icon }) => {
  const { t } = useTranslation();

  return (
    <div className={`sidebarOptions ${active && "sidebarOptions_active"}`}>
      <Icon />
      <h2>{t(text)}</h2>
    </div>
  );
};

export default SidebarOptions;
