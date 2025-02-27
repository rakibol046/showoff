import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const isLoggedIn = useAuth();

  return isLoggedIn ? children : <Navigate to="/" />;
}
