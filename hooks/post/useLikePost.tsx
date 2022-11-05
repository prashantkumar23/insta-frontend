import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';
import { FeedPost } from './useGetFeedPost';

export interface ILikePost {
  postId: string;
  userId: string;
}

function useLikePost({ postId, userId }: ILikePost) {
  const queryClient = useQueryClient();

  const variables = {
    postId,
    userId
  };

  const mutation = gql`
    mutation likePost($postId: String!, $userId: String!) {
      likePost(input: { postId: $postId, userId: $userId }) {
        isSuccess
      }
    }
  `;

  return useMutation(
    ['likePost', postId],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data;
    },
    {
      retry: false,
      onMutate: async (post: FeedPost) => {
        await queryClient.cancelQueries(['likePost', postId]);
        const previousPost = queryClient.getQueryData(['getFeedPost']);
        queryClient.setQueryData(['getFeedPost'], (prev: any) => {
          let feedPost: FeedPost[] = [...prev];

          const indexOfLikePost = feedPost.findIndex((p: FeedPost) => p.id === post.id);

          let likedPost = feedPost.find((p) => p.id === post.id);

          let updatedlikedPost = {
            ...likedPost,
            wasLikeByMe: true,
            likes: likedPost!.likes + 1
          };
          // @ts-ignore
          feedPost[indexOfLikePost] = updatedlikedPost!;
          return feedPost;
        });

        return { previousPost };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(['getFeedPost'], context?.previousPost);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['getFeedPost']);
      },
    }
  );
}

export default useLikePost;
