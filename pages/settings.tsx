import { Center, Divider, Grid, Paper, ScrollArea, Stepper, Tabs, Title, Text } from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { SettingInfoCard } from '../components/Settings/SettingInfoCard';
import AppLayout from '../layout/AppLayout';
import AccountSetting from '../layout/Settings/AccountSetting';

const SettingsPage = () => {
  const [active, setActive] = useState(1);

  return (
    <AppLayout>
      <Paper
        withBorder
        radius={'xl'}
        p={30}
        // style={{ maxHeight: "calc(100vh)",  width: '100%' }}
      >
        <Grid>
          <Grid.Col span={3}>
            <Text mb={20} weight={700} size="xl">Settings</Text>
            <ScrollArea.Autosize type='hover' offsetScrollbars maxHeight={450} >
              <Grid gutter={'xl'}>
                {data.map((ele, index) => {
                  return (
                    <Grid.Col onClick={() => setActive(index + 1)} style={{ cursor: 'pointer' }}>
                      <SettingInfoCard
                        body={ele.body}
                        author={ele.author}
                      />
                      <Divider mt={5}/>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </ScrollArea.Autosize>
          </Grid.Col>
          <Grid.Col span={9}>
            <Paper>
              {active === 1 ? <AccountSetting/> :    <Title>Coming Soon...</Title>}
           
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>
    </AppLayout>
  );
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default SettingsPage;

const data = [
  {
    body: 'This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.',
    author: {
      name: 'Account',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    body: 'This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.',
    author: {
      name: 'Notification',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    body: 'This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.',
    author: {
      name: 'Security',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    body: 'This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.',
    author: {
      name: 'Appearence',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    body: 'This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.',
    author: {
      name: 'Billing',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    body: 'This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.',
    author: {
      name: 'Integrations',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
  {
    body: 'This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.',
    author: {
      name: 'Additional Resources',
      image:
        'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    },
  },
];
