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
  useMantineTheme,
} from '@mantine/core';
// import { IconArrowLeft, IconCheck, IconX } from '@tabler/icons';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { CognitoUser } from 'amazon-cognito-identity-js';

// import { CognitoUserPoolData as Pool } from '../services/aws/cognito';
// import useSendCode from '../hooks/auth/useSendCode';
import { showNotification } from '@mantine/notifications';
// import useResetPassword from '../hooks/auth/useResetPassword';
import { NextLink } from '@mantine/next';
import { IconBrandInstagram, IconCheck, IconInfoCircle, IconX } from '@tabler/icons';
import useSendCode from '../hooks/auth/useSendCode';
import useResetPassword from '../hooks/auth/useResetPassword';

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
  const [username, setUsername] = useState('');
  const theme = useMantineTheme();
  const { isSuccess, isError, mutate, isLoading, data } = useSendCode({
    email: email.value,
  });
  const {
    isSuccess: isSuccessRP,
    isError: isErrorRP,
    data: dataRP,
    isLoading: isLoadingRP,
    mutate: mutateRP,
    error: errorRP,
  } = useResetPassword({ username, code: code.trim(), newPassword: password });

  useEffect(() => {
    if (stage === 2) {
      setUsername(JSON.parse(localStorage.getItem('username_temp') as string));
    }

    if (stage === 3) {
      localStorage.removeItem('username_temp');
    }
  }, [stage]);

  useEffect(() => {
    if (isSuccess) {
      const { isSuccess, message, username } = data;
      if (isSuccess) {
        localStorage.setItem('username_temp', JSON.stringify(username));
        setStage(2);
        showNotification({
          message: message,
          radius: 'xl',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
      } else {
        showNotification({
          message: message,
          radius: 'xl',
          color: 'yellow',
          icon: <IconInfoCircle size={18} />,
        });
      }
    }
    if (isError) {
      showNotification({
        message: JSON.stringify(errorRP),
        radius: 'xl',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessRP) {
      const { isSuccess, message } = dataRP;
      if (isSuccess) {
        setStage(3);
        localStorage.removeItem('username_temp');
        showNotification({
          message: message,
          radius: 'xl',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
      } else {
        showNotification({
          message: message,
          radius: 'xl',
          color: 'red',
          icon: <IconX size={18} />,
        });
      }
    }

    if (isErrorRP) {
      showNotification({
        message: 'Something went wrong!',
        radius: 'xl',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  }, [isSuccessRP, isErrorRP]);

  const sendCode = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setEmail((prevState) => {
        return { ...prevState, error: true };
      });
      return;
    }
    mutate();
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
    mutateRP();
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
            <Center>
              <IconBrandInstagram size={35} style={{ color: 'rgb(131,58,180)' }} />
              <Title className={classes.title} align="center" ml={5}>
                Forgot your password ?
              </Title>
            </Center>
            <Text color="dimmed" size="sm" align="center">
              Enter your registered email to get a code
            </Text>

            <Paper p={30} radius="xl" mt="xl">
              <TextInput
                label="Your email"
                placeholder="xyz@abc.com"
                required
                radius={'xl'}
                value={email.value}
                onChange={(e) =>
                  setEmail((prevState) => {
                    return { error: false, value: e.target.value };
                  })
                }
                error={email.error && 'Email is invalid'}
                disabled={isLoading}
              />
              <Group position="apart" mt="lg" className={classes.controls}>
                <Anchor color="dimmed" size="sm" className={classes.control} href="/login">
                  <Center inline>
                    {/* <IconArrowLeft size={12} stroke={1.5} /> */}
                    <Box ml={5} style={{ fontSize: '0.8rem' }}>
                      Back to login page
                    </Box>
                  </Center>
                </Anchor>
                <Button
                  className={classes.control}
                  radius="xl"
                  onClick={() => sendCode()}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Send code
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
                disabled={isLoadingRP}
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
                disabled={isLoadingRP}
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
                disabled={isLoadingRP}
              />
              <Text size={'xs'} color="red" mt={5}>
                {passwordError.value ? passwordError.message : null}
              </Text>
              <Group position="right" mt="lg" className={classes.controls}>
                <Button
                  className={classes.control}
                  radius="xl"
                  onClick={() => resetPassword()}
                  loading={isLoadingRP}
                  disabled={isLoadingRP}
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
          <Paper style={{ width: '100%' }} p={30} radius="xl">
            <Title className={classes.title} align="center">
              Great! your password now is changed{' '}
              <IconCheck
                style={{
                  backgroundColor: theme.colors.green[6],
                  color: 'white',
                  borderRadius: '50%',
                  padding: 2,
                }}
              />
            </Title>
            <Text align="center" mt={15} size="xs">
              Now you can login again
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

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default ForgotPassword;
