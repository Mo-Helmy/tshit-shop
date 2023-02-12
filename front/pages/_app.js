import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { createContext, useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';
import { Provider } from 'react-redux';
import store from '../store';

export const ColorModeCtx = createContext({
  toggleColorMode: () => {},
  setColorMode: (mode) => {},
});

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState('light');

  const toggleColorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const setColorMode = useMemo(
    () => ({
      setColorMode: (mode) => setMode(mode),
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <>
      <Head>
        <title>Godzilla</title>
        <meta name="description" content="T-shirt Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorModeCtx.Provider
        value={{
          toggleColorMode: toggleColorMode.toggleColorMode,
          setColorMode: setColorMode.setColorMode,
        }}
      >
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <SessionProvider
              session={pageProps.session}
              refetchInterval={60 * 15}
            >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SessionProvider>
          </Provider>
        </ThemeProvider>
      </ColorModeCtx.Provider>
    </>
  );
}
