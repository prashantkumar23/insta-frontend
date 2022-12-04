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
} from '@mantine/core';
import MenuComponent from '../Menu';
import { NextLink } from '@mantine/next';
import NotificationMenuComponent from '../NotificationMenu';
import { IconBrandInstagram } from '@tabler/icons';

import CreatePostButton from '../Buttons/CreatePostButton';
import { AccountContext } from '../../context/Accounts';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { User } from '../../hooks/auth/useGetUserDetail';

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

const charactersList = [
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    label: 'Bender Bending Rodríguez',
  },

  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Carol Miller',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/homer-simpson.png',
    label: 'Homer Simpson',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/spongebob-squarepants.png',
    label: 'Spongebob Squarepants',
  },
];

const data = charactersList.map((item) => ({ ...item, value: item.label }));

interface ItemProps extends SelectItemProps {
  color: MantineColor;
  description: string;
  image: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ description, value, image, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others} style={{ borderRadius: '0.7rem' }}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text>{value}</Text>
        </div>
      </Group>
    </div>
  )
);

interface HeaderTabsProps {
  user: User;
  links: { link: string; label: string }[];
}

export function Header({ user }: HeaderTabsProps) {
  const { classes, theme, cx } = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [debounced] = useDebouncedValue(searchTerm, 1000);
  const matches = useMediaQuery('(max-width: 500px)', true, { getInitialValueInEffect: false });

  useEffect(() => {
    console.log("Debounced Value", debounced)
  }, [debounced]);

  return (
    <div className={classes.header}
    //  style={{backgroundColor: matches ? "lightgreen": "lightcoral"}}
     >
      <Container className={classes.mainSection}>
        <Group position="apart">
          {/* <MantineLogo /> */}
          <NextLink passHref href="/">
            <IconBrandInstagram size={50} style={{ color: 'rgb(131,58,180)' }} />
          </NextLink>

          <Group>
            <Autocomplete
              radius={'lg'}
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search..."
              itemComponent={AutoCompleteItem}
              data={data}
              filter={(value, item) =>
                item.value.toLowerCase().includes(searchTerm.toLowerCase().trim())
              }
              // style={{ width: '16rem' }}
            /> 
            {/* <CreatePostButton  radius="xl" /> */}
            {/* {user ? <Fragment>
         
        
            {/* </Fragment>: null} */}
          </Group>

          <MenuComponent {...user} />
        </Group>
      </Container>
    </div>
  );
}
