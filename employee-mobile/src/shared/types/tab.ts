import { MaterialIcons } from '@expo/vector-icons';

export type TabRouteT = {
  name: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};
