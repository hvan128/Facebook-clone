import { useNavigation, StackActions } from '@react-navigation/native';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { color } from 'src/common/constants/color';
import { AppNaviagtionName, ProfileNavigationName } from 'src/common/constants/nameScreen';
import { getAvatarUri } from 'src/utils/helper';
export interface FriendProps {
  username: string;
  avatarUrl: string;
  user_id: string;
}
const FriendCard = (props: FriendProps) => {
  const navigation = useNavigation();
  const pushProfile = StackActions.push(AppNaviagtionName.ProfileNavigation, {
    screen: ProfileNavigationName.Profile,
    params: { user_id: props.user_id }
  });

  const handleNavigateUserProfile = () => navigation.dispatch(pushProfile);

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigateUserProfile}>
      <Image style={styles.avatar} source={getAvatarUri(props.avatarUrl)} />
      <Text style={styles.username}>{props.username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 115,
    height: 115,
    flexDirection: 'column',
    backgroundColor: 'white',
    minWidth: 124,
    minHeight: 170,
    paddingHorizontal: 5
  },
  avatar: {
    width: 115,
    height: 115,
    borderRadius: 7,
    marginBottom: 5
  },
  username: {
    fontSize: 16,
    color: color.textColor,
    fontWeight: 'bold',
    marginHorizontal: 3
  }
});

export default FriendCard;
