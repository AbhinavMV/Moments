import { Redirect, Route } from "react-router-dom";
import { useAuthState } from "../context/auth";
import { useUserDetailsState } from "../context/UserDetails";

export default function DynamicRoute(props) {
  const { user } = useAuthState();
  const { userDetails } = useUserDetailsState();
  if (props.authenticated && !user) {
    return <Redirect to="/auth" />;
  } else if (props.guest && user) {
    return <Redirect to="/" />;
  } else if (props.authenticated && !userDetails && props.path !== "/") {
    return <Redirect to="/" />;
  } else return <Route component={props.component} {...props} />;
}
