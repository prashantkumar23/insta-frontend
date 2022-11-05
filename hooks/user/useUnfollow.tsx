import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClient } from '../../graphql';

export interface IUnfollowUser {
  username: string;
  whoToUnfollow: string
}

function useUnfollow({ username, whoToUnfollow }: IUnfollowUser) {
  const variables = {
    username,
    whoToUnfollow
  };

  const mutation = gql`
    mutation unfollow( $whoToUnfollow: String!, $username: String!,) {
      unfollow(input: {  whoToUnfollow: $whoToUnfollow, username: $username }) {
        message
        isSuccess
      }
    }
  `;

  return useMutation(
    ['unfollow'],
    async () => {
      const data = await graphQLClient.request(mutation, variables);
      return data;
    },
    {
      retry: false,
    }
  );
}

export default useUnfollow;
