import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Space,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconBookmark,
  IconDots,
  IconHeart,
  IconMessage,
  IconMessage2,
  IconSend,
} from '@tabler/icons';
import dayjs from 'dayjs';
import { useState } from 'react';
import { User } from '../../hooks/auth/useGetUserDetail';
import useCreateComment from '../../hooks/comment/useCreateComment';
import { FeedPost } from '../../hooks/post/useGetFeedPost';
import useLikePost from '../../hooks/post/useLikePost';
import relativeTime from 'dayjs/plugin/relativeTime';
import useUnlikePost from '../../hooks/post/useUnlikePost';
import useGetPost from '../../hooks/post/useGetPost';
import { useRouter } from 'next/router';
dayjs.extend(relativeTime);

export interface IPostCard {
  postId: string;
  post: FeedPost;
  me: User;
}

const PostCard: React.FC<IPostCard> = ({ post, me }) => {
  const { id, imageUrl, createdAt, caption, likes, comments, user } = post;
  // console.log('Image Url', imageUrl);
  const router = useRouter();
  const [value, onChange] = useState('');
  const [comment, setComment] = useState('');
  const [showMoreCaption, setShowMoreCaption] = useState(true);

  const { mutate: likePost, data: likeData } = useLikePost({ postId: id, userId: me.id });
  const { mutate: unlikePost, data: unlikeData } = useUnlikePost({ postId: id, userId: me.id });
  const { mutate: commentPost, data: commentData } = useCreateComment({
    comment,
    postId: id,
    whoCommented: me.id,
    wasLikeByMe: false,
  });

  return (
    <Card radius={'lg'} withBorder style={{ maxWidth: '500px' }}>
      <Stack>
        {/* Header */}
        <Group position="apart">
          <Group m={0} spacing={9}>
            <Avatar src={user.pic} radius="xl" size={'sm'} />
            <Text weight={600} size={13}>
              {user.username}
            </Text>
          </Group>

          <IconDots size={22} />
        </Group>

        {/* Pics */}
        <Card.Section mt={0} style={{ objectFit: 'cover', overflow: 'hidden' }}>
          <Image
            src={imageUrl}
            // src={"https://images.unsplash.com/photo-1509043759401-136742328bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"}
            alt="No image"
          />
        </Card.Section>

        {/* Statitics  */}
        <Grid>
          <Grid.Col span={4}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                columnGap: 2,
                width: '100%',
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
                  size={22}
                  fill={`${post.wasLikeByMe ? 'red' : 'white'}`}
                  stroke={'1px'}
                  style={{
                    color: post.wasLikeByMe ? 'red' : 'black',
                  }}
                />
              </ActionIcon>

              <Text color="dimmed" size={13}>
                {likes} Likes
              </Text>
            </div>
          </Grid.Col>

          <Grid.Col span={4}>
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
                <IconMessage2 size={22} stroke={'1px'} />
              </ActionIcon>

              <Text color="dimmed" size={13}>
                {comments} Comments
              </Text>
            </div>
          </Grid.Col>

          <Grid.Col span={4}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                columnGap: 2,
                width: '100%',
                paddingRight: 20,
                cursor: 'pointer',
              }}
            >
              <ActionIcon>
                <IconSend size={20} stroke={'1px'} />
              </ActionIcon>

              <Text color="dimmed" size={13}>
                Send
              </Text>
            </div>
          </Grid.Col>
        </Grid>

        <Text color="dimmed" size={10} m={0} p={0}>
          {dayjs(createdAt).fromNow()}
        </Text>

        {/* Caption */}
        <Text lineClamp={showMoreCaption ? 2 : undefined} size={13}>
          {caption}
        </Text>

        {/* <Button onClick={() => setShowMoreCaption(!showMoreCaption)} size="sm" variant="subtle">
          {showMoreCaption ? 'More' : 'Less'}
        </Button> */}

        {/* <RichTextEditor
          ref={editorRef}
          value={` Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum dolores unde fuga ipsa rem
          hic laboriosam a necessitatibus, id, aperiam eos, praesentium in sequi sunt sint. Unde
          neque molestias animi. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo
          distinctio ipsam hic voluptas quis, sit repellendus possimus, tempora deserunt amet,
          inventore eos recusandae dolores officia explicabo. Tempore odit doloremque architecto!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam quibusdam libero ipsa maiores
          dolorem officiis? Ratione in modi ex, nostrum voluptate similique, minima maiores
          laboriosam, magnam hic molestias eos omnis.`}
          onChange={onChange}
          readOnly
        /> */}

        {/* Comment Section */}
        <Grid>
          <Grid.Col span={2}>
            <Avatar src={me.pic} radius={'xl'} />
          </Grid.Col>

          <Grid.Col span={10}>
            <TextInput
              radius="xl"
              rightSection={
                <IconArrowUpRight
                  size={20}
                  onClick={() =>
                    commentPost({
                      userComment: {
                        _id: "",
                        comment,
                        whoCommented: {
                          name: me.name,
                          pic: me.pic,
                          username: me.username,
                          _id: me.id,
                        },
                      },
                      postId: post.id,
                      route: router.pathname,
                    })
                  }
                />
              }
              placeholder={'Have a thought on this post?'}
              style={{ width: '100%' }}
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
