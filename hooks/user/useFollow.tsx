import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';
import { IGetUserRecommedationResponseGraphQL } from './useGetRecommendation';

export interface IFollowUser {
  username: string;
  whoToFollow: string;
}

function useFollow({ username, whoToFollow }: IFollowUser) {
  const queryClient = useQueryClient();
  const variables = {
    username,
    whoToFollow,
  };

  const mutation = gql`
    mutation follow($whoToFollow: String!, $username: String!) {
      follow(input: { whoToFollow: $whoToFollow, username: $username }) {
        message
        isSuccess
      }
    }
  `;

  return useMutation(
    ['follow', whoToFollow],
    async () => {
      const data = await graphQLClientForFrontend.request(mutation, variables);
      return data.follow;
    },
    {
      retry: false,
      onMutate: async () => {
        // console.log("UR", ur)

        await queryClient.cancelQueries(['follow', whoToFollow]);

        const userRecommendation = queryClient.getQueryData(['getUserRecommendation']);

        queryClient.setQueryData(['getUserRecommendation'], (prev: any) => {
          console.log(prev)
          const userR: IGetUserRecommedationResponseGraphQL = { ...prev };

          if (userR.users) {
            let userNeedToUpdate = userR.users.find((u) => u._id === whoToFollow);
            let userNeedToUpdateIndex = userR.users.findIndex((u) => u._id === whoToFollow);

            //@ts-ignore
            const userNeedToUpdate2 = {
              ...userNeedToUpdate,
              followedByMe: true,
            };
            //@ts-ignore
            userR.users[userNeedToUpdateIndex] = userNeedToUpdate2;
          }




 
          console.log('UR 2', userR);
          return userR;
        });

        return { userRecommendation };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(['getUserRecommendation'], context?.userRecommendation);
      },
      onSettled: (data: any, error: unknown, variables: void, context: any) => {
        queryClient.invalidateQueries(['getUserRecommendation']);
      },
    }
  );
}

export default useFollow;
