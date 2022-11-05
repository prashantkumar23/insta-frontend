import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';

export interface IGetUserRecommendation {
  limit: number;
  userId: string;
}

export interface UserRecommendation {
    _id: string;
    name: string;
    username: string;
    pic: string;
    numberOfPosts: number,
    numberOffollowings: number,
    numberOffollowers: number,
    followedByMe: boolean
}

export interface IGetUserRecommedationResponseGraphQL {
    message: string;
    isSuccess: boolean;
    users: UserRecommendation[] | null;
} 

function useGetUserRecommendation({ limit, userId }: IGetUserRecommendation) {
  const variables = {
    limit,
    userId
  };

  const query = gql`
    query getUserRecommendation($limit: Float!, $userId: String!) {
      getUserRecommendation(input: { limit: $limit, userId: $userId }) {
        message
        isSuccess
        users {
          _id
          name
          numberOfPosts
          username
          numberOffollowers
          numberOffollowings
          pic
          followedByMe
        }
      }
    }
  `;

  return useQuery<IGetUserRecommedationResponseGraphQL>(
    ['getUserRecommendation'],
    async () => {
      const data = await graphQLClientForFrontend.request(query, variables);
      return data.getUserRecommendation;
    },
    {
      retry: false,
      enabled: false,
    }
  );
}

export default useGetUserRecommendation;
