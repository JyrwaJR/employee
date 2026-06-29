import { SectionHeader } from '@components/base';
import { Container, StackHeader } from '@components/layout';
import { View } from 'react-native';

export const CreateLeaveScreen = () => {
  return (
    <Container className="flex-1">
      <StackHeader />
      <View className="mt-4 px-4">
        <SectionHeader title="Create Leave" />
      </View>
    </Container>
  );
};
