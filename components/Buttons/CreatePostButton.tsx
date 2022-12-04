import { Button, ButtonProps } from '@mantine/core';
import { Icon123, IconPlus } from '@tabler/icons';

const CreatePostButton = (props: ButtonProps & React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      styles={(theme) => ({
        root: {
          backgroundImage: 'linear-gradient(to right, #FF8008 0%, #FFC837  51%, #FF8008  100%)',
          textAlign: 'center',
          transition: '0.5s',
          backgroundSize: '200% auto',
          color: 'white',
          // boxShadow: '0 0 20px #eee',
          borderRadius: '10px',

          '&:hover': {
            backgroundPosition: 'right center',
            color: '#fff',
            textDecoration: 'none',
          },
        },
      })}
      {...props}
    >
        <IconPlus size={15}/>
    </Button>
  );
};


export default CreatePostButton