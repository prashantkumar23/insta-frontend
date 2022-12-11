import { Center, Divider, Grid, Text, Avatar, Button, Stack } from '@mantine/core';
import { IconEditCircle } from '@tabler/icons';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import getUserDetail, { IGetUserDetail } from '../hooks/auth/useGetUserDetail';
import useGetFeedPost from '../hooks/post/useGetFeedPost';
import useGetUserPost from '../hooks/post/useGetUserPost';
import AppLayout from '../layout/AppLayout';
import { getToken } from '../utility/gettoken';

const MyProfile = ({ user }: any) => {
  const router = useRouter();
  const {data, refetch} = useGetFeedPost({ userId: user.id, limit: 10, skip: 0 });

  console.log("Data", data, user);

  useEffect(() => {
    refetch()
  },[])

  return (
    <AppLayout user={user!}>
      {/* <Text>{JSON.stringify(user)}</Text> */}
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
                <Center>
                  <Button
                    radius={'lg'}
                    onClick={() => router.push('/settings')}
                    style={{ width: 150 }}
                    variant="subtle"
                    size="xs"
                    mt={5}
                    leftIcon={<IconEditCircle size={18} />}
                  >
                    Edit
                  </Button>
                </Center>
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
            </Grid.Col>
          </Grid>
        </Center>
        <Divider />
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
