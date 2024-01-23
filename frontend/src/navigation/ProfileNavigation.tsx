import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from 'src/screens/profile/Profile/ProfileScreen';
import EditProfile from 'src/screens/profile/EditProfile';
import WraperScreen from 'src/components/WraperScreen';
import { TransitionPresets } from '@react-navigation/stack';
import { ProfileNavigationName } from 'src/common/constants/nameScreen';
import SettingProfile from 'src/screens/profile/SettingProfile/SettingProfile';

const Stack = createNativeStackNavigator();

function ProfileNavigation() {
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
        name={ProfileNavigationName.Profile}
        options={{
          headerShown: false
        }}
        component={ProfileScreen}
      />
      <Stack.Screen
        name={ProfileNavigationName.EditProfile}
        options={{ headerTitle: 'Chỉnh sửa trang cá nhân' }}
        component={EditProfile}
      />
      <Stack.Screen
        name={ProfileNavigationName.SettingProfile}
        options={{ headerTitle: 'Cài đặt trang cá nhân' }}
        component={SettingProfile}
      />
    </Stack.Navigator>
  );
}

const ProfileNavigationWrapper = () => (
  <WraperScreen paddingBottom={0} paddingHorizontal={0}>
    <ProfileNavigation />
  </WraperScreen>
);

export default ProfileNavigationWrapper;
