import { useMutation, useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../../graphql';

export interface IGetPost {
  postId: string;
  userId: string;
}

export interface SpecificPost {
  _id: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    pic: string;
  };
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  commentIds:
    | {
        _id: string;
        comment: string;
        whoCommented: {
          _id: string;
          name: string;
          username: string;
          pic: string;
        };
      }[]
    | [];
  createdAt: string;
  wasLikeByMe: boolean;
  postUrl: string;
}

function useGetPost({ postId, userId }: IGetPost) {
  const variables = {
    postId,
    userId,
  };

  const query = gql`
    query getFeedPost($postId: String!, $userId: String!) {
      getSpecificPost(input: { postId: $postId, userId: $userId }) {
        message
        isSuccess
        post {
          _id
          userId {
            _id
            name
            username
            pic
          }
          imageUrl
          caption
          createdAt
          comments
          likes
          postUrl
          wasLikeByMe
          commentIds {
            _id
            comment
            whoCommented {
              _id
              name
              username
              pic
            }
          }
        }
      }
    }
  `;

  return useQuery<SpecificPost>(
    ['getPost', postId],
    async () => {
      const data = await graphQLClientForFrontend.request(query, variables);
      return data.getSpecificPost.post;
    },
    {
      enabled: false,
      retry: false,
    }
  );
}

export default useGetPost;
