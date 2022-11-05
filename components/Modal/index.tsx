import { Modal, List, Avatar } from "@mantine/core";

interface ModalComponentProps {
  title: string;
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  title,
  opened,
  setOpened,
}) => {
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
        centered
        overflow="inside"
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
        size="xs"
      >
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <Avatar
              radius={50}
              src={
                "https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small/beautiful-woman-avatar-character-icon-free-vector.jpg"
              }
            >
              P
            </Avatar>
          }
        >
          {Array.from(Array(50).keys()).map((index) => {
            return <List.Item key={index}>Veronica</List.Item>;
          })}
        </List>
      </Modal>
    </>
  );
};

export default ModalComponent;
