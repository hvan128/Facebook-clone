import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { AddMoneyNavigationName } from 'src/common/constants/nameScreen';
import WraperScreen from 'src/components/WraperScreen';
import AddMoneyScreen from 'src/screens/add-money/AddMoneyScreen';

const Stack = createNativeStackNavigator();

function AddMoneyNavigation() {
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
      <Stack.Screen name={AddMoneyNavigationName.AddMoneyScreen} component={AddMoneyScreen} />
    </Stack.Navigator>
  );
}

const AddMoneyNavigationWrapper = () => (
  <WraperScreen paddingBottom={0} paddingHorizontal={0}>
    <AddMoneyNavigation />
  </WraperScreen>
);

export default AddMoneyNavigationWrapper;
