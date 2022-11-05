import React, { CSSProperties, ReactNode } from 'react';
import { AppShell, useMantineTheme, Center } from '@mantine/core';

import { SpotlightAction, SpotlightProvider } from '@mantine/spotlight';
import { Dashboard, FileText, Home, Search } from 'tabler-icons-react';
import { Header } from '../components/Header/HeaderNew';
import { IconSearch } from '@tabler/icons';
import { User } from '../hooks/auth/useGetUserDetail';

interface AppLayoutProps {
  children: ReactNode;
  style?: CSSProperties;
  user: User
}
const actions: SpotlightAction[] = [
  {
    title: 'Home',
    description: 'Get to home page',
    onTrigger: () => console.log('Home'),
    icon: <Home size={18} />,
  },
  {
    title: 'Dashboard',
    description: 'Get full information about current system status',
    onTrigger: () => console.log('Dashboard'),
    icon: <Dashboard size={18} />,
  },
  {
    title: 'Documentation',
    description: 'Visit documentation to lean more about all features',
    onTrigger: () => console.log('Documentation'),
    icon: <FileText size={18} />,
  },
];

const data = {
  user: {
    name: 'Jane Spoonfighter',
    email: 'janspoon@fighter.dev',
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
  },
  links: [
    {
      link: '/about',
      label: 'Features',
    },
    {
      link: '/pricing',
      label: 'Pricing',
    },
    {
      link: '/learn',
      label: 'Learn',
    },
    {
      link: '/community',
      label: 'Community',
    },
  ],
};

const AppLayout: React.FC<AppLayoutProps> = ({ children, style, user }) => {
  const theme = useMantineTheme();

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          minHeight: 'calc(100vh - 107px)',
        },
      }}
      style={style}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      header={
        <Header user={user} links={data.links} />
      }
    >
      <Center>
        <div style={{ width: '80%' }}>{children}</div>
      </Center>
    </AppShell>
  );
};

export default AppLayout;
