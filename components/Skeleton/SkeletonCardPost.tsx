import { useState } from 'react';
import { Skeleton, Grid, Card, Stack } from '@mantine/core';

function SkeletonCardPost() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Card
        sx={() => ({
          width: 500,
          '@media (max-width: 650px)': {
            width: '100%',
          },
        })}
        p={10}
        radius={'lg'}
        withBorder
      >
        <Stack spacing={0}>
          {/* Header */}
          <Grid align={'center'} justify="flex-start" mb={10}>
            <Grid.Col span={'content'}>
              <Skeleton height={30} circle />
            </Grid.Col>

            <Grid.Col span={10}>
              <Skeleton height={8} width="30%" radius="xl" visible={loading} />
            </Grid.Col>
          </Grid>

          <Card.Section mt={0}>
            <Skeleton height={300} radius="sm" />
          </Card.Section>

          <Stack spacing={5}>
            <Skeleton height={10} width="30%" mt={5} radius={'sm'} visible={loading} />
            <Skeleton height={5} width="20%" visible={loading} />
            <Skeleton height={20} radius="sm" visible={loading} />
            <Skeleton height={30} radius="md" visible={loading} />
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

export default SkeletonCardPost;
