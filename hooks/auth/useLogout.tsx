import { useMutation } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { graphQLClient } from '../../graphql';

interface ILogoutProps {
  accessToken: string;
}

function useLogout({ accessToken }: ILogoutProps) {
  const variables = {
    accessToken,
  };

  const mutation = gql`
    mutation Logout($accessToken: String!) {
      logout(input: { accessToken: $accessToken }) {
        message
        isSuccess
      }
    }
  `;

  return useMutation(
    ['logout'],
    async () => {
      const data = await graphQLClient.request(mutation, variables);
      return data;
    },
    {
      retry: false,
    }
  );
}

export default useLogout;
