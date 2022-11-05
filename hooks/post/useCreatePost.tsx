import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';

export interface ICreatePost {
  userId: string;
  username: string;
  file: File;
  caption: string;
}

export interface ICreatePostResponse {
  isSuccess: boolean;
  message: string;
}


function useCreatePost({ username, file, caption, userId }: ICreatePost) {
  const variables = {
    userId,
    username,
    caption,
    file: file,
  };

  const mutation = gql`
    mutation CreatePost(
      $userId: String!
      $username: String!
      $caption: String!
      $file: Upload!
    ) {
      createPost(
        input: {
          userId: $userId
          username: $username
          caption: $caption
          file: $file
        }
      ) {
        message
        isSuccess
      }
    }
  `;

  return useMutation<ICreatePostResponse>(
    ['createPost'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);

      return data.createPost;
    },
    {
      retry: false,
    }
  );
}

export default useCreatePost;
