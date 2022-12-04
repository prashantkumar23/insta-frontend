import { Avatar, Button, Card, Group, Text, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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
  const { mutate: followMutate, isSuccess: followIsSuccess } = useFollow({
    username: myId,
    whoToFollow: userId,
  });
  const { mutate: unfollowMutate, isSuccess: unfollowIsSuccess } = useUnfollow({
    username: myId,
    whoToUnfollow: userId,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (followIsSuccess) {
      queryClient.invalidateQueries(['getUserRecommendation']);
      showNotification({
        message: `You are now following ${userId}`,
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }
  }, [followIsSuccess]);

  useEffect(() => {
    if (unfollowIsSuccess) {
      queryClient.invalidateQueries(['getUserRecommendation']);
      showNotification({
        message: `Unfollowed ${userId}`,
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }
  }, [unfollowIsSuccess]);

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
