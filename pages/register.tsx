import { Fragment, useEffect, useState } from 'react';
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Group,
  Stepper,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { NextLink } from '@mantine/next';
import {
  IconX,
  IconCheck,
  IconUserCheck,
  IconMailOpened,
  IconShieldCheck,
  IconBrandInstagram,
} from '@tabler/icons';
import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import Link from 'next/link';

import useConfirmCodeNew from '../hooks/auth/useConfirmCodeNew';
import useRegister from '../hooks/auth/useRegister';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: 'cover',
    backgroundImage: 'url(https://wallpaperaccess.com/full/459723.jpg)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    background:
      'linear-gradient(to right, #959595 0%, #0D0D0D 46%, #010101 50%, #0A0A0A 53%, #4E4E4E 76%, #383838 87%, #1B1B1B 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

type SUCCESS = 'SUCCESS';

export function Register() {
  const { classes } = useStyles();
  const queryClient = useQueryClient();
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();
  const [signUpResult, setSignUpResult] = useState<ISignUpResult | undefined | SUCCESS>(undefined);

  const form = useForm({
    initialValues: {
      name: '',
      username: '',
      password: '',
      email: '',
      code: '',
    },

    validate: (values) => {
      if (active === 0) {
        return {
          name: values.name.trim().length < 3 ? 'Name must be at least 3 characters' : null,
          username:
            values.username.trim().length < 3
              ? 'Username must include at least 3 characters'
              : null,
          password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
            values.password
          )
            ? null
            : 'Password must include at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
          email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? null : 'Invalid email',
        };
      }

      if (active === 1) {
        return {
          code: values.name.trim().length < 2 ? 'Code must include at least 2 characters' : null,
        };
      }

      return {};
    },
  });

  const {
    mutate,
    data: RegisterData,
    isSuccess,
    isError,
    isLoading,
  } = useRegister({
    name: form.values.name,
    email: form.values.email,
    username: form.values.username,
    password: form.values.password,
  });

  useEffect(() => {
    if (isSuccess) {
      const { isSuccess, message } = RegisterData;

      if (isSuccess) {
        setActive((current) => {
          if (form.validate().hasErrors) {
            return current;
          }
          return current < 2 ? current + 1 : current;
        });
        showNotification({
          message: message,
          radius: 'sm',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
      } else {
        showNotification({
          message: message,
          radius: 'sm',
          color: 'red',
          icon: <IconX size={18} />,
        });
      }
    }
  }, [isSuccess, isError]);

  const {
    refetch: confirmRefetch,
    isFetching: isConfirmFetching,
    data: confirmData,
    isSuccess: isConfirmSuccess,
    isError: isConfirmError,
    error: confirmErrorMessage,
    isLoading: isConfirmLoading,
  } = useConfirmCodeNew({ username: form.values.username, code: form.values.code });

  useEffect(() => {
    form.reset();
  }, []);

  useEffect(() => {
    if (isConfirmError) {
      showNotification({
        //@ts-ignore
        message: confirmErrorMessage.message,
        radius: 'xl',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  }, [isConfirmError]);

  useEffect(() => {
    if (isConfirmSuccess) {
      setActive((current) => {
        if (form.validate().hasErrors) {
          return current;
        }
        return current < 2 ? current + 1 : current;
      });
    }
  }, [isConfirmSuccess]);

  const nextStep = () => {
    if (active === 0 && !form.validate().hasErrors) {
      mutate();
    }

    if (active === 1 && form.values.code.trim().length === 6) {
      confirmRefetch();
    }

    return;
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Container
          size={500}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 10 }}
          mb={40}
        >
          <IconBrandInstagram size={40} style={{ color: 'rgb(131,58,180)' }} />
          <Text fs="italic" sx={() => ({ fontWeight: 600, fontSize: '2rem' })}>
            Pintagram
          </Text>
        </Container>

        <Container size={500}>
          <Paper shadow="none" radius="xl" p="xl" style={{ width: '100%' }}>
            <Stepper active={active} size="xs" orientation="horizontal">
              <Stepper.Step icon={<IconUserCheck size={18} />}>
                <TextInput
                  label="Name"
                  placeholder="Enter your name"
                  {...form.getInputProps('name')}
                  radius="xl"
                  size="sm"
                  disabled={isLoading}
                />
                <TextInput
                  mt="md"
                  label="Username"
                  placeholder="Enter something unique"
                  {...form.getInputProps('username')}
                  radius="xl"
                  disabled={isLoading}
                />
                <TextInput
                  mt="md"
                  label="Email"
                  type="email"
                  placeholder="abc@xyz.com"
                  {...form.getInputProps('email')}
                  radius="xl"
                  disabled={isLoading}
                />
                <PasswordInput
                  mt="md"
                  label="Password"
                  placeholder="*********"
                  {...form.getInputProps('password')}
                  radius="xl"
                  disabled={isLoading}
                />
              </Stepper.Step>

              <Stepper.Step icon={<IconMailOpened size={18} />}>
                <TextInput
                  label="Enter the code"
                  placeholder="Code"
                  {...form.getInputProps('code')}
                  radius="xl"
                  // disabled={form.values(}
                />
              </Stepper.Step>

              <Stepper.Completed>
                <Container
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    columnGap: 10,
                    width: '100%',
                  }}
                  mt={40}
                >
                  <IconBrandInstagram size={30} style={{ color: 'rgb(131,58,180)' }} />
                  <Text fs="italic" sx={() => ({ fontWeight: 600, fontSize: '1.2rem' })}>
                    Welcome to Pintagram
                  </Text>
                </Container>

                <Text align="center" mt={15} size="xs">
                  Now you can login
                </Text>
              </Stepper.Completed>
            </Stepper>

            <Group position="right" mt="xl">
              {active !== 0 && (
                <Fragment>
                  {isConfirmError ? (
                    <Button variant="default" onClick={prevStep} radius="xl">
                      Back
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={prevStep}
                      radius="xl"
                      disabled={signUpResult || 'SUCCESS' ? true : false}
                    >
                      Back
                    </Button>
                  )}
                </Fragment>
              )}
              {active !== 2 && (
                <Button onClick={nextStep} radius="xl" loading={isLoading || isConfirmFetching}>
                  Next
                </Button>
              )}
              {active == 2 && (
                <NextLink href="/login" passHref>
                  <Button onClick={nextStep} radius="xl">
                    Login
                  </Button>
                </NextLink>
              )}
            </Group>

            {active === 0 && (
              <Text color="dimmed" size="xs" align="end" mt={15}>
                Have an account?{' '}
                <Link passHref href="/login">
                  <Text
                    style={{
                      display: 'inline',
                      color: theme.primaryColor,
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </Text>
                </Link>
              </Text>
            )}
          </Paper>
        </Container>
      </Paper>
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

export default Register;
