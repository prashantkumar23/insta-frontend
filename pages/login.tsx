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
} from '@mantine/core';
import { IconBrandGoogle, IconBrandFacebook, IconBrandTwitter, IconX } from '@tabler/icons';
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
    backgroundImage: 'url(https://cdn.wallpapersafari.com/86/75/VrsOQC.jpg)',
  },
}));

function LoginPage(props: any) {
  const { classes } = useStyles();

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
      // email: (val) => /^\S+@\S+$/.test(val) && 'Invalid email',
      // password: (val) => val.length >= 8 && 'Password should include at least 6 characters',
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

  if (isSuccess) {
    // showNotification({
    //   message: data.login.message,
    //   radius: 'sm',
    //   color: 'green',
    //   icon: <IconX size={18} />,
    // });

    // if (data.login.isSuccess) {
    //   router.replace('/');
    // }
  }

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
        <Paper shadow="xl" radius="xl" p="xl" withBorder style={{ width: '100%' }}>
          <Center mb={20}>
            <Text size="lg" weight={500}>
              Welcome back to Insta Clone
            </Text>
          </Center>

          <form onSubmit={form.onSubmit(() => mutate())}>
            <Stack spacing={20}>
              <TextInput
                label="Username"
                placeholder="Enter your username/email"
                value={form.values.username}
                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                radius="xl"
                disabled={isLoading}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && 'Password should include at least 6 characters'}
                radius="xl"
                disabled={isLoading}
              />
              <Link passHref href="/forgot">
                <Anchor
                  component="button"
                  type="button"
                  color="dimmed"
                  size="xs"
                  style={{ textAlign: 'end' }}
                  disabled={isLoading}
                >
                  Forgot your password?
                </Anchor>
              </Link>
            </Stack>

            <Group position="apart" mt="xl">
              <Link passHref href="/register">
                <Anchor
                  component="button"
                  type="button"
                  color="dimmed"
                  size="xs"
                  disabled={isLoading}
                >
                  Don't have an account? Register
                </Anchor>
              </Link>
              <Button type="submit" loading={isLoading} radius="xl">
                Login
              </Button>
            </Group>
          </form>
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
