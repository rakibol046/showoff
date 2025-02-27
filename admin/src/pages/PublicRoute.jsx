import { useNavigate, Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function PublicRoute({ children }) {
  let navigate = useNavigate();
  const isLoggedIn = useAuth();

  return !isLoggedIn ? children : <Navigate to="/inbox" />;
}
