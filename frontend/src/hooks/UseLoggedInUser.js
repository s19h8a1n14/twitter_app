import { useEffect, useState } from "react";
// import Widgets from "../pages/Widgets/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import API_CONFIG from "../config/api";

const UseLoggedInUser = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/loggedInUser?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setLoggedInUser(data);
      })
      .catch((error) => {
        // Error fetching user data
      });
  }, [email, loggedInUser]);

  return [loggedInUser, setLoggedInUser];
};

export default UseLoggedInUser;
