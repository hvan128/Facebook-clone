import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { ChatNavigationName } from 'src/common/constants/nameScreen';
import WraperScreen from 'src/components/WraperScreen';
import { InboxScreen } from 'src/screens/chattab';
import { InboxListScreen } from 'src/screens/chattab';

const Stack = createNativeStackNavigator();

function ChatNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }}
    >
      <Stack.Screen
        name={ChatNavigationName.InboxScreen}
        options={{ headerShown: false }}
        component={InboxScreen}
      />
      <Stack.Screen
        name={ChatNavigationName.InboxListScreen}
        options={{ headerShown: false }}
        component={InboxListScreen}
      />
    </Stack.Navigator>
  );
}

const ChatNavigationWrapper = () => (
  <WraperScreen paddingBottom={0} paddingHorizontal={0}>
    <ChatNavigation />
  </WraperScreen>
);

export default ChatNavigationWrapper;
