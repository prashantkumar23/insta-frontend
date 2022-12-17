import { useEffect, useState } from 'react';
import { Button, Input, Modal, Stack, Image } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { isError, useQueryClient } from '@tanstack/react-query';

import { User } from '../hooks/auth/useGetUserDetail';
import useUpdateProfileImage from '../hooks/user/useUpdateProfileImage';

interface ICreatePostDialog {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  user: User;
}

const UploadProfileImage = ({ opened, setOpened, user }: ICreatePostDialog) => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<any>(null);
  const queryClient = useQueryClient();

  const { mutate, isLoading, data, isError } = useUpdateProfileImage({
    userId: user.id,
    username: user.username,
    file: selectedFile!,
  });

  useEffect(() => {
    if (data && data.isSuccess) {
      queryClient.refetchQueries(['getUserDetail']);
      showNotification({
        message: data!.message,
        radius: 'sm',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
      setOpened(false);
      setPreview(null);
    }

    if(isError) {
        showNotification({
          message: "Something went wrong!",
          radius: 'sm',
          color: 'red',
          icon: <IconX size={18} />,
        });
        setOpened(false);
        setPreview(null);
    }
  }, [isLoading]);

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
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
        setPreview(null);
      }}
      centered
      radius={'xl'}
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus
    >
      <Stack>
        <Input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          radius="xl"
          disabled={isLoading}
          style={{ backgroundColor: 'transparent', borderColor: 'blue', outline: 'none' }}
        />
        {selectedFile && (
          <div style={{ borderRadius: '50%' }}>
            <Image src={preview} radius={'xl'} style={{ borderRadius: '50%' }} />
          </div>
        )}
        <Button radius={'xl'} onClick={() => mutate()} disabled={!preview || isLoading}>
          Upload
        </Button>
      </Stack>
    </Modal>
  );
};

export default UploadProfileImage;
