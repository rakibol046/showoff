import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { adminLogIn } from "../features/auth/authSlice";

export default function useAuthCheck() {
  const dispatch = useDispatch();
  const [authCheck, setAuthCheck] = useState(false);

  useEffect(() => {
    const localAuth = localStorage?.getItem("auth");

    if (localAuth) {
      const auth = JSON.parse(localAuth);
      if (auth?.accessToken && auth?.admin) {
        dispatch(
          adminLogIn({
            accessToken: auth.accessToken,
            admin: auth.admin,
          })
        );
      }
    }
    setAuthCheck(true);
  }, [dispatch, setAuthCheck]);

  return authCheck;
}
