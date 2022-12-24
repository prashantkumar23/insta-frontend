import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  Card,
  Container,
  Grid,
  Stack,
  Text,
  Image,
  Center,
  Divider,
  Avatar,
  Button,
  Title,
  Group,
  Modal,
  useMantineTheme,
} from '@mantine/core';
import AppLayout from '../layout/AppLayout';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import getUserDetail, { IGetUserDetail } from '../hooks/auth/useGetUserDetail';
import { getToken } from '../utility/gettoken';
import SkeletonFeedCard from '../components/Skeleton/SkeletonFeedCard';
import getOtherUserDetail, { IGetOtherUserDetail } from '../hooks/auth/useGetOtherUserDetail';
import useGetUserPost, { UserPost } from '../hooks/post/useGetUserPost';
import useFollow from '../hooks/user/useFollow';
import useUnfollow from '../hooks/user/useUnfollow';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

const LIMIT = 100;

export const FeedCard = ({ imageUrl, _id }: UserPost) => {
  const router = useRouter();
  return (
    <Card
      radius={'xs'}
      style={{ backgroundColor: 'transparent' }}
      // p="sm"
      onClick={() => router.push(`/p/${_id}`)}
      m={5}
      p={0}
    >
      <Image
        // width={250}
        height={300}
        radius={'md'}
        src={imageUrl}
        onClick={() => console.log('Card')}
        style={{ cursor: 'pointer' }}
      />
    </Card>
  );
};

const Username: NextPage = ({ user, sessionuser }: any) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const { refetch, data, isSuccess, isLoading } = useGetUserPost({
    username: router.query.username as string,
    limit: LIMIT,
    skip: 0,
  });

  const { mutate: followMutate, isSuccess: followIsSuccess, isLoading: followIsLoading } = useFollow({
    username: sessionuser.id,
    whoToFollow: user._id,
  });
  const { mutate: unfollowMutate, isSuccess: unfollowIsSuccess, isLoading: unfollowingIsLoading } = useUnfollow({
    username: sessionuser.id,
    whoToUnfollow: user._id,
  });

  console.log('Username on Client', user, sessionuser);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    // if (isSuccess) console.log('Post ************', data);
  }, [isSuccess]);

  useEffect(() => {
    if (followIsSuccess) {
      showNotification({
        message: `You are now following ${router.query.username}`,
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }
  }, [followIsSuccess]);

  useEffect(() => {
    if (unfollowIsSuccess) {
      showNotification({
        message: `Unfollowed ${router.query.username}`,
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }
  }, [unfollowIsSuccess]);

  return (
    <Fragment>
      <AppLayout user={sessionuser}>
        <Stack>
          <Center style={{}}>
            <Grid style={{ textAlign: 'center', width: '65%' }}>
              <Grid.Col xs={12} md={6}>
                <Stack spacing={0}>
                  <Avatar
                    style={{ margin: 'auto', borderRadius: '50%' }}
                    size="xl"
                    radius={'xl'}
                    src={user.pic}
                  />
                  <Text color={'dimmed'} size="sm" mt={5}>
                    @{user?.username}
                  </Text>
                  <Text weight={700} size="xl">
                    {user?.name}
                  </Text>
                </Stack>
              </Grid.Col>

              <Grid.Col xs={12} md={6}>
                <Grid justify={'center'} mt={20}>
                  <Grid.Col span={4}>
                    <Stack spacing={0}>
                      <Text weight={700} size="xl">
                        {user?.numberOfPosts}
                      </Text>
                      <Text color={'dimmed'} size="sm">
                        Posts
                      </Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Stack spacing={0}>
                      <Text weight={700} size="xl">
                        {user?.numberOffollowers}
                      </Text>
                      <Text color={'dimmed'} size="sm">
                        Followers
                      </Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Stack spacing={0}>
                      <Text weight={700} size="xl">
                        {user?.numberOffollowings}
                      </Text>
                      <Text color={'dimmed'} size="sm">
                        Following
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>

                <div style={{ margin: '1rem', marginBottom: 0 }}>
                  <Button radius={'lg'} style={{ width: '100%' }} onClick={() => {
                    if(user.followedByMe) {
                      unfollowMutate();
                    } else {
                      followMutate();
                    }
                  }}
                  loading={followIsLoading || unfollowingIsLoading}
                  disabled={followIsLoading || unfollowingIsLoading}
                  >
                    {user.followedByMe ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              </Grid.Col>
            </Grid>
          </Center>

          {/* <Title mb={20} ml={20}>
            Feed
          </Title> */}
          <Divider />
          {isLoading ? (
            <Grid justify={'flex-start'} gutter={0}>
              {Array(10)
                .fill(undefined)
                .map((_, index) => (
                  <Grid.Col md={6} lg={4} sm={6} xs={12} xl={3} key={index}>
                    <SkeletonFeedCard />
                  </Grid.Col>
                ))}
            </Grid>
          ) : (
            <Fragment>
              {data?.posts?.length === 0 && (
                <div
                  style={{
                    width: '100%',
                    height: '45vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text c="dimmed" sx={{ fontSize: '3rem' }} fs="italic">
                    No post yet
                  </Text>
                </div>
              )}

              <Grid justify={'flex-start'} gutter={0}>
                {data?.posts &&
                  data.posts.map((item, index) => {
                    return (
                      <Grid.Col md={6} lg={4} sm={6} xs={12} xl={3} key={item._id}>
                        <FeedCard {...item} />
                      </Grid.Col>
                    );
                  })}
              </Grid>
            </Fragment>
          )}
        </Stack>
        {/* </Grid> */}
      </AppLayout>
      <Modal
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        onClose={() => setOpened(false)}
        title="Post"
        size="xl"
        radius={'xl'}
        withCloseButton={false}
        centered
      >
        <Text>Modal Content</Text>
      </Modal>
    </Fragment>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  //@ts-ignore
  const username = context.params.username;

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

  console.log('Context', context.params);

  const fetchedUser = queryClient.getQueryData<IGetUserDetail>(['getUserDetail']);

  const fetchOtherUserDetail = await queryClient.fetchQuery<IGetOtherUserDetail>(
    ['getOtherUserDetail'],
    async () =>
      getOtherUserDetail(getToken(context), {
        username: username as string,
        userId: fetchedUser?.user?.id as string,
      }),
    {
      retry: false,
    }
  );


  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      user: fetchOtherUserDetail!.user,
      sessionuser: fetchedUser.user,
    },
  };
}

export default Username;
