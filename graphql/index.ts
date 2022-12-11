import { GraphQLClient } from "graphql-request";
import { IToken } from "../interfaces";

// const endpoint = 'http://localhost:5000/graphql';
const endpoint = process.env.NEXT_PUBLIC_URL as string;

console.log("EndpOint", endpoint)

export const graphQLClientForFrontend = new GraphQLClient(endpoint, {
  credentials: "include",
  mode: "cors",
  errorPolicy: "all"
});

export const graphQLClientForServer = (token: IToken) => {
  return new GraphQLClient(endpoint, {
    headers: {
      accesstoken: token.accesstoken as string,
      idtoken: token.idtoken as string
    },
    credentials: "include",
    mode: "cors",
    errorPolicy: "all"
  })
}