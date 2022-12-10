import { Card, Skeleton } from '@mantine/core';

const SkeletonFeedCard = () => {
  return (
    <Card radius={'xs'} m={5} p={0}>
      <Skeleton height={300} visible />
    </Card>
  );
};

export default SkeletonFeedCard;
