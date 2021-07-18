import React, { Children } from "react";
import { split, ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";

import { BackendLink, WSLink } from "./config";

let httpLink = new createUploadLink({
  uri: BackendLink,
  headers: {
    "keep-alive": true,
  },
});

const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem("profile"))?.token || null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

httpLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
  uri: WSLink,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${JSON.parse(localStorage.getItem("profile"))?.token}`,
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default function ApolloProviderCustom(props) {
  return <ApolloProvider client={client} {...props} />;
}
