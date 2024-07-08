import React from 'react'
import "../Page.css";
import { useTranslation } from "react-i18next";

const Settings = () => {
    const { t } = useTranslation ();
  return (
    <div className="page">
    <h2 className="pageTitle">{t("Welcome to Settings ")}</h2>
  </div>
  )
}

export default Settings