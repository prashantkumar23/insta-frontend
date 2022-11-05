import { Avatar, Button, Card, Group, Text, Stack } from '@mantine/core';
import useFollow from '../../hooks/user/useFollow';
import useUnfollow from '../../hooks/user/useUnfollow';

interface UserRecommendationCardProps {
  myId: string;
  userId: string;
  username: string;
  pic: string;
  name: string;
  followedByMe: boolean;
}

const UserRecommendationCard: React.FC<UserRecommendationCardProps> = ({
  myId,
  userId,
  username,
  name,
  pic,
  followedByMe,
}) => {
  const { mutate: followMutate } = useFollow({ username: myId, whoToFollow: userId });
  const { mutate: unfollowMutate } = useUnfollow({ username: myId, whoToUnfollow: userId });

  return (
    <Card radius={'md'} style={{ width: '100%', backgroundColor: 'transparent' }} p={3}>
      <Group position="apart">
        <Group position="left" spacing={10}>
          <Avatar src={pic} radius="xl" />
          <Stack spacing={1}>
            <Text weight={400} style={{ fontSize: '0.8rem' }}>
              {name}
            </Text>
            <Text color="dimmed" style={{ fontSize: '0.6rem' }}>
              {username}
            </Text>
          </Stack>
        </Group>

        {followedByMe ? (
          <Button size="sm" radius={'lg'} onClick={() => unfollowMutate()}>
            Unfollow
          </Button>
        ) : (
          <Button size="sm" radius={'lg'} onClick={() => followMutate()}>
            Follow
          </Button>
        )}
      </Group>
    </Card>
  );
};

export default UserRecommendationCard;
