import { useEffect, useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconCheck,
  IconHeart,
  IconMessage2,
} from '@tabler/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';


import { User } from '../../hooks/auth/useGetUserDetail';
import { FeedPost } from '../../hooks/post/useGetFeedPost';
import relativeTime from 'dayjs/plugin/relativeTime';
import useCreateCommentOnFeedPage from '../../hooks/comment/createComment/useCreateCommentOnFeedPage';
import useLikeOnFeed from '../../hooks/post/useLike/useLikeOnFeed';
import useUnlikeOnFeed from '../../hooks/post/useUnlike/useUnlikeOnFeed';
dayjs.extend(relativeTime);

export interface IPostCard {
  postId: string;
  post: FeedPost;
  me: User;
}

export const ReadMoreOrLess = ({
  limit,
  text,
  postId,
}: {
  limit: number;
  text: string;
  postId: string;
}) => {
  const [isReadMoreShown, setIsReadMoreShown] = useState(false);
  const router = useRouter();

  const toggleBtn = () => {
    console.log(router.pathname);
    if (router.pathname.includes('/p')) {
      setIsReadMoreShown((prevState) => !prevState);
      return;
    }
    router.push(`/p/${postId}`);
  };

  return (
    <span className="read-more-read-less">
      {text.length > 100 ? (
        <>
          <Text size={'xs'} style={{ display: 'inline' }}>
            {isReadMoreShown ? text : text.substring(0, limit)}
          </Text>
          <Button
            onClick={toggleBtn}
            compact
            size="xs"
            variant="subtle"
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
              },
              color: 'GrayText',
            }}
          >
            {isReadMoreShown ? 'read less' : 'read more'}
          </Button>
        </>
      ) : (
        <Text size="xs" style={{ display: 'inline' }}>
          {text}
        </Text>
      )}
    </span>
  );
};

const PostCard: React.FC<IPostCard> = ({ post, me }) => {
  const { id, imageUrl, createdAt, caption, likes, comments, user } = post;
  const router = useRouter();
  const [comment, setComment] = useState('');

  const { mutate: likePost, data: likeData } = useLikeOnFeed({ postId: id, userId: me.id });
  const { mutate: unlikePost, data: unlikeData } = useUnlikeOnFeed({ postId: id, userId: me.id });

  const {
    mutate: commentPostOnFeed,
    data: commentDataOnFeed,
    isSuccess: commentDataIsSuccessOnFeed,
    isLoading: commentIsLoadingOnFeed,
  } = useCreateCommentOnFeedPage({
    comment,
    postId: id,
    whoCommented: me.id,
    wasLikeByMe: false,
  });

  useEffect(() => {
    if (commentDataIsSuccessOnFeed && commentDataOnFeed.comment) {
      showNotification({
        message: 'Comment posted',
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }
  }, [commentDataIsSuccessOnFeed]);

  return (
    <Card
      radius={'lg'}
      withBorder
      sx={() => ({
        width: 500,
        '@media (max-width: 650px)': {
          width: '100%',
        },
      })}
    >
      <Stack>
        {/* Header */}
        <Group position="apart">
          <Group m={0} spacing={9}>
            <Avatar src={user.pic} radius="xl" size={'sm'} />
            <Text weight={600} size={13}
            //  onClick={() => router.push(`/${user.id}`)} sx={{cursor: "pointer"}}
             >
              {user.username}
            </Text>
          </Group>

          {/* <IconDots size={22} /> */}
        </Group>

        {/* Pics */}
        <Card.Section mt={0} style={{ objectFit: 'cover', overflow: 'hidden' }}>
          <Image src={imageUrl} alt="No image" />
        </Card.Section>

        {/* Statitics  */}
        <Grid>
          <Grid.Col span={'content'} pl={0}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                columnGap: 2,
                cursor: 'pointer',
              }}
            >
              <ActionIcon
                onClick={() => {
                  if (post.wasLikeByMe) {
                    unlikePost(post);
                  } else {
                    likePost(post);
                  }
                }}
              >
                <IconHeart
                  size={20}
                  fill={`${post.wasLikeByMe ? 'red' : 'white'}`}
                  stroke={'1px'}
                  style={{
                    color: post.wasLikeByMe ? 'red' : 'black',
                  }}
                />
              </ActionIcon>

              <Text color="dimmed" size={12}>
                {likes} Likes
              </Text>
            </div>
          </Grid.Col>

          <Grid.Col span={'content'}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 2,
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={() => router.push(`/p/${post.id}`)}
            >
              <ActionIcon>
                <IconMessage2 size={20} stroke={'1px'} />
              </ActionIcon>

              <Text color="dimmed" size={12}>
                {comments} Comments
              </Text>
            </div>
          </Grid.Col>
        </Grid>

        <Text color="dimmed" size={10} m={0} p={0}>
          {dayjs(createdAt).fromNow()}
        </Text>

        {/* Caption */}
        <ReadMoreOrLess limit={170} text={caption} postId={post.id} />

        {/* Comment Section */}
        <Grid>
          <Grid.Col span={'content'}>
            <Avatar src={me.pic} radius={'xl'} size={30} />
          </Grid.Col>

          <Grid.Col span={'auto'}>
            <TextInput
              radius="lg"
              size="xs"
              maxLength={200}
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  setComment("")
                  commentPostOnFeed(post)
                }
              }}
              rightSection={
                <Button
                  mr={20}
                  ml={10}
                  compact
                  size="xs"
                  variant="subtle"
                  sx={{
                    '&:hover': { backgroundColor: 'transparent' },
                    backgroundColor: 'transparent',
                    '&:disabled': { backgroundColor: 'transparent' },
                  }}
                  onClick={() => {
                    commentPostOnFeed(post);
                    setComment('');
                  }}
                  disabled={commentIsLoadingOnFeed || comment.trim().length === 0}
                >
                  Post
                </Button>
              }
              placeholder={`comment as ${me.username}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Card>
  );
};

export default PostCard;
