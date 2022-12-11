import React, { useEffect } from 'react';
import { Grid, Stack, Divider } from '@mantine/core';
import AppLayout from '../layout/AppLayout';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { useMediaQuery } from '@mantine/hooks';

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

const LIMIT = 10;

const HomePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    refetch,
    data,
    isLoading: isLoadingFeedPost,
  } = useGetFeedPost({ userId: "", limit: LIMIT, skip: 0 });


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

              {UserRecommendationData && <Divider />}
              {isLoadingUserRecommendation && <SkeletonUserRecommendationCard />}
              {UserRecommendationData && UserRecommendationEle()}
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
