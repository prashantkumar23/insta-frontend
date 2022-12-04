import {
  Avatar,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Image,
  ActionIcon,
  TextInput,
  Divider,
} from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PostCard, { ReadMoreOrLess } from '../../components/Cards/PostCard';
import getUserDetail, { IGetUserDetail } from '../../hooks/auth/useGetUserDetail';
import useGetPost, {
  IGetPostInDetailServerResponse,
  SpecificPost,
} from '../../hooks/post/useGetPost';
import AppLayout from '../../layout/AppLayout';
import { getToken } from '../../utility/gettoken';
import useDeleteComment from '../../hooks/comment/useDeleteComment';
import { flushSync } from 'react-dom';
import {
  IconArrowUpRight,
  IconCheck,
  IconDots,
  IconHeart,
  IconMessage2,
  IconSend,
} from '@tabler/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import useLikePost from '../../hooks/post/useLikePost';
import useUnlikePost from '../../hooks/post/useUnlikePost';
import getPostInDetails from '../../hooks/post/useGetPost';
import { showNotification } from '@mantine/notifications';
import useCreateComment from '../../hooks/comment/useCreateComment';
dayjs.extend(relativeTime);

const PostPage: NextPage = (props) => {
  const router = useRouter();
  const { postId } = router.query;
  const [PostData, setPostData] = useState<SpecificPost | undefined>(undefined);
  const [comment, setComment] = useState('');
  const [commentIdToBeDeleted, setCommentIdToBeDeleted] = useState('');
  const { mutate: deleteMutation } = useDeleteComment({
    commentId: commentIdToBeDeleted,
    postId: postId as string,
  });

  useEffect(() => {
    //@ts-ignore
    if (props.post) {
      //@ts-ignore
      setPostData(JSON.parse(props.post).post);
    }
  }, [props]);

  //@ts-ignore
  const { mutate: likePost, data: likeData } = useLikePost({
    postId: PostData ? PostData._id : '',
    //@ts-ignore
    userId: props.user.id,
  });
  //@ts-ignore
  const { mutate: unlikePost, data: unlikeData } = useUnlikePost({
    postId: PostData ? PostData._id : '',
    //@ts-ignore
    userId: props.user.id,
  });

  const {
    mutate: commentPost,
    data: commentData,
    isSuccess: commentDataIsSuccess,
    isLoading,
  } = useCreateComment({
    comment,
    postId: PostData ? PostData._id : '',
    //@ts-ignore
    whoCommented: props.user.id,
    wasLikeByMe: false,
  });

  useEffect(() => {
    if (commentDataIsSuccess && commentData.comment) {
      setComment('');
      showNotification({
        message: 'Comment posted',
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }
  }, [commentDataIsSuccess]);

  // const onImgLoad = ({ target: img }) => {
  //   console.log("Image h and w", img)
  //   let imgHeights = {};

  //       let imgS = new Image();
  //       imgS.src = img.src;
  //       img.onload = () => imgHeights[imgUrl] = img.height;
  //   })
  // };

  if (true) {
    return (
      //@ts-ignore
      <AppLayout user={props.user}>
        {PostData && (
          <Center style={{ alignItems: 'center' }}>
            <Paper
              sx={(theme) => ({
                width: '60%',
                '@media (max-width: 700px)': {
                  width: '100%',
                },
              })}
              withBorder
              radius={'lg'}
              p={15}
            >
              <Stack spacing={5}>
                {/* Header */}
                <Group position="apart" mb={5}>
                  <Group m={0} spacing={9}>
                    <Avatar src={PostData?.userId.pic} radius="xl" size={'sm'} />
                    <Text weight={600} size={13}>
                      {PostData?.userId.username}
                    </Text>
                  </Group>
                </Group>

                <Card.Section
                  mt={0}
                  // style={{ height: "50vh", width: "100%" }}
                >
                  <Image
                    src={'https://d7cbio25mx5nv.cloudfront.net/' + PostData!.imageUrl.split('/')[3]}
                    alt="No image"
                    radius="md"
                    style={
                      {
                        // maxWidth: "100%",
                        // maxHeight: "100%"
                      }
                    }
                  />
                </Card.Section>

                <Grid mb={0}>
                  <Grid.Col span={'content'} pl={0}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        columnGap: 1,
                        width: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <ActionIcon
                        onClick={() => {
                          if (PostData!.wasLikeByMe) {
                            // unlikePost(PostData);
                          } else {
                            // likePost(PostData);
                          }
                        }}
                      >
                        <IconHeart
                          size={16}
                          fill={`${PostData!.wasLikeByMe ? 'red' : 'white'}`}
                          stroke={'1px'}
                          style={{
                            color: PostData!.wasLikeByMe ? 'red' : 'black',
                          }}
                        />
                      </ActionIcon>

                      <Text color="dimmed" size={10}>
                        {PostData?.likes} Likes
                      </Text>
                    </div>
                  </Grid.Col>

                  <Grid.Col span={'content'}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        columnGap: 1,
                        width: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <ActionIcon>
                        <IconMessage2 size={16} stroke={'1px'} />
                      </ActionIcon>

                      <Text color="dimmed" size={10}>
                        {PostData?.comments} Comments
                      </Text>
                    </div>
                  </Grid.Col>
                </Grid>

                <Text color="dimmed" size={10} m={0} p={0}>
                  {dayjs(PostData.createdAt).fromNow()}
                </Text>

                {/* Caption */}
                <ReadMoreOrLess limit={150} text={PostData.caption} postId={PostData._id} />

                {/* Comment Box */}
                <TextInput
                  radius="xl"
                  size="xs"
                  mt={0}
                  maxLength={100}
                  onKeyDown={(e) => (e.key === 'Enter' ? commentPost() : undefined)}
                  rightSection={
                    <Button
                      mr={20}
                      compact
                      size="xs"
                      variant="subtle"
                      sx={{
                        '&:hover': { backgroundColor: 'transparent' },
                        backgroundColor: 'transparent',
                        '&:disabled': { backgroundColor: 'transparent' },
                      }}
                      onClick={() => commentPost()}
                      disabled={isLoading || comment.trim().length === 0}
                    >
                      Post
                    </Button>
                  }
                     //@ts-ignore
                  placeholder={`comment as ${props.user.username}`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <div>
                  {/* {PostData.commentIds.length === 0 && (
                      <div style={{ backgroundColor: 'lightpink', height: '100%' }}>
                        <Text size="xs" color={'gray'} fs="italic" align="center">
                          No one is commented so far
                        </Text>
                      </div>
                    )} */}
                  {PostData.commentIds.length > 0 && (
                    <ScrollArea style={{ height: '50vh' }} offsetScrollbars scrollbarSize={6}>
                      {PostData.commentIds.length > 0 &&
                        PostData.commentIds.map(
                          ({ _id, comment, whoCommented: { username, _id: userId, pic } }) => (
                            <Stack key={_id} spacing={6} mb={10} pr={10} pt={10}>
                              <Group position="apart">
                                <Group spacing={8}>
                                  <Avatar src={pic} size={20} radius="xl" />
                                  <Text size={'xs'}>{username}</Text>
                                  <Text size="xs" fw={'600'}>
                                    {comment}
                                  </Text>
                                </Group>
                                <ActionIcon
                                // onClick={() => {
                                //   if (PostData!.wasLikeByMe) {
                                //     // unlikePost(PostData);
                                //   } else {
                                //     // likePost(PostData);
                                //   }
                                // }}
                                >
                                  <IconHeart
                                    size={16}
                                    // fill={`${PostData!.wasLikeByMe ? 'red' : 'white'}`}
                                    stroke={'1px'}
                                    // style={{
                                    //   color: PostData!.wasLikeByMe ? 'red' : 'black',
                                    // }}
                                  />
                                </ActionIcon>
                              </Group>

                              <Text color="dimmed" size={10} ml={25}>
                                {PostData?.likes} Likes
                              </Text>
                            </Stack>
                          )
                        )}
                    </ScrollArea>
                  )}
                </div>
              </Stack>
            </Paper>
          </Center>
        )}
      </AppLayout>
    );
  }
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const session = await queryClient.fetchQuery<IGetUserDetail>(['getUserDetail'], async () =>
    getUserDetail(getToken(context))
  );

  if (!session.isAuth) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  let postId: string = '';
  if (context.params) {
    postId = context.params.postId as string;
  }

  const fetchedUser = queryClient.getQueryData<IGetUserDetail>(['getUserDetail']);
  const fetchedPost = await queryClient.fetchQuery<IGetPostInDetailServerResponse>(
    ['getPost', postId],
    async () => getPostInDetails({ postId, user: fetchedUser!, token: getToken(context) })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      user: fetchedUser!.user,
      post: fetchedPost.isSuccess ? JSON.stringify(fetchedPost) : null,
    },
  };
}

export default PostPage;
