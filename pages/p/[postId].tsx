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
} from '@mantine/core';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PostCard from '../../components/Cards/PostCard';
import getUserDetail, { IGetUserDetail } from '../../hooks/auth/useGetUserDetail';
import useGetPost from '../../hooks/post/useGetPost';
import AppLayout from '../../layout/AppLayout';
import { getToken } from '../../utility/gettoken';
import useDeleteComment from '../../hooks/comment/useDeleteComment';
import { flushSync } from 'react-dom';
import { IconDots, IconHeart, IconMessage2, IconSend } from '@tabler/icons';
import useLikePost from '../../hooks/post/useLikePost';
import useUnlikePost from '../../hooks/post/useUnlikePost';

const PostPage: NextPage = (props) => {
  const router = useRouter();
  const { postId } = router.query;
  const [commentIdToBeDeleted, setCommentIdToBeDeleted] = useState('');
  const { mutate: deleteMutation } = useDeleteComment({
    commentId: commentIdToBeDeleted,
    postId: postId as string,
  });
  const { data: PostData, refetch } = useGetPost({
    //@ts-ignore
    userId: props.user.id,
    postId: postId as string,
  });
  const { mutate: likePost, data: likeData } = useLikePost({ postId: PostData!._id, userId: props.user.id });
  const { mutate: unlikePost, data: unlikeData } = useUnlikePost({ postId: PostData!._id, userId: props.user.id });



  useEffect(() => {
    refetch();
  }, []);

  if (true) {
    return (
      <AppLayout user={props.user}>
        <Center>
          <Paper style={{ width: '80%', height: '60vh' }} withBorder radius={'lg'} p={15}>
            <Grid>
              <Grid.Col span={6}>
                <Stack>
                  <Group position="apart">
                    <Group m={0} spacing={9}>
                      <Avatar src={PostData?.userId.pic} radius="xl" size={'sm'} />
                      <Text weight={600} size={13}>
                        {PostData?.userId.username}
                      </Text>

                      <IconDots size={22} />
                    </Group>
                  </Group>
                  <Card.Section mt={0} style={{ objectFit: 'cover', overflow: 'hidden' }}>
                    <Image
                      src={
                        'https://d7cbio25mx5nv.cloudfront.net/' + PostData!.imageUrl.split('/')[3]
                      }
                      // src={"https://images.unsplash.com/photo-1509043759401-136742328bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"}
                      alt="No image"
                    />
                  </Card.Section>

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
                            if (PostData!.wasLikeByMe) {
                              unlikePost(PostData);
                            } else {
                              likePost(PostData);
                            }
                          }}
                        >
                          <IconHeart
                            size={22}
                            fill={`${PostData!.wasLikeByMe ? 'red' : 'white'}`}
                            stroke={'1px'}
                            style={{
                              color: PostData!.wasLikeByMe ? 'red' : 'black',
                            }}
                          />
                        </ActionIcon>

                        <Text color="dimmed" size={13}>
                          {PostData?.likes} Likes
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
                        onClick={() => router.push(`/p/${PostData!._id}`)}
                      >
                        <ActionIcon>
                          <IconMessage2 size={22} stroke={'1px'} />
                        </ActionIcon>

                        <Text color="dimmed" size={13}>
                          {PostData?.comments} Comments
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

                </Stack>
              </Grid.Col>
              <Grid.Col span={6}> Hello</Grid.Col>
            </Grid>
          </Paper>
        </Center>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={props.user}>
      <Grid>
        <Grid.Col span={6}>
          {PostData && (
            <PostCard
              me={props.user}
              post={{
                id: PostData._id,
                imageUrl: 'https://d7cbio25mx5nv.cloudfront.net/' + PostData.imageUrl.split('/')[3],
                caption: PostData.caption,
                likes: PostData.likes,
                comments: PostData.comments,
                createdAt: PostData.createdAt,
                wasLikeByMe: PostData.wasLikeByMe,
                user: {
                  id: PostData.userId._id,
                  name: PostData.userId.name,
                  username: PostData.userId.username,
                  pic: PostData.userId.pic,
                },
              }}
              postId={PostData._id}
            />
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          {PostData && (
            <Container>
              <Card>
                <ScrollArea>
                  {PostData.commentIds.map((c) => {
                    return (
                      <Card radius={'xl'} pb={0}>
                        <Stack>
                          <Group spacing={9} align="center" pb={0}>
                            <Avatar src={c.whoCommented.pic} radius="xl" size="sm" />
                            <Text size={13}>{c.whoCommented.username}</Text>
                          </Group>

                          <Text size={13} ml={30} mt={0} pt={0}>
                            {c.comment}
                          </Text>
                        </Stack>

                        <Button
                          onClick={() => {
                            flushSync(() => setCommentIdToBeDeleted(c._id));
                            if (commentIdToBeDeleted.length > 0) {
                              deleteMutation({
                                commentId: c._id,
                                postId,
                              });
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Card>
                    );
                  })}
                </ScrollArea>
              </Card>
            </Container>
          )}
        </Grid.Col>
      </Grid>
    </AppLayout>
  );
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

  const fetchedUser = queryClient.getQueryData<IGetUserDetail>(['getUserDetail']);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      user: fetchedUser!.user,
    },
  };
}

export default PostPage;
