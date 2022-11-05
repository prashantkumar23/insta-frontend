import { Fragment, useEffect, useState } from 'react';
import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
} from '@mantine/core';
import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { CognitoUser } from 'amazon-cognito-identity-js';

import { CognitoUserPoolData as Pool } from '../services/aws/cognito';
import useSendCode from '../hooks/auth/useSendCode';
import { showNotification } from '@mantine/notifications';
import useResetPassword from '../hooks/auth/useResetPassword';
import { NextLink } from '@mantine/next';

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1608501078713-8e445a709b39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)',
  },

  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}));

function ForgotPassword() {
  const { classes } = useStyles();
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState({ value: '', error: false });
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState({ value: false, message: '' });

  const queryClient = new QueryClient();
  const { refetch, isSuccess, isError, error, isFetching } = useSendCode({ email: email.value });
  const {
    refetch: refetchRP,
    isSuccess: isSuccessRP,
    isError: isErrorRP,
    error: errorRP,
    isFetching: isFetchingRP,
    data: dataRP,
  } = useResetPassword({ email: email.value, code, password });

  useEffect(() => {
    if (isError) {
      showNotification({
        //@ts-ignore
        message: error.message,
        radius: 'xl',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isErrorRP) {
      showNotification({
        //@ts-ignore
        message: errorRP.message,
        radius: 'xl',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  }, [isErrorRP]);

  useEffect(() => {
    if (isSuccess) {
      setStage(2);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessRP) {
      setStage(3);
      queryClient.invalidateQueries();
    }
  }, [isSuccessRP]);

  const sendCode = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setEmail((prevState) => {
        return { ...prevState, error: true };
      });
      return;
    }
    refetch();
  };

  const resetPassword = () => {
    if (password.trim() !== confirmPassword.trim()) {
      setPasswordError({ value: true, message: "Your password didn't match" });
      return;
    } else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)) {
      setPasswordError({
        value: true,
        message:
          'Password must include at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      });
      return;
    }
    refetchRP();
  };

  return (
    <div className={classes.wrapper}>
      {stage === 1 && (
        <Container
          size={480}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Paper style={{ width: '100%' }} p="xl" radius={'xl'}>
            <Title className={classes.title} align="center">
              Forgot your password?
            </Title>
            <Text color="dimmed" size="sm" align="center">
              Enter your registered email to get a code
            </Text>

            <Paper p={30} radius="xl" mt="xl">
              <TextInput
                label="Your email"
                placeholder="me@me.com"
                required
                radius={'xl'}
                value={email.value}
                onChange={(e) =>
                  setEmail((prevState) => {
                    return { error: false, value: e.target.value };
                  })
                }
                error={email.error && 'Email is invalid'}
              />
              <Group position="apart" mt="lg" className={classes.controls}>
                <Anchor color="dimmed" size="sm" className={classes.control} href="/login">
                  <Center inline>
                    <IconArrowLeft size={12} stroke={1.5} />
                    <Box ml={5} style={{ fontSize: '0.8rem' }}>
                      Back to login page
                    </Box>
                  </Center>
                </Anchor>
                <Button
                  className={classes.control}
                  radius="xl"
                  onClick={() => sendCode()}
                  loading={isFetching}
                >
                  Send the code
                </Button>
              </Group>
            </Paper>
          </Paper>
        </Container>
      )}

      {stage === 2 && (
        <Container
          size={480}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Paper style={{ width: '100%' }} radius="xl" withBorder shadow={'xl'} p={30}>
            <Title className={classes.title} align="center">
              Make a new password
            </Title>

            <Paper p={30} radius="xl" mt="xl">
              <TextInput
                label="Enter the Code"
                placeholder="******"
                required
                radius={'xl'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <TextInput
                label="New Password"
                mt={15}
                required
                radius={'xl'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError({ value: false, message: '' });
                }}
              />
              <TextInput
                label="Confirm New Password"
                mt={15}
                required
                radius={'xl'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError({ value: false, message: '' });
                }}
              />
              <Text size={'xs'} color="red" mt={5}>
                {passwordError.value ? passwordError.message : null}
              </Text>
              <Group position="right" mt="lg" className={classes.controls}>
                <Button
                  className={classes.control}
                  radius="xl"
                  onClick={() => resetPassword()}
                  loading={isFetchingRP}
                >
                  Update password
                </Button>
              </Group>
            </Paper>
          </Paper>
        </Container>
      )}

      {stage === 3 && (
        <Container
          size={680}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Paper style={{ width: '100%' }}>
            <Title className={classes.title} align="center">
              Great! your password now is changed
            </Title>
            <Text align="center" mt={15}>
              Now you can login back
            </Text>

            <Group position="center" mt="lg" className={classes.controls}>
              <NextLink href="/login" passHref>
                <Button className={classes.control} radius="xl">
                  Login
                </Button>
              </NextLink>
            </Group>
          </Paper>
        </Container>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery(['posts'], getPosts);
  // await queryClient.prefetchQuery(['films'], getFilms);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default ForgotPassword;
