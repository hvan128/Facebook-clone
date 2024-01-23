import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { color } from 'src/common/constants/color';
import EmojiTab from './EmojiTab';
import ActionTab from './ActionTab';

const Tab = createMaterialTopTabNavigator();

function TopTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: color.primary,
        tabBarPressColor: color.borderColor
      }}
    >
      <Tab.Screen
        name='EmojiTab'
        component={EmojiTab}
        options={{ tabBarLabel: 'Cảm xúc', tabBarLabelStyle: { fontWeight: 'bold' } }}
      />

      <Tab.Screen
        name='ActionTab'
        component={ActionTab}
        options={{ tabBarLabel: 'Hành động', tabBarLabelStyle: { fontWeight: 'bold' } }}
      />
    </Tab.Navigator>
  );
}

export default TopTab;
