import React, { Fragment, useContext, useState } from 'react';
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
import { useMediaQuery } from '@mantine/hooks';
import { IconHeart, IconLogout, IconMessage2 } from '@tabler/icons';
import getUserDetail, { IGetUserDetail } from '../hooks/auth/useGetUserDetail';
import { getToken } from '../utility/gettoken';

const Username: NextPage = ({ user }: any) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  console.log('USer', user);
  const matches = useMediaQuery('(min-width: 950px)', false);

  const FeedCard = () => (
    <Card
      radius={'lg'}
      style={{ backgroundColor: 'transparent' }}
      p="sm"
      onClick={() => setOpened(true)}
    >
      <Image
        // width={250}
        height={300}
        radius={'xl'}
        src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
        onClick={() => console.log('Card')}
        style={{ cursor: 'pointer' }}
      />
      <Group mt={20} pl={5} spacing={10} style={{ cursor: 'pointer' }}>
        <Group spacing={4}>
          <IconHeart size={22} stroke={1} />
          <Text color="dimmed">56k</Text>
        </Group>
        <Group spacing={4}>
          <IconMessage2 size={22} stroke={1} />
          <Text color="dimmed">45</Text>
        </Group>
      </Group>
    </Card>
  );

  return (
    <Fragment>
      <AppLayout user={user}>
        <Grid mt={40}>
          {matches ? (
            <Grid.Col span={3}>
              <Stack style={{ textAlign: 'center' }} spacing={3}>
                <Avatar
                  style={{ margin: 'auto' }}
                  size="xl"
                  radius={'xl'}
                  src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
                />
                <Text weight={700} size="xl">
                  {user?.name}
                </Text>
                <Text color={'dimmed'} size="sm">
                  @{user?.username}
                </Text>

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

                <Divider mt={40} />

                <Stack>
                  <Button leftIcon={<IconLogout color="grey" />} variant="subtle" mt={20}>
                    <Text color={'dimmed'} align="left">
                      Logout
                    </Text>
                  </Button>
                </Stack>
              </Stack>
            </Grid.Col>
          ) : null}

          <Grid.Col span={!matches ? 12 : 9} pl={50}>
            <Title mb={20} ml={20}>
              Feed
            </Title>
            <Grid justify={'flex-start'}>
              {[1].map((item, index) => (
                <Grid.Col span={4} md={6} lg={4} sm={6} key={item + index}>
                  <FeedCard />
                </Grid.Col>
              ))}
            </Grid>
          </Grid.Col>
        </Grid>
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
