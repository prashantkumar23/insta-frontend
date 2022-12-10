import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../graphql';


export interface ILogoutReponse {
  isSuccess: boolean;
  message: string;
}

function useLogout() {
  const mutation = gql`
  mutation Logout{
    logout {
      message
      isSuccess
    }
  }
`;


  return useMutation(
    ['logout'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation);
      return data.logout as ILogoutReponse;
    },
    {
      retry: false,
    }
  );
}

export default useLogout;
