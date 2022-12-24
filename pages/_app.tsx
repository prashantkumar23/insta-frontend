import { GetServerSidePropsContext } from 'next';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { NavigationProgress } from '@mantine/nprogress';
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
  createEmotionCache,
  Transition,
  Affix,
  Button,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Account } from '../context/Accounts';
import { IconArrowUp } from '@tabler/icons';
import { useWindowScroll } from '@mantine/hooks';
import { RouterTransition } from '../components/RouterTransition';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const [queryClient] = useState(() => new QueryClient());
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const [scroll, scrollTo] = useWindowScroll();

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  const myCache = createEmotionCache({ key: 'mantine' });

  return (
    <>
      <Head>
        <title>Pintagram</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <Account>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
              <MantineProvider
                theme={{ colorScheme: 'light' }}
                withGlobalStyles
                withNormalizeCSS
                // emotionCache={myCache}
              >
                <RouterTransition />
                <NotificationsProvider>
                  <Component {...pageProps} />
                  <Affix position={{ bottom: 50, right: 20 }} style={{ cursor: 'pointer' }}>
                    <Transition transition="slide-up" mounted={scroll.y > 0}>
                      {(transitionStyles) => (
                        <IconArrowUp style={transitionStyles} onClick={() => scrollTo({ y: 0 })} />
                      )}
                    </Transition>
                  </Affix>
                </NotificationsProvider>
              </MantineProvider>
            </ColorSchemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </Account>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});
