import { useMutation } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../graphql';

interface ILoginProps {
  username: string;
  password: string;
}

function useLogin({ username, password }: ILoginProps) {
  const variables = {
    username,
    password,
  };

  const mutation = gql`
    mutation Login($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        isSuccess
        message
      }
    }
  `;

  return useMutation<{login: {isSuccess: boolean, message: string}}>(
    ['login'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);

      return data;
    },
    {
      retry: false,
    }
  );
}

export default useLogin;
