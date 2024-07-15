import React, { useEffect, useState } from "react";
import Widgets from "../pages/Widgets/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";

const UseLoggedInUser = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    fetch(`https://twitter-1-8ggt.onrender.com/loggedInUser?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setLoggedInUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [email, loggedInUser]);

  return [loggedInUser, setLoggedInUser];
};

export default UseLoggedInUser;
