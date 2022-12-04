import { forwardRef, Fragment, useContext, useState } from 'react';
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
import CreatePostDialog from './HomePage/CreatePost';
import {
  Logout,
  Polaroid,

} from 'tabler-icons-react';
import { AccountContext } from '../context/Accounts';
import { User } from '../hooks/auth/useGetUserDetail';

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

function MenuComponent(user: User) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <Fragment>
      {/* {user ? ( */}
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
            >
              Create post
            </Menu.Item>
            {/* <NextLink passHref href="/login" style={{ textDecoration: 'none' }}>
                  <Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>
                    Liked posts
                  </Menu.Item>
                </NextLink>

             */}
            <Menu.Item icon={<Logout size={14} />} color={theme.colors.red[6]}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Fragment>
  );
}

export default MenuComponent;
