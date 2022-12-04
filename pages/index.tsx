import React, { Suspense, useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Title,
  Text,
  Divider,
  Group,
  Avatar,
} from '@mantine/core';
import AppLayout from '../layout/AppLayout';
import { dehydrate, QueryClient } from '@tanstack/react-query';
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
import { useRouter } from 'next/router';

const LIMIT = 50;

const HomePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { refetch, data } = useGetFeedPost({ userId: props.user.id!, limit: LIMIT, skip: 0 });
  const { refetch: UserRecommendation, data: UserRecommendationData } = useGetUserRecommendation({
    limit: 5,
    userId: props.user.id,
  });
  const router = useRouter();

  useEffect(() => {
    refetch();
    UserRecommendation();
  }, []);

  const matches = useMediaQuery('(min-width: 850px)', false);

  // console.log('UserRecommendationData', UserRecommendationData, props.user);

  const PostCardEle = (data: FeedPost[]) =>
    data.map((ele: FeedPost) => (
      <PostCard key={ele.id} postId={ele.id} post={ele} me={props.user} />
    ));
  const UserRecommendationEle = () =>
    UserRecommendationData!.users?.map((ele: UserRecommendation) => (
      <UserRecommendationCard
        username={ele.username}
        name={ele.name}
        pic={ele.pic}
        userId={ele._id}
        followedByMe={ele.followedByMe}
        myId={props.user.id}
        key={ele._id}
      />
    ));

  return (
    <AppLayout user={props.user}>
      <Grid>
        <Grid.Col sm={matches ? 7 : 12} style={{ backgroundColor: '' }}>
          <Stack spacing={10} align={matches ? 'flex-end' : 'center'}>
            {data && PostCardEle(data.posts!)}
          </Stack>
        </Grid.Col>
        {matches ? (
          <Grid.Col sm={matches ? 5 : 0} style={{ backgroundColor: '' }}>
            <div>
              <Stack spacing={10}>
                <Card radius={"lg"} withBorder>
                  <Group position="apart">
                    <Group>
                      <Avatar src={props.user.pic} radius="xl" />
                      <Text size="xs">{props.user.username}</Text>
                    </Group>
                    <Button compact size="xs" sx={{"&:hover": {backgroundColor: "transparent"}}} variant="subtle" onClick={() => router.push("/me")}>View</Button>
                  </Group>
                </Card>
                {UserRecommendationData && <Divider/>}
                {UserRecommendationData && UserRecommendationEle()}
              </Stack>
            </div>
          </Grid.Col>
        ) : null}
      </Grid>
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
