import { useMutation, useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend, graphQLClientForServer } from '../../graphql';
import { IToken } from '../../interfaces';
import { IGetUserDetail } from '../auth/useGetUserDetail';

export interface IGetPost {
  postId: string;
  user: IGetUserDetail;
  token: IToken;
}

export interface SpecificPost {
  _id: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    pic: string;
  };
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  commentIds:
    | {
        _id: string;
        comment: string;
        whoCommented: {
          _id: string;
          name: string;
          username: string;
          pic: string;
        };
      }[]
    | [];
  createdAt: string;
  wasLikeByMe: boolean;
  postUrl: string;
}


export interface IGetPostInDetailServerResponse {
  isSuccess: boolean;
  message: string;
  post: SpecificPost | null
}

async function getPostInDetails({ postId, user, token }: IGetPost) {
  if (!token.accesstoken || !token.idtoken) {
    return { post: null, isSuccess: false, message: "Unauthorized" };
  }

  const graphQLClient = graphQLClientForServer(token);

  const query = gql`
    query getSpecificPost($postId: String!, $userId: String!) {
      getSpecificPost(input: { postId: $postId, userId: $userId }) {
        message
        isSuccess
        post {
          _id
          userId {
            _id
            name
            username
            pic
          }
          imageUrl
          caption
          createdAt
          comments
          likes
          postUrl
          wasLikeByMe
          commentIds {
            _id
            comment
            whoCommented {
              _id
              name
              username
              pic
            }
          }
        }
      }
    }
  `;


const variables = {
  postId,
  userId: user.user?.id
};

  const data: IGetPostInDetailServerResponse = await graphQLClient.request(query, variables).then(data => data.getSpecificPost);
  // console.log('Data from POst ********', data);

  return data

}

export default getPostInDetails;
