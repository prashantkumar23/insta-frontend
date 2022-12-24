import {
  Center,
  Grid,
  Paper,
  Text,
  Stack,
  Avatar,
  Button,
  TextInput,
  Container,
  Group,
} from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import UploadProfileImage from '../components/UploadProfileImage';
import getUserDetail, { IGetUserDetail } from '../hooks/auth/useGetUserDetail';
import AppLayout from '../layout/AppLayout';
import { getToken } from '../utility/gettoken';

const SettingsPage = (props: any) => {
  const [opened, setOpened] = useState(false);

  const [user, setUser] = useState({
    username: '',
    email: '',
    name: '',
    pic: '',
  });

  useEffect(() => {
    if (props.user) {
      const {
        user: { name, email, username, pic },
      } = props;
      setUser({
        name,
        username,
        email,
        pic,
      });
    }
  }, [props]);

  return (
    <AppLayout user={props.user!}>
      <Container>
        <Paper withBorder radius={'xl'} p={30} style={{ height: '80vh' }}>
          <Center sx={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }}>
              <Center sx={{ width: '100%' }}>
                <Stack>
                  <Avatar size={100} radius="xl" sx={{ borderRadius: '50%' }} src={user.pic} />

                  <Button
                    radius={'lg'}
                    onClick={() => setOpened(true)}
                    variant="subtle"
                    size="xs"
                    mt={5}
                  >
                    Change
                  </Button>
                </Stack>
              </Center>

              <Grid justify={'center'} align="center" mt={20} gutter={30}>
                <Grid.Col xs={12} sm={4}>
                  <Stack>
                    <Stack spacing={5}>
                      <Text size="xs">Name</Text>
                      <TextInput
                        disabled
                        value={user.name}
                        onChange={(e) =>
                          setUser((prevState) => {
                            return {
                              ...prevState,
                              name: e.target.value,
                            };
                          })
                        }
                        radius="lg"
                        size='xs'
                      />
                    </Stack>

                    <Stack spacing={5}>
                      <Text size={"xs"}>Username</Text>
                      <TextInput
                        disabled
                        size='xs'
                        value={user.username}
                        onChange={(e) =>
                          setUser((prevState) => {
                            return {
                              ...prevState,
                              username: e.target.value,
                            };
                          })
                        }
                        radius="lg"
                      />
                    </Stack>

                    <Stack spacing={5}>
                      <Text size={"xs"}>Email</Text>
                      <TextInput
                        disabled
                        size='xs'
                        value={user.email}
                        onChange={(e) =>
                          setUser((prevState) => {
                            return {
                              ...prevState,
                              email: e.target.value,
                            };
                          })
                        }
                        radius="lg"
                      />
                    </Stack>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>
          </Center>
        </Paper>
      </Container>
      <UploadProfileImage opened={opened} setOpened={setOpened} user={props.user} />
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

export default SettingsPage;
