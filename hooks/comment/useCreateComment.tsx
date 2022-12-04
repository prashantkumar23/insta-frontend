import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';
import { FeedPost } from '../post/useGetFeedPost';
import { SpecificPost } from '../post/useGetPost';

export interface ICreateComment {
  readonly whoCommented: string;
  readonly postId: string;
  readonly comment: string;
  readonly wasLikeByMe: boolean;
}

function useCreateComment(input: ICreateComment) {
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
      const data: ICreateComment = await graphQLClientForFrontend.request(mutation, variables).then(data => data.createComment);
      return data;
    },
    {
      retry: false,
      // onMutate: async (commentAndPost: any) => {
      //   await queryClient.cancelQueries(['createComment', input.postId]);
      //   console.log(commentAndPost)
      //   let res: any;

      //   if (commentAndPost.route.includes('/p')) {
      //     const previousPost = queryClient.getQueryData(['getPost', commentAndPost.postId]);

      //     queryClient.setQueryData(['getPost', commentAndPost.postId], (prev: any) => {
      //       const post: SpecificPost = { ...prev };

      //       // @ts-ignore
      //       post.commentIds.unshift(commentAndPost.userComment);
      //       const updatedPost: SpecificPost = {
      //         ...post,
      //         commentIds: post.commentIds,
      //         comments: post.comments + 1,
      //       };

      //       return updatedPost;
      //     });
      //     res = { previousPost, queryName: 'getPost' };
      //   } else {
      //     const previousPost = queryClient.getQueryData(['getFeedPost']);

      //     queryClient.setQueryData(['getFeedPost'], (prev: any) => {
      //       let feedPost: FeedPost[] = [...prev];
      //       const indexOfCommentedPost = feedPost.findIndex(
      //         (p: FeedPost) => p.id === commentAndPost.postId
      //       );
      //       let commentedPost = feedPost.find((p) => p.id === commentAndPost.postId);
      //       let updatedCommentedPost = {
      //         ...commentedPost,
      //         comments: commentedPost!.comments + 1,
      //       };
      //       // @ts-ignore
      //       feedPost[indexOfCommentedPost] = updatedCommentedPost!;
      //       return feedPost;
      //     });

      //     res = { previousPost, queryName: 'getFeedPost' };
      //   }

      //   return res;
      // },
      // onError: (err, data, context) => {
      //   queryClient.setQueryData([`${context.queryName}`], context?.previousPost);
      // },
      // onSettled: (data: any, error: unknown, variables: any, context: any) => {
      //   queryClient.invalidateQueries([`${context.queryName}`]);
      // },
    }
  );
}

export default useCreateComment;
