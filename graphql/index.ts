import { GraphQLClient } from "graphql-request";
import { IToken } from "../interfaces";

// const endpoint = 'http://localhost:5000/graphql';
const endpoint = process.env.NEXT_PUBLIC_URL!;

console.log("EndPOint", endpoint)

export const graphQLClientForFrontend = new GraphQLClient(endpoint, {
  credentials: "include",
  mode: "cors"
});

export const graphQLClientForServer = (token: IToken) => {
  return new GraphQLClient(endpoint, {
    headers: {
        accesstoken: token.accesstoken,
        idtoken: token.idtoken    
    }
  })
}