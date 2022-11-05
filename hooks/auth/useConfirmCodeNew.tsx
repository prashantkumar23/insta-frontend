import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../graphql';

interface IConfirmCodeProps {
  username: string;
  code: string;
}

type SUCCESS = 'SUCCESS';

function useConfirmCodeNew({ username, code }: IConfirmCodeProps) {
  const variables = {
    username,
    code,
  };

  const mutation = gql`
    mutation ConfirmCode($username: String!, $code: String!) {
      confirmCode(input: { username: $username, code: $code }) {
        message
      }
    }
  `;

  return useQuery(
    ['confirmCode'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data;
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
}

export default useConfirmCodeNew;
