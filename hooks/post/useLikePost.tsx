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
    userId,
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

        // console.log('Got this previous post', previousPost);

        queryClient.setQueryData(['getFeedPost'], (prev: any) => {
          // console.log("Prev", prev)
          let feedPost: FeedPost[] = [...prev.posts];

          const indexOfLikePost = feedPost.findIndex((p: FeedPost) => p.id === post.id);

          let likedPost = feedPost.find((p) => p.id === post.id);

          let updatedlikedPost = {
            ...likedPost,
            wasLikeByMe: true,
            likes: likedPost!.likes + 1,
          };
          // @ts-ignore
          feedPost[indexOfLikePost] = updatedlikedPost!;
          // console.log('Feed POSt after setting like', feedPost);

          const feedPostNew: any = {
            count: prev.count,
            isSuccess: prev.isSuccess,
            message: prev.message,
            posts: feedPost,
          };

          return feedPostNew;
        });

        // console.log('Returning from OnMutate', previousPost);
        return { previousPost };
      },
      onError: (err: any, variables: any, context: any) => {
        // console.log('Context in Error', context);
        queryClient.setQueryData(['getFeedPost'], context);
      },
      onSettled: (data: any, error: any, variables: any, context: any) => {
        // console.log('Context in onSettled', context);
        queryClient.invalidateQueries(['getFeedPost'], context);
      },
    }
  );
}

export default useLikePost;
