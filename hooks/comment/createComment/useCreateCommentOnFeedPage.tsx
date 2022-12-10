import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../../graphql';
import { FeedPost } from '../../post/useGetFeedPost';

export interface ICreateComment {
  readonly whoCommented: string;
  readonly postId: string;
  readonly comment: string;
  readonly wasLikeByMe: boolean;
}

function useCreateCommentOnFeedPage(input: ICreateComment) {
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
        .then((data) => data.createComment);
      return data;
    },
    {
      retry: false,
      onMutate: async (Post: any) => {
        await queryClient.cancelQueries(['createComment', input.postId]);

        const previousPost = queryClient.getQueryData(['getFeedPost']);

        queryClient.setQueryData(['getFeedPost'], (prev: any) => {
          let feedPost: FeedPost[] = [...prev.posts];

          const indexOfCommentedPost = feedPost.findIndex((p: FeedPost) => p.id === Post.id);

          let commentedPost = feedPost.find((p) => p.id === Post.id);

          let updatedCommentedPost = {
            ...commentedPost,
            comments: commentedPost!.comments + 1,
          };

          // @ts-ignore
          feedPost[indexOfCommentedPost] = updatedCommentedPost!;

          const feedPostNew = {
            count: prev.count,
            isSuccess: prev.isSuccess,
            message: prev.message,
            posts: feedPost,
          };

          return feedPostNew;
        });

        return previousPost;
      },
      onError: (err, data, context: any) => {
        queryClient.setQueryData(['getFeedPost'], context?.previousPost);
      },
      onSettled: (data: any, error: unknown, variables: any, context: any) => {
        queryClient.invalidateQueries(['getFeedPost']);
      },
    }
  );
}

export default useCreateCommentOnFeedPage;
