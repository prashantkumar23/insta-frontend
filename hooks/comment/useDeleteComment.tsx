import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';
import { SpecificPost } from '../post/useGetPost';

export interface IDeleteComment {
  readonly commentId: string;
  readonly postId: string;
}

function useDeleteComment({ postId, commentId }: IDeleteComment) {
  const queryClient = useQueryClient();
  const variables = {
    postId,
    commentId,
  };

  const mutation = gql`
    mutation deleteComment($commentId: String!, $postId: String!) {
      deleteComment(input: { commentId: $commentId, postId: $postId }) {
        message
      }
    }
  `;

  return useMutation(
    ['deleteComment', postId, commentId],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data;
    },
    {
      retry: false,
      onMutate: async (commentAndPost: any) => {
        await queryClient.cancelQueries(['deleteComment', commentAndPost.postId]);
        const previousPost = queryClient.getQueryData(['getPost', commentAndPost.postId]);
        queryClient.setQueryData(['getPost', postId], (prev: any) => {
          let post: SpecificPost = { ...prev };
          const updatedPost: SpecificPost = {
            ...post,
            commentIds: post.commentIds.filter((c) => c._id !== commentAndPost.commentId),
            comments: post.comments - 1,
          };
          return updatedPost;
        });

        return previousPost;
      },
      onError: (err, data, context: any) => {
        queryClient.setQueryData([`getPost`], context?.previousPost);
      },
      onSettled: (data: any, error: unknown, variables: any, context: any) => {
        queryClient.invalidateQueries([`getPost`]);
      },
    }
  );
}

export default useDeleteComment;
