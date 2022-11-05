import { forwardRef, Fragment, useContext } from 'react';
import { IconChevronRight } from '@tabler/icons';
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  Divider,
  useMantineTheme,
  Button,
} from '@mantine/core';

import { NextLink } from '@mantine/next';
import {
  Heart,
  Logout,
  Message,
  PlayerPause,
  Settings,
  Star,
  SwitchHorizontal,
  Trash,
} from 'tabler-icons-react';
import { AccountContext } from '../context/Accounts';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" size={35} />
      </Group>
    </UnstyledButton>
  )
);

function MenuComponent() {
  const theme = useMantineTheme();

  return (
    <Fragment>
      {/* {user ? ( */}
        <Group position="center">
          <NextLink passHref href="/me" style={{ textDecoration: 'none' }}>
            <Menu
              withArrow
              trigger="hover"
              transition="pop-bottom-left"
              transitionDuration={150}
              width={270}
              radius={'lg'}
              offset={1}
            >
              <Menu.Target>
                <UserButton
                  image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                  name="Harriette Spoonlicker"
                  email="hspoonlicker@outlook.com"
                />
              </Menu.Target>
              <Menu.Dropdown>
                <NextLink passHref href="/login" style={{ textDecoration: 'none' }}>
                  <Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>
                    Liked posts
                  </Menu.Item>
                </NextLink>

                <NextLink passHref href="/login" style={{ textDecoration: 'none' }}>
                  <Menu.Item icon={<Star size={14} color={theme.colors.yellow[6]} />}>
                    Saved posts
                  </Menu.Item>
                </NextLink>

                <NextLink passHref href="/login" style={{ textDecoration: 'none' }}>
                  <Menu.Item icon={<Message size={14} color={theme.colors.blue[6]} />}>
                    Your comments
                  </Menu.Item>
                </NextLink>

                <Menu.Label>Settings</Menu.Label>
                <NextLink passHref href="/login" style={{ textDecoration: 'none' }}>
                  <Menu.Item icon={<Settings size={14} />}>Account settings</Menu.Item>
                </NextLink>
                <Menu.Item icon={<Logout size={14} />}>Logout</Menu.Item>

                {/* <Divider /> */}

                {/* <Menu.Label>Danger zone</Menu.Label>
            <NextLink passHref href="/login" style={{ textDecoration: 'none' }}>
              <Menu.Item color="red" icon={<Trash size={14} />}>
                Delete account
              </Menu.Item>
            </NextLink> */}
              </Menu.Dropdown>
            </Menu>
          </NextLink>
        </Group>
    </Fragment>
  );
}

export default MenuComponent;
