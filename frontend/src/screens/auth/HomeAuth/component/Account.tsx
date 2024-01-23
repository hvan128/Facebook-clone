import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Avatar, Text, TouchableRipple } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import { useAppDispatch } from 'src/redux';
import { deleteAccount } from 'src/redux/slices/authSlice';
export interface AccountProps {
  name: string;
  imageUrl?: string;
  id: string;
  onPress?: () => any;
}
function Account(props: AccountProps) {
  const dispatch = useAppDispatch();
  const onPressDeleteAccount = () => dispatch(deleteAccount(props.id));

  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.wrapperAccount} onPress={props.onPress}>
      <View style={styles.account}>
        <Avatar.Image
          size={50}
          source={
            props.imageUrl ? { uri: props.imageUrl } : require('src/assets/avatar-default.jpg')
          }
        />
        <Text variant='titleMedium'>{props.name}</Text>
      </View>

      <TouchableRipple onPress={onPressDeleteAccount}>
        <Text style={styles.deleteButton}>Gỡ</Text>
      </TouchableRipple>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  wrapperAccount: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: color.white,
    borderRadius: 10
  },
  account: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  deleteButton: {
    alignItems: 'center',
    marginRight: 10,
    fontSize: 16,
    padding: 2,
    color: color.activeOutlineColor
  }
});
export default Account;
