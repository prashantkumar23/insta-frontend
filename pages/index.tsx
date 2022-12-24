import React, { useEffect } from 'react';
import { Grid, Stack, Divider, Text } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext,  NextPage } from 'next';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';

import AppLayout from '../layout/AppLayout';
import PostCard from '../components/Cards/PostCard';
import UserRecommendationCard from '../components/Cards/UserRecommendationCard';
import useGetFeedPost, { FeedPost } from '../hooks/post/useGetFeedPost';
import { IGetUserDetail } from '../hooks/auth/useGetUserDetail';
import getUserDetail from '../hooks/auth/useGetUserDetail';
import { getToken } from '../utility/gettoken';
import useGetUserRecommendation from '../hooks/user/useGetRecommendation';
import { UserRecommendation } from '../hooks/user/useGetRecommendation';
import SkeletonCardPost from '../components/Skeleton/SkeletonCardPost';
import ProfileCard from '../components/Cards/ProfileCard';
import SkeletonProfilePostCard from '../components/Skeleton/SkeletonProfileCard';
import SkeletonUserRecommendationCard from '../components/Skeleton/SkeletonUserRecommendation';


const LIMIT = 40;

const HomePage: NextPage = (props: any) => {
  const {
    refetch,
    data,
    isLoading: isLoadingFeedPost,
  } = useGetFeedPost({ userId: props.user.id, limit: LIMIT, skip: 0 });

  const {
    refetch: UserRecommendation,
    data: UserRecommendationData,
    isLoading: isLoadingUserRecommendation,
  } = useGetUserRecommendation({
    limit: 5,
    userId: props.user.id,
  });

  useEffect(() => {
    refetch();
    UserRecommendation();
  }, []);

  const matches = useMediaQuery('(min-width: 850px)', false, { getInitialValueInEffect: false });

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
        <Grid.Col sm={matches ? 7 : 12}>
          {isLoadingFeedPost ? (
            <Stack spacing={10} align={matches ? 'flex-end' : 'center'}>
              {[1, 2, 3].map((index) => (
                <SkeletonCardPost key={index} />
              ))}
            </Stack>
          ) : (
            <Stack spacing={10} align={matches ? 'flex-end' : 'center'}>
              {data && data.posts && PostCardEle(data.posts)}
              {data && data.posts.length === 0 && (
                <Text
                  color="dimmed"
                  align="center"
                  size={'md'}
                  sx={{ fontStyle: 'italic', width: '100%', height: '70vh', paddingTop: '30vh' }}
                >
                  When someone post, you'll see here in your feed
                </Text>
              )}
            </Stack>
          )}
        </Grid.Col>
        {matches ? (
          <Grid.Col sm={matches ? 5 : 0} style={{ backgroundColor: '' }}>
            <Stack spacing={10}>
              {isLoadingFeedPost ? (
                <SkeletonProfilePostCard />
              ) : (
                <ProfileCard pic={props.user.pic} username={props.user.username} />
              )}
              {UserRecommendationData && UserRecommendationData.users.length > 0 && <Divider />}
              {isLoadingUserRecommendation && <SkeletonUserRecommendationCard />}
              {UserRecommendationData && UserRecommendationEle()}
              <Divider />
              <Stack spacing={5} mt={10}>
                <Text color={'dimmed'} sx={{ fontSize: '0.6rem' }} align="center">
                  Made using AWS, NextJs, React Query, Mantine, NestJs, GraphQL and MongoDB
                </Text>
                <Text color={'dimmed'} sx={{ fontSize: '0.6rem' }} align="center">
                  © Pintagram 2023 - By{" "}
                  <Link href="https://github.com/prashantkumar23" style={{fontStyle: "italic"}}>Prashant</Link>
                </Text>
              </Stack>
            </Stack>
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
