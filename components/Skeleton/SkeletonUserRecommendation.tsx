import { Card, Grid, Skeleton } from '@mantine/core';

const SkeletonUserRecommendationCard = () => {
  return (
    <Card radius={'lg'} withBorder>
      {[1, 2, 3, 4, 5].map((index) => (
        <Grid align={'center'} key={index}>
          <Grid.Col span={2}>
            <Skeleton height={40} circle />
          </Grid.Col>

          <Grid.Col span={7}>
            <Skeleton height={8} width="40%" radius="xl" />
          </Grid.Col>

          <Grid.Col span={3}>
            <Skeleton height={30} width="100%" mt={6} radius="xl" />
          </Grid.Col>
        </Grid>
      ))}
    </Card>
  );
};

export default SkeletonUserRecommendationCard;
