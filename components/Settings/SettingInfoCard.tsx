import { createStyles, Text, Avatar, Group, Paper, Center } from '@mantine/core';
import { IconSettings } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 30,
    fontSize: "0.7rem"
  },
}));

interface CommentSimpleProps {
  body: string;
  author: {
    name: string;
    image: string;
  };
}

export function SettingInfoCard({ body, author }: CommentSimpleProps) {
  const { classes } = useStyles();
  return (
    <Paper  radius={"md"} p={0} mb={20}>
      <Center inline>
        <IconSettings size={18}/>
        <Text size="sm" weight={700} ml={10}>{author.name}</Text>
      </Center>
      <Text className={classes.body} size="sm">
        {body.slice(0,100)}
      </Text>
    </Paper>
  );
}