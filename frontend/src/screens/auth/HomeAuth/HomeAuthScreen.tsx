import WraperScreen from 'src/components/WraperScreen';
import BaseButton from 'src/components/BaseButton';
import BaseMetaLogo from 'src/components/BaseMetaLogo';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import Account from './component/Account';
import { useAppSelector } from 'src/redux';
import { IAccount, selectAuth } from 'src/redux/slices/authSlice';
import { AuthNavigationName } from 'src/common/constants/nameScreen';

function HomeAuthScreen() {
  const navigation = useNavigation();
  const accounts = useAppSelector(selectAuth).accounts ?? [];

  const navigationAccount: NavigationProp<AuthNavigationType, AuthNavigationName.AccountLogin> =
    useNavigation();
  const onPressAccount = (data: IAccount) =>
    navigationAccount.navigate(AuthNavigationName.AccountLogin, data);

  return (
    <WraperScreen spaceBetween linnerGradient>
      <View style={styles.facebookLogo}>
        <Avatar.Image source={require('src/assets/logo.png')} size={50} />
      </View>
      <View style={styles.accountGroup}>
        {Object?.keys(accounts)?.map(key => (
          <Account
            name={accounts[key].username}
            imageUrl={accounts[key].avatar}
            key={key}
            id={key}
            onPress={() => onPressAccount(accounts[key])}
          />
        ))}
        <TouchableOpacity activeOpacity={0.7}>
          <Text
            style={{
              padding: 16,
              backgroundColor: color.white,
              borderRadius: 8,
              fontSize: 16,
              color: color.primary,
              fontWeight: '500'
            }}
          >
            Tìm tài khoản
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomButtonGroup}>
        <BaseButton
          onPress={() => navigation.navigate('Login' as never)}
          mode='outlined'
          textColor={color.textColor}
          borderColor={color.outlineColor}
          isUseTextOutlineColor
        >
          Đăng nhập bằng tài khoản khác
        </BaseButton>
        <BaseButton
          mode='text'
          isUseTextOutlineColor
          textColor={color.textColor}
          onPress={() => navigation.navigate('FirstScreen' as never)}
        >
          Tạo tài khoản mới
        </BaseButton>
        <BaseMetaLogo />
      </View>
    </WraperScreen>
  );
}

export default HomeAuthScreen;

const styles = StyleSheet.create({
  facebookLogo: {
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column-reverse'
  },
  accountGroup: {
    flex: 3,
    marginTop: 64,
    gap: 10
  },
  bottomButtonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 4,
    marginBottom: 10
  }
});
