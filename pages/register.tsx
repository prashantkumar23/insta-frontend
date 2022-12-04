import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  ActionIcon,
  Center,
  Code,
  Container,
  Group,
  Stepper,
  Divider,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { NextLink } from '@mantine/next';
import {
  IconBrandGoogle,
  IconBrandFacebook,
  IconBrandTwitter,
  IconMailOpened,
  IconSignRight,
  IconX,
} from '@tabler/icons';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import useRegisterNew from '../hooks/auth/useRegisterNew';
import useConfirmCodeNew from '../hooks/auth/useConfirmCodeNew';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://wallpaperaccess.com/full/459723.jpg)',
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
    refetch,
    isFetching,
    data: RegisterData,
    isSuccess,
    isError,
    error,
  } = useRegisterNew({
    name: form.values.name,
    email: form.values.email,
    username: form.values.username,
    password: form.values.password,
  });

  if(isSuccess) {
    console.log("Register Data", RegisterData)
  }

  const {
    refetch: confirmRefetch,
    isFetching: isConfirmFetching,
    data: confirmData,
    isSuccess: isConfirmSuccess,
    isError: isConfirmError,
    error: confirmErrorMessage,
  } = useConfirmCodeNew({ username: form.values.username, code: form.values.code });

  if(isConfirmSuccess) {
    console.log("Confirm Data", confirmData)
  }

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
    if (isSuccess) {
      setActive((current) => {
        if (form.validate().hasErrors) {
          return current;
        }
        return current < 2 ? current + 1 : current;
      });
    }
  }, [isSuccess]);

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

  // if (isSuccess) {
  //   console.log('Register Data****************', RegisterData);
  // }

  // if (isConfirmSuccess) {
  //   console.log('Confrim Data *************************', confirmData);
  // }

  const nextStep = () => {
    if (active === 0 && !form.validate().hasErrors) {
      refetch();
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
        <Container size={500}>
          <Title
            align="center"
            sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          >
            Welcome to Insta Clone!
          </Title>
         
        </Container>

        <Container size={500}>
          <Paper shadow="none" radius="xl" p="xl" style={{ width: '100%' }}>
            <Stepper active={active} breakpoint="sm" size="xs">
              <Stepper.Step
                // label="General Information"
                // description="Enter the Details"
                // icon={
                //   <IconSignRight size={18} style={{ backgroundColor: 'green', color: 'white' }} />
                // }
              >
                <TextInput
                  label="Name"
                  placeholder="Name"
                  {...form.getInputProps('name')}
                  radius="xl"
                  size="sm"
                />
                <TextInput
                  mt="md"
                  label="Username"
                  placeholder="Username"
                  {...form.getInputProps('username')}
                  radius="xl"
                />
                <TextInput
                  mt="md"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  {...form.getInputProps('email')}
                  radius="xl"
                />
                <PasswordInput
                  mt="md"
                  label="Password"
                  placeholder="Password"
                  {...form.getInputProps('password')}
                  radius="xl"
                />
              </Stepper.Step>

              <Stepper.Step
                // label="Verify Email"
                // description="Enter the code"
                // icon={<IconMailOpened size={18} />}
                // loading
              >
                <TextInput
                  label="Enter the code"
                  placeholder="Code"
                  {...form.getInputProps('code')}
                  radius="xl"
                />
              </Stepper.Step>

              <Stepper.Completed>
                <Title>Congraulations! Welcome to this blog community</Title>
                <Text>Now you can login</Text>
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
                <Button onClick={nextStep} radius="xl" loading={isFetching || isConfirmFetching}>
                  Next step
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
          </Paper>
        </Container>
      </Paper>
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

export default Register;
