import React, { forwardRef } from 'react';
import { IconBell, IconChevronRight, IconNotification } from '@tabler/icons';
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  Divider,
  useMantineTheme,
  Paper,
  Title,
  Card,
  ScrollArea,
} from '@mantine/core';
import { NextLink } from '@mantine/next';

function NotificationMenuComponent() {
  return (
    <Menu
      withArrow
      radius={'md'}
      transition="pop-bottom-left"
      transitionDuration={150}
      position="bottom"
      shadow={'xl'}
      width={400}
      trigger="hover"
    >
      <Menu.Target>
        <IconBell size={26} />
      </Menu.Target>
      <Menu.Dropdown>
        <div style={{ maxHeight: 500, overflowY: 'scroll' }}>
          <Paper mr={10}>
            {Array.from(Array(20).keys()).map((index) => {
              return (
                <Menu.Item key={index}>
                  <Text>{index.toString() + 1}</Text>
                </Menu.Item>
              );
            })}
          </Paper>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
}

export default React.memo(NotificationMenuComponent);
