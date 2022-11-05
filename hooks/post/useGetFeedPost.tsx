import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';

export interface IGetFeedPost {
  userId: string;
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

function useGetFeedPost({ userId, limit, skip }: IGetFeedPost) {
  const variables = {
    userId,
    limit,
    skip
  };

  const query = gql`
    query getFeedPost($userId: String!, $limit: Float!, $skip: Float!) {
      getFeedPost(input: { userId: $userId, limit: $limit, skip: $skip }) {
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
    ['getFeedPost'],
    async () => {
      const data = await graphQLClientForFrontend.request(query, variables);
      return data.getFeedPost;
    },
    {
      enabled: false,
      retry: false,
    }
  );
}

export default useGetFeedPost;
