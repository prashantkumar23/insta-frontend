import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Anchor,
  Stack,
  Container,
  Center,
  ActionIcon,
  createStyles,
  useMantineTheme,
  Title,
} from '@mantine/core';
import {
  IconBrandGoogle,
  IconBrandFacebook,
  IconBrandTwitter,
  IconX,
  IconCheck,
} from '@tabler/icons';
import Link from 'next/link';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import useLoginNew from '../hooks/auth/useLogin';
import { AccountContext } from '../context/Accounts';

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundSize: 'cover',
    backgroundImage: 'url(https://www.pixelstalk.net/wp-content/uploads/2016/04/Images-free-abstract-minimalist-wallpaper-HD.jpg)',
  },
}));

function LoginPage(props: any) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const context = useContext(AccountContext);
  if (!context) return null;
  const { user, setUser } = context;

  const router = useRouter();
  const queryClient = new QueryClient();
  const form = useForm({
    initialValues: {
      password: '',
      username: '',
    },

    validate: {
      username: (val) => val.length <=3 && 'Username/Email is invalid',
      password: (val) => val.length < 8 && 'Password should include at least 6 characters',
    },
  });

  const { mutate, data, isSuccess, isError, isLoading, error } = useLoginNew({
    username: form.values.username,
    password: form.values.password,
  });

  useEffect(() => {
    if (isError) {
      console.error('Login Error', error);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      const {
        login: { isSuccess, message },
      } = data;

      if (isSuccess) {
        showNotification({
          message: message,
          radius: 'sm',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
        router.replace('/');
      } else {
        showNotification({
          message: message,
          radius: 'sm',
          color: 'red',
          icon: <IconX size={18} />,
        });
      }
    }
  }, [isSuccess]);

  return (
    <div className={classes.wrapper}>
      <Container
        size={480}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper shadow={undefined} radius="lg" p="xl" withBorder style={{ width: '100%' }}>
          <Center mb={20}>
            <Title>
              Welcome Back!
            </Title>
          </Center>

          <form onSubmit={form.onSubmit(() => mutate())}>
            <Stack spacing={20}>
              <TextInput
                label="Username"
                placeholder="Enter your username or email"
                value={form.values.username}
                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                radius="xl"
                disabled={isLoading || data?.login.isSuccess}
                error={form.errors.username && "Username/Email is invalid"}
      
/>


              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && 'Password should include at least 6 characters'}
                radius="xl"
                disabled={isLoading || data?.login.isSuccess}
              />
              <div style={{justifyContent: "flex-end", display: "flex"}}>
              <Link passHref href="/forgot" >
                <Anchor
                  component="button"
                  type="button"
                  color="dimmed"
                  size="xs"
                  style={{ textAlign: 'end',  width: "max-content", textDecorationLine: "none" }}
                  disabled={isLoading || data?.login.isSuccess}
                >
                  Forgot your password?
                </Anchor>
              </Link>
              </div>
            
            </Stack>

            <Group position="apart" mt="xl">
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                size="xs"
                disabled={isLoading || data?.login.isSuccess}
                style={{ textDecoration: 'none' }}
              >
                Don't have an account?{' '}
                <Link passHref href="/register">
                  <Text
                    style={{
                      display: 'inline',
                      color: theme.primaryColor,
                      fontWeight: 600,
                    }}
                  >
                    Register
                  </Text>
                </Link>
              </Anchor>
              <Button
                type="submit"
                loading={isLoading}
                disabled={data?.login.isSuccess}
                radius="xl"
              >
                Login
              </Button>
            </Group>
          </form>

          {data?.login.isSuccess ? (
            <Text fz="xs" align="center">
              Please wait redirecting...
            </Text>
          ) : null}
        </Paper>
      </Container>
    </div>
  );
}

export async function getServerSideProps(ctx: any) {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default LoginPage;
