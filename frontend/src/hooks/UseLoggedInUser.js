import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase.init";

const UseLoggedInUser = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    fetch(`https://twitter-app-zck5.onrender.com/loggedInUser?email=${email}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
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
