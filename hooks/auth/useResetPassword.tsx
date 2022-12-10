import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../graphql';

interface IResetPasswordProps {
  code: string;
  username: string;
  newPassword: string;
}

interface IResetPasswordServerResponse {
  message: string;
  isSuccess: boolean;
}

function useResetPassword({ username, newPassword, code }: IResetPasswordProps) {
  const variables = {
    username,
    newPassword,
    code,
  };

  const mutation = gql`
    mutation ResetPassword($username: String!, $newPassword: String!, $code: String!) {
      resetPassword(input: { username: $username, newPassword: $newPassword, code: $code }) {
        message
        isSuccess
      }
    }
  `;

  return useMutation(
    ['resetPassword'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data.resetPassword as IResetPasswordServerResponse;
    },
    {
      retry: false,
    }
  );
}

export default useResetPassword;
