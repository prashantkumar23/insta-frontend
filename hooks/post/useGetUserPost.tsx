import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';

export interface IGetFeedPost {
  username: string;
  limit: number;
  skip: number;
}

export interface FeedPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  wasLikeByMe: boolean;
  user: {
    id: string;
    name: string;
    username: string;
    pic: string;
  };
}

export interface FeedPostResponse {
  isSuccess: boolean;
  message: string;
  posts: FeedPost[] | null;
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
          id
          imageUrl
          likes
          comments
          caption
          createdAt
          wasLikeByMe
          user {
            id
            name
            username
            pic
          }
        }
        count
      }
    }
  `;

  return useQuery<FeedPostResponse>(
    ['getUserPost'],
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
