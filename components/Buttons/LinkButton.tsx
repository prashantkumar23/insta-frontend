import { Button } from "@mantine/core";
import { NextLink } from "@mantine/next";

interface LinkButtonProps {
  text: string;
  href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ text, href }) => {
  return (
    <Button
      variant="subtle"
      component={NextLink}
      href={href}
      styles={(theme) => ({
        root: {
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      })}
    >
      {text}
    </Button>
  );
};

export default LinkButton;
