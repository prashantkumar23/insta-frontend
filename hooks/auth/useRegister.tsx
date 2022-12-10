import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../graphql';

interface IRegisterProps {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface IRegisterServerResponse {
  message: string;
  isSuccess: boolean;
}

function useRegister({ username, password, name, email }: IRegisterProps) {
  const variables = {
    username,
    password,
    email,
    name,
  };

  const mutation = gql`
    mutation SignUp($username: String!, $password: String!, $name: String!, $email: String!) {
      signup(input: { username: $username, password: $password, name: $name, email: $email }) {
        message
        isSuccess
      }
    }
  `;

  return useMutation(
    ['signup'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data.signup as IRegisterServerResponse;
    },
    {
      retry: false,
    }
  );
}

export default useRegister;
