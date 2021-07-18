import { BrowserRouter as Router, Switch } from "react-router-dom";

import ApolloProviderCustom from "./ApolloProvider";
import { AuthProvider } from "./context/auth";
import DynamicRoute from "./utils/DynamicRoute";

import Navigation from "./components/Navigations";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import Messages from "./pages/Messages/Messages";
import { UserDetailsProvider } from "./context/UserDetails";
import { PostsProvider } from "./context/posts";
import Friends from "./pages/Friends/Friends";

function App() {
  return (
    <ApolloProviderCustom>
      <AuthProvider>
        <UserDetailsProvider>
          <PostsProvider>
            <Router>
              <Navigation />
              <Switch>
                <DynamicRoute exact path="/" component={Home} authenticated />
                <DynamicRoute path="/auth" component={Auth} guest />
                <DynamicRoute exact path="/messages" component={Messages} authenticated />
                <DynamicRoute exact path="/friends" component={Friends} authenticated />
              </Switch>
            </Router>
          </PostsProvider>
        </UserDetailsProvider>
      </AuthProvider>
    </ApolloProviderCustom>
  );
}

export default App;
