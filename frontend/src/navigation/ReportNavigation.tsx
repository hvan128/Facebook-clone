import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import { ReportNavigationName } from 'src/common/constants/nameScreen';
import WraperScreen from 'src/components/WraperScreen';
import ReportScreen from 'src/screens/report/ReportScreen';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function ReportNavigation() {
  const nav = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        ...TransitionPresets.SlideFromRightIOS,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }}
    >
      <Stack.Screen
        name={ReportNavigationName.ReportScreen}
        component={ReportScreen}
        options={{
          headerTitle: 'Báo cáo',
          headerLeft: () => (
            <MaterialIcon
              name='arrow-back'
              size={28}
              color={'#000'}
              style={{ marginRight: 10 }}
              onPress={() => nav.goBack()}
            />
          )
        }}
      />
    </Stack.Navigator>
  );
}

const ReportNavigationWrapper = () => (
  <WraperScreen paddingBottom={0} paddingHorizontal={0}>
    <ReportNavigation />
  </WraperScreen>
);

export default ReportNavigationWrapper;
