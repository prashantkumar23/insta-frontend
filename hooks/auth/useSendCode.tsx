import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../graphql';

interface ISendCodeInput {
  email: string;
}

export interface ISendCodeReponse {
  isSuccess: boolean;
  message: string;
  username: string;
}

function useSendCode({ email }: ISendCodeInput) {
  const variables = {
    email,
  };
  const mutation = gql`
    mutation SendCode($email: String!) {
      sendCode(input: { email: $email }) {
        isSuccess
        message
        username
      }
    }
  `;

  return useMutation(
    ['sendcode'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data.sendCode as ISendCodeReponse;
    },
    {
      retry: false,
    }
  );
}

export default useSendCode;
