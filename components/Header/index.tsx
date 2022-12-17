import React, {
  forwardRef,
  Fragment,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  createStyles,
  Container,
  Group,
  Button,
  Indicator,
  Text,
  Autocomplete,
  Avatar,
  MantineColor,
  SelectItemProps,
  Paper,
  Grid,
} from '@mantine/core';
import MenuComponent from '../Menu';
import { NextLink } from '@mantine/next';
import { IconBrandInstagram, IconSearch } from '@tabler/icons';

import { AccountContext } from '../../context/Accounts';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { User } from '../../hooks/auth/useGetUserDetail';
import useSearch from '../../hooks/useSearch';
import { useRouter } from 'next/router';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    // marginBottom: 120,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  userMenu: {
    // [theme.fn.smallerThan('xs')]: {
    //   display: 'none',
    // },
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  tabsList: {
    borderBottom: '0 !important',
  },

  tabControl: {
    fontWeight: 500,
    height: 38,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    },
  },

  tabControlActive: {
    borderColor: `${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
    } !important`,
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    // [theme.fn.smallerThan('md')]: {
    //   display: 'none',
    // },
  },

  search: {
    // [theme.fn.smallerThan('xs')]: {
    //   display: 'none',
    // },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

interface ItemProps extends SelectItemProps {
  name: string;
  username: string;
  pic: string;
  _id: string;
  value: string;
}

interface HeaderTabsProps {
  user: User;
  links: { link: string; label: string }[];
}

export function Header({ user }: HeaderTabsProps) {
  const { classes, theme, cx } = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const router = useRouter();
  const [debounced] = useDebouncedValue(searchTerm, 1000);
  // const matches = useMediaQuery('(max-width: 500px)', true, { getInitialValueInEffect: false });
  const {
    refetch,
    data: searchResults,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useSearch({
    searchTerm,
  });

  useEffect(() => {
    if (debounced) {
      refetch();
    }
  }, [debounced]);

  useEffect(() => {
    if (searchResults) {
      const res = JSON.parse(searchResults.searchResult);

      if (res.length > 0) {
        const d = res.map((ele: any) => {
          return {
            value: ele.username,
            ...ele,
          };
        });

        console.log(d);
        setSearchedData(d);
      } else {
        setSearchedData([]);
      }
    }

    if (isError) {
      console.log('Data error', error);
    }
  }, [isLoading]);

  const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ username, name, pic, _id }: ItemProps, ref) => (
      <Paper
        ref={ref}
        p={5}
        mb={10}
        onClick={() => router.push(`/${_id}`)}
        radius="md"
        withBorder
        sx={{ cursor: 'pointer' }}
      >
        <Group noWrap>
          <Avatar src={pic} radius="xl" size={30} />
          <div>
            <Text>{name}</Text>
            <Text size={'xs'} c="dimmed">
              {username}
            </Text>
          </div>
        </Group>
      </Paper>
    )
  );

  return (
    <div
      className={classes.header}
      //  style={{backgroundColor: matches ? "lightgreen": "lightcoral"}}
    >
      <Container className={classes.mainSection}>
        <Grid  justify="space-between" align={"center"}>
          <Grid.Col span={"content"}>
            <NextLink passHref href="/">
              <IconBrandInstagram size={50} style={{ color: 'rgb(131,58,180)' }} />
            </NextLink>
          </Grid.Col>

          <Grid.Col span={'content'}>
            <Group>
              <Autocomplete
                radius={'lg'}
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search..."
                itemComponent={AutoCompleteItem}
                data={searchedData}
                icon={<IconSearch size={16} />}
                nothingFound={<Text>No Results found</Text>}
                // filter={(value, item) =>
                //   item.value.toLowerCase().includes(searchTerm.toLowerCase().trim())
                // }
                // style={{ width: '16rem' }}
                transition="pop-top-left"
                transitionDuration={80}
                transitionTimingFunction="ease"
              />
            </Group>
          </Grid.Col>

          <Grid.Col span={"content"}>
            <MenuComponent {...user} />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
