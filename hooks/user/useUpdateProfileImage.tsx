import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';

export interface IUpdateProfileImage {
  userId: string;
  username: string;
  file: File;
}

export interface IUpdateProfileImageResponse {
  isSuccess: boolean;
  message: string;
}


function useUpdateProfileImage({ username, file, userId }: IUpdateProfileImage) {
  const variables = {
    userId,
    username,
    file: file,
  };

  const mutation = gql`
    mutation UpdateProfileImage (
      $userId: String!
      $username: String!
      $file: Upload!
    ) {
        updateProfileImage (
        input: {
          userId: $userId
          username: $username
          file: $file
        }
      ) {
        message
        isSuccess
      }
    }
  `;

  return useMutation<IUpdateProfileImageResponse>(
    ['updateProfileImage'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data.updateProfileImage as IUpdateProfileImageResponse;
    },
    {
      retry: false,
    }
  );
}

export default useUpdateProfileImage;
