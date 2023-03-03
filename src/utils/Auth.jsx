import { useRouter } from "next/router";
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Auth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
      if (!currentUser) {
        router.push("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default Auth;
