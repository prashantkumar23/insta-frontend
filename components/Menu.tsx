import { Fragment, useEffect, useState } from 'react';
import {
  Group,
  Avatar,
  Menu,
  useMantineTheme,
} from '@mantine/core';
import CreatePostDialog from './HomePage/CreatePost';
import { Logout, Polaroid, Settings, UserCircle } from 'tabler-icons-react';
import { User } from '../hooks/auth/useGetUserDetail';
import useLogout from '../hooks/auth/useLogout';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { NextLink } from '@mantine/next';

function MenuComponent(user: User) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { mutate, isSuccess, isLoading, data, isError } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      showNotification({
        message: data.message,
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
      router.push('/login');
    }

    if (isError) {
      showNotification({
        message: 'Something went wrong!',
        radius: 'sm',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  }, [isSuccess, isError]);

  return (
    <Fragment>
      <CreatePostDialog opened={opened} setOpened={setOpened} user={user} />
      <Group position="center">
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
            <Avatar src={user.pic} style={{ borderRadius: '50%' }} size={35} />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              icon={<Polaroid size={14} color={theme.colors.grape[6]} />}
              onClick={() => setOpened(true)}
              disabled={isLoading}
            >
              Create post
            </Menu.Item>
            <NextLink passHref href="/me" style={{ textDecoration: 'none' }}>
              <Menu.Item icon={  <Avatar src={user.pic} style={{ borderRadius: '50%' }} size={14}  />}>
                My Profile
              </Menu.Item>
            </NextLink>

            <NextLink passHref href="/settings" style={{ textDecoration: 'none' }}>
              <Menu.Item icon={<Settings size={14} color={theme.colors.blue[6]}  />}>
                Settings
              </Menu.Item>
            </NextLink>

            <Menu.Item
              disabled={isLoading}
              icon={<Logout size={14} />}
              color={theme.colors.red[6]}
              onClick={() => mutate()}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Fragment>
  );
}

export default MenuComponent;
