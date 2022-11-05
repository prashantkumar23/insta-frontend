import { Button } from '@mantine/core';
import { NextLink } from '@mantine/next';

interface SimpleButtonProps {
  text: string;
}

// https://colorhunt.co/palette/3a3845f7ccacc69b7b826f66

const SimpleButton: React.FC<SimpleButtonProps> = ({ text }) => {
  return (
    <Button
      variant="subtle"
      radius={'xl'}
      styles={(theme) => ({
        root: {
          borderWidth: '0.1px',
          borderColor: 'lightgray',
          paddingTop: 10,
          paddingBottom: 10,
          color: '#F7CCAC',
          height: 50,
          background: '#3A3845',
          width: '70%',
          '&:hover': {
            backgroundColor: '#3A3845',
          },
        },
      })}
    >
      {text}
    </Button>
  );
};

export default SimpleButton;
