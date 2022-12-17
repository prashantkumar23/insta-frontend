import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';

export interface IGetFeedPost {
  username: string;
  limit: number;
  skip: number;
}

export interface UserPost {
  _id: string;
  imageUrl: string;
}

export interface FeedPostResponse {
  isSuccess: boolean;
  message: string;
  posts: UserPost[] | null;
  count: number
}

function useGetUserPost({ username, limit, skip }: IGetFeedPost) {
  const variables = {
    username,
    limit,
    skip
  };

  const query = gql`
    query getUserPost($username: String!, $limit: Float!, $skip: Float!) {
      getUserPost(input: { username: $username, limit: $limit, skip: $skip }) {
        message
        isSuccess
        posts {
          _id
          imageUrl
        }
        count
      }
    }
  `;

  return useQuery<FeedPostResponse>(
    ['getUserPost', username],
    async () => {
      const data = await graphQLClientForFrontend.request(query, variables);
      return data.getUserPost;
    },
    {
      enabled: false,
      retry: false,
    }
  );
}

export default useGetUserPost;
