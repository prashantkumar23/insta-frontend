import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Grid, Stack, Title, Text } from '@mantine/core';
import AppLayout from '../layout/AppLayout';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { useMediaQuery } from '@mantine/hooks';

import PostCard from '../components/Cards/PostCard';
import UserRecommendationCard from '../components/Cards/UserRecommendationCard';
import useGetFeedPost, { FeedPost, FeedPostResponse } from '../hooks/post/useGetFeedPost';
import { IGetUserDetail } from '../hooks/auth/useGetUserDetail';
import getUserDetail from '../hooks/auth/useGetUserDetail';
import { getToken } from '../utility/gettoken';
import useGetUserRecommendation from '../hooks/user/useGetRecommendation';
import { UserRecommendation } from '../hooks/user/useGetRecommendation';

const LIMIT = 5

const HomePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { refetch, data } = useGetFeedPost({ userId: props.user.id!, limit: LIMIT, skip: 0 });
  const { refetch: UserRecommendation, data: UserRecommendationData } = useGetUserRecommendation({
    limit: 5,
    userId: props.user.id
  });

  useEffect(() => {
    refetch();
    UserRecommendation();
  }, []);

  const matches = useMediaQuery('(min-width: 850px)', false);

  console.log(UserRecommendationData)

  const PostCardEle = (data: FeedPost[]) =>
    data.map((ele: FeedPost) => (
      <PostCard key={ele.id} postId={ele.id} post={ele} me={props.user} />
    ));
  const UserRecommendationEle = () =>
    UserRecommendationData!.users?.map((ele: UserRecommendation) => (
      <UserRecommendationCard username={ele.username} name={ele.name} pic={ele.pic} userId={ele._id} followedByMe={ele.followedByMe} myId={props.user.id} key={ele._id} />
    ));

  return (
    <AppLayout user={props.user}>
      <Container>
        <Text>{data?.count}</Text>
        <Grid>
          <Grid.Col sm={matches ? 7 : 12}>
            <Stack spacing={10}>{data && PostCardEle(data.posts!)}</Stack>
          </Grid.Col>
          {matches ? (
            <Grid.Col sm={matches ? 5 : 0}>
              <div>
                <Stack spacing={10}>{UserRecommendationData && UserRecommendationEle()}</Stack>
              </div>
            </Grid.Col>
          ) : null}
        </Grid>
      </Container>
    </AppLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  const session = await queryClient.fetchQuery<IGetUserDetail>(['getUserDetail'], async () =>
    getUserDetail(getToken(context))
  );

  if (!session.isAuth) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  const fetchedUser = queryClient.getQueryData<IGetUserDetail>(['getUserDetail']);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      user: fetchedUser!.user,
    },
  };
}

export default HomePage;
