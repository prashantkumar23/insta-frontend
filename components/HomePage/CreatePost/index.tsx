import { Button, Input, Modal, Stack, Image, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { Heart } from 'tabler-icons-react';
import { User } from '../../../hooks/auth/useGetUserDetail';
import useCreatePost from '../../../hooks/post/useCreatePost';

interface ICreatePostDialog {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  user: User;
}

const CreatePost = ({ opened, setOpened, user }: ICreatePostDialog) => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<any>(null);
  const [caption, setCaption] = useState('');

  const { mutate, isLoading, data, isSuccess } = useCreatePost({
    userId: user.id,
    username: user.username,
    file: selectedFile!,
    caption,
  });

  useEffect(() => {
    if (data && data.isSuccess) {
      showNotification({
        message: data!.message,
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
      setOpened(false);
      setCaption('');
      setPreview(null);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl!);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  return (
    <Modal opened={opened} onClose={() => {
      setOpened(false)
      setCaption("")
      setPreview(null);
    }} centered radius={'xl'} closeOnClickOutside={false} closeOnEscape={false} trapFocus>
      <Stack>
        <Input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          radius="xl"
          style={{ backgroundColor: 'transparent', borderColor: 'blue', outline: "none" }}
          disabled={isLoading}
        />
        {selectedFile && <Image src={preview} />}
        <Textarea
          value={caption}
          onChange={(e: any) => setCaption(e.target.value)}
          radius={'md'}
          minRows={2}
          maxRows={8}
          disabled={isLoading}
          maxLength={2200}
          placeholder="Your caption..."
        />
        <Button radius={'xl'} onClick={() => mutate()} disabled={isLoading || (caption.length === 0 || !preview)}>
          Post
        </Button>
      </Stack>
    </Modal>
  );
};

export default CreatePost;
