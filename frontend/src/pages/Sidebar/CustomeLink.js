import React from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

const CustomeLink = ({ children, to, ...props }) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });
  return (
    <div>
      <Link
        to={to}
        style={{
          textDecoration: "none",
          color: match ? "black" : "black",
        }}
        {...props}
      >
        {children}
      </Link>
    </div>
  );
};

export default CustomeLink;
