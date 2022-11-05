import { useMutation, useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../graphql';

interface IRegisterProps {
  name: string;
  email: string;
  username: string;
  password: string;
}

function useRegisterNew({ username, password, name, email }: IRegisterProps) {
  const variables = {
    username,
    password,
    email,
    name,
  };

  const mutation = gql`
    mutation SignUp($username: String!, $password: String!, $name: String!, $email: String!) {
      signup(input: { username: $username, password: $password, name: $name, email: $email }) {
        UserSub
        UserConfirmed
        CodeDeliveryDetails {
          Destination
          DeliveryMedium
          AttributeName
        }
      }
    }
  `;

  return useQuery(
    ['signup'],
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

export default useRegisterNew;
