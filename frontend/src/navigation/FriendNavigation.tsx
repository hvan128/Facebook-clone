import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { FriendNavigationName } from 'src/common/constants/nameScreen';
import { HeaderWithSearch } from 'src/components/BaseHeader';
import WraperScreen from 'src/components/WraperScreen';
import AllFriendScreen from 'src/screens/tab-bar/FriendTab/AllFriendScreen';
import SuggestionsScreen from 'src/screens/tab-bar/FriendTab/SuggestionsScreen';

const Stack = createNativeStackNavigator();

const FriendNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }}
    >
      <Stack.Screen
        name={FriendNavigationName.SuggestionsScreen}
        component={SuggestionsScreen}
        options={{
          headerShown: true,
          header: () => <HeaderWithSearch title='Gợi ý' titleIsCenter={false} />
        }}
      />
      <Stack.Screen
        name={FriendNavigationName.AllFriendScreen}
        component={AllFriendScreen}
        options={{
          headerShown: true,
          header: () => <HeaderWithSearch title='Bạn bè' titleIsCenter={false} />
        }}
      />
    </Stack.Navigator>
  );
};
const FriendNavigationWrapper = () => (
  <WraperScreen paddingBottom={0} paddingHorizontal={0}>
    <FriendNavigation />
  </WraperScreen>
);
export default FriendNavigationWrapper;
