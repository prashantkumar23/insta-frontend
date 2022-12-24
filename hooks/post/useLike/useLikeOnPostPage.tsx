import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { graphQLClientForFrontend } from '../../../graphql';
import { IGetPostInDetailServerResponse, SpecificPost } from '../useGetPost';

export interface ILikePost {
  postId: string;
  userId: string;
}

function useLikeOnPostPage({ postId, userId }: ILikePost) {
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
      onMutate: async (post: SpecificPost) => {
        await queryClient.cancelQueries(['likePost', postId]);

        // console.log('Get Post Id', post._id);
        const previousPost = queryClient.getQueryData(['getPost', post._id]);

        queryClient.setQueryData(['getPost', post._id], (prev: any) => {
        //   console.log('Prev', previousPost);

          const postData: IGetPostInDetailServerResponse = { ...prev };
          let postPage: SpecificPost = postData.post;

          let updatedPost: SpecificPost = {
            ...postPage,
            wasLikeByMe: true,
            likes: postPage!.likes + 1,
          };

          const newUpdatedPost: IGetPostInDetailServerResponse = {
            isSuccess: prev.isSuccess,
            message: prev.message,
            post: updatedPost,
          };

          return newUpdatedPost;
        });

        // console.log('Returning from OnMutate', previousPost);
        return { previousPost };
      },
      onError: (err: any, variables: any, context: any) => {
        // console.log('Context in Error', context);
        queryClient.setQueryData(['getPost', postId], context);
      },
      onSettled: (data: any, error: any, variables: any, context: any) => {
        // console.log('Context in onSettled', context);
        queryClient.invalidateQueries(['getPost', postId], context);
      },
    }
  );
}

export default useLikeOnPostPage;
