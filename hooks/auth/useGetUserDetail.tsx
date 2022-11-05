import request, { gql } from 'graphql-request';
import { graphQLClientForServer } from '../../graphql';
import { IToken } from '../../interfaces';

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  pic: string;
  username: string;
  numberOfPosts: number;
  numberOfFollowings: number;
  numberOfFollowers: number;
}

export interface IGetUserDetailServerResponse {
  getUserDetail: {
    message: string;
    isSuccess: boolean;
    user: User;
  };
}

export interface IGetUserDetail {
  user: User | null;
  isAuth: boolean;
}

async function getUserDetail(tokens: IToken) {
  if (!tokens.accesstoken || !tokens.idtoken) {
    return { user: null, isAuth: false };
  }

  const graphQLClient = graphQLClientForServer(tokens);

  const query = gql`
    query {
      getUserDetail {
        isSuccess
        message
        user {
          id
          name
          username
          pic
          email
          email_verified
          numberOfPosts
          numberOfFollowers
          numberOfFollowings
        }
      }
    }
  `;

  const data: IGetUserDetailServerResponse = await graphQLClient.request(query);
  const res: IGetUserDetail = {
    user: { ...data.getUserDetail.user },
    isAuth: data.getUserDetail.isSuccess,
  };

  return res;
}

export default getUserDetail;
