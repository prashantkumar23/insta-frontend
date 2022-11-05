import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';

export interface IDeletePost {
  postId: string;
  s3bucketObjectIds: string[]
}

function useDeletePost({ postId, s3bucketObjectIds }: IDeletePost) {
  const variables = {
    postId,
    s3bucketObjectIds
  };

  const mutation = gql`
    mutation deletePost($postId: String!, $s3bucketObjectIds: [String!]!) {
      deletePost(input: { postId: $postId, s3bucketObjectIds: $s3bucketObjectIds }) {
        isSuccess
        message
      }
    }
  `;

  return useMutation(
    ['deletePost'],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data;
    },
    {
      retry: false,
    }
  );
}

export default useDeletePost;
