import { Card, Group, Avatar, Button, Text } from '@mantine/core';
import { useRouter } from 'next/router';

interface IProfileCard {
  username: string;
  pic: string;
}

const ProfileCard: React.FC<IProfileCard> = ({ username, pic }) => {
  const router = useRouter();

  return (
    <Card radius={'lg'} withBorder>
      <Group position="apart">
        <Group>
          <Avatar src={pic} radius="xl" />
          <Text size="xs">{username}</Text>
        </Group>
        <Button
          compact
          size="xs"
          sx={{ '&:hover': { backgroundColor: 'transparent' } }}
          variant="subtle"
          onClick={() => router.push('/me')}
        >
          View
        </Button>
      </Group>
    </Card>
  );
};

export default ProfileCard;
