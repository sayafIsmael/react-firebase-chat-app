import { useRouter } from "next/router";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Auth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
      console.log("auth current user: ", Object.keys(currentUser).length);
      if (!currentUser || Object.keys(currentUser).length == 0) {
        router.push("/login");
      }
    }, [currentUser]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default Auth;
