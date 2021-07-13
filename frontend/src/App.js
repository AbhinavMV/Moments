import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useState } from "react";

import Navigation from "./components/Navigations";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import Messages from "./pages/Messages/Messages";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(JSON.parse(localStorage.getItem("profile")));
  console.log(isSignedIn);
  return (
    <Router>
      <Navigation user={isSignedIn} />
      <Switch>
        {isSignedIn && <Route exact path="/" render={() => <Home />} />}
        {isSignedIn && <Route exact path="/messages" render={() => <Messages />} />}
        {!isSignedIn && <Route path="/auth" render={() => <Auth setUser={setIsSignedIn} />} />}
        {!isSignedIn && <Redirect from="/" to="/auth" />}
      </Switch>
    </Router>
  );
}

export default App;
