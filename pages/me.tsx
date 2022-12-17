import { Center, Divider, Grid, Text, Avatar, Button, Stack } from '@mantine/core';
import { IconEditCircle } from '@tabler/icons';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import SkeletonFeedCard from '../components/Skeleton/SkeletonFeedCard';
import getUserDetail, { IGetUserDetail } from '../hooks/auth/useGetUserDetail';
import useGetUserPost from '../hooks/post/useGetUserPost';
import AppLayout from '../layout/AppLayout';
import { getToken } from '../utility/gettoken';
import { FeedCard } from './[username]';

const MyProfile = ({ user }: any) => {
  const router = useRouter();
  const { data, refetch, isLoading } = useGetUserPost({ username: user.username, limit: 100, skip: 0 });

  console.log(user)
  useEffect(() => {
    refetch();
  }, []);

  return (
    <AppLayout user={user!}>
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
                  <Button radius={'lg'} style={{ width: '100%' }} onClick={() => router.push("/settings")}>
                    Edit
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

export default MyProfile;
