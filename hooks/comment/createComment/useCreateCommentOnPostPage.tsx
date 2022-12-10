import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../../graphql';
import { SpecificPost } from '../../post/useGetPost';

export interface ICreateComment {
  readonly whoCommented: string;
  readonly postId: string;
  readonly comment: string;
  readonly wasLikeByMe: boolean;
}

function useCreateCommentOnPostPage(input: ICreateComment) {
  const queryClient = useQueryClient();
  const variables = {
    ...input,
  };

  const mutation = gql`
    mutation createComment(
      $whoCommented: String!
      $postId: String!
      $comment: String!
      $wasLikeByMe: Boolean!
    ) {
      createComment(
        input: {
          whoCommented: $whoCommented
          postId: $postId
          comment: $comment
          wasLikeByMe: $wasLikeByMe
        }
      ) {
        _id
        whoCommented
        wasLikeByMe
        comment
        postId
      }
    }
  `;

  return useMutation(
    ['createComment', input.postId],
    async () => {
      const data: ICreateComment = await graphQLClientForFrontend
        .request(mutation, variables)
        .then((data: any) => data.createComment);
      return data;
    },
    {
      retry: false,
      onMutate: async (commentAndPost: any) => {
        await queryClient.cancelQueries(['createComment', input.postId]);
        console.log('commentAndPost', commentAndPost);

        const previousPost: any = queryClient.getQueryData(['getPost', input.postId]);

        queryClient.setQueryData(['getPost', commentAndPost.postId], () => {
          console.log('Get Post', previousPost);

          previousPost.post.commentIds.unshift(commentAndPost);

          const updatedPost: SpecificPost = {
            ...previousPost.post,
            commentIds: previousPost.post.commentIds,
            comments: previousPost.post.comments + 1,
          };

          console.log('Updated Post', updatedPost);
          return {
            message: previousPost.message,
            isSuccess: previousPost.isSuccess,
            post: updatedPost,
          };
        });

        return previousPost;
      },
      onError: (err, data, context: any) => {
        console.log('COntext on Error', context);
        queryClient.setQueryData(['getPost'], context);
      },
      onSettled: (data: any, error: unknown, variables: any, context: any) => {
        console.log('COntext on Settled', context);
        queryClient.invalidateQueries(['getPost'], context);
      },
    }
  );
}

export default useCreateCommentOnPostPage;
