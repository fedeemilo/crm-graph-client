import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "node-fetch";
import { setContext } from "apollo-link-context";

let local = "http://localhost:4000/";
let prod = "https://crm-graph-server.herokuapp.com/";

const httpLink = createHttpLink({
  uri: prod,
  fetch
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
});

export default client;
