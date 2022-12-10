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
import { IconHeart, IconLogout, IconMessage2 } from '@tabler/icons';
import { useRouter } from 'next/router';

import getUserDetail, { IGetUserDetail } from '../hooks/auth/useGetUserDetail';
import { getToken } from '../utility/gettoken';
import useGetFeedPost, { FeedPost } from '../hooks/post/useGetFeedPost';
import SkeletonFeedCard from '../components/Skeleton/SkeletonFeedCard';

const LIMIT = 100;

const FeedCard = ({ comments, likes, imageUrl, id }: FeedPost) => {
  const router = useRouter();
  return (
    <Card
      radius={'xs'}
      style={{ backgroundColor: 'transparent' }}
      // p="sm"
      onClick={() => router.push(`/p/${id}`)}
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
      {/* <Group mt={10} pl={5} spacing={10} style={{ cursor: 'pointer' }}>
        <Group spacing={4} onClick={() => router.push(`/p/${id}`)}>
          <IconHeart size={18} stroke={1} />
          <Text color="dimmed" size="xs">
            {likes}
          </Text>
        </Group>
        <Group spacing={4} onClick={() => router.push(`/p/${id}`)}>
          <IconMessage2 size={18} stroke={1} />
          <Text color="dimmed" size="xs">
            {comments}
          </Text>
        </Group>
      </Group> */}
    </Card>
  );
};

const Username: NextPage = ({ user }: any) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { refetch, data, isSuccess, isLoading } = useGetFeedPost({
    userId: user.id,
    limit: LIMIT,
    skip: 0,
  });
  // console.log('USer', user);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    // if (isSuccess) console.log('Post ************', data);
  }, [isSuccess]);

  return (
    <Fragment>
      <AppLayout user={user}>
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
                        {user?.numberOfFollowers}
                      </Text>
                      <Text color={'dimmed'} size="sm">
                        Followers
                      </Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Stack spacing={0}>
                      <Text weight={700} size="xl">
                        {user?.numberOfFollowings}
                      </Text>
                      <Text color={'dimmed'} size="sm">
                        Following
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>

                <div style={{ margin: '1rem', marginBottom: 0 }}>
                  <Button radius={'lg'} style={{ width: '100%' }}>
                    Follow
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
              {Array(10).fill(undefined).map((_, index) => (
                <Grid.Col md={6} lg={4} sm={6} xs={12} xl={3} key={index}>
                  <SkeletonFeedCard />
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <Grid justify={'flex-start'} gutter={0}>
              {data?.posts &&
                data.posts.map((item, index) => {
                  return (
                    <Grid.Col md={6} lg={4} sm={6} xs={12} xl={3} key={item.id}>
                      <FeedCard {...item} />
                    </Grid.Col>
                  );
                })}
            </Grid>
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

export default Username;
