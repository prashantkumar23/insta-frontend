import { gql } from 'graphql-request';
import { graphQLClientForServer } from '../../graphql';
import { IToken } from '../../interfaces';

export interface OtherUser {
  _id: string;
  name: string;
  email: string;
  email_verified: boolean;
  pic: string;
  username: string;
  numberOfPosts: number;
  numberOfFollowings: number;
  numberOfFollowers: number;
}

export interface IGetOtherUserDetailServerResponse {
  getOtherUserDetail: {
    message: string;
    isSuccess: boolean;
    user: OtherUser;
  };
}

export interface IGetOtherUserDetail {
  user: OtherUser | null;
}

async function getOtherUserDetail(
  tokens: IToken,
  { username, userId }: { username: string; userId: string }
) {
  if (!tokens.accesstoken || !tokens.idtoken) {
    return { user: null, isAuth: false };
  }

  const graphQLClient = graphQLClientForServer(tokens);

  const variables = {
    username,
    userId,
  };

  const query = gql`
    query GetOtherUserDetail($username: String!, $userId: String!) {
      getOtherUserDetail(input: { username: $username, userId: $userId }) {
        isSuccess
        message
        user {
          _id
          name
          username
          pic
          email
          email_verified
          numberOfPosts
          numberOffollowers
          numberOffollowings
          followedByMe
        }
      }
    }
  `;

  const data: IGetOtherUserDetailServerResponse = await graphQLClient.request(query, variables);
  return data.getOtherUserDetail;
}

export default getOtherUserDetail;
