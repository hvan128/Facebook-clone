import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FriendCard from './FriendCard';
import { color } from 'src/common/constants/color';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNaviagtionName, TabNavigationName } from 'src/common/constants/nameScreen';
import { IUserFriends } from 'src/interfaces/friends.interface';

interface FriendFieldProps {
  friends: IUserFriends[];
  totalFriend: string;
  isOwnProfile: boolean;
}
const FriendField = ({ friends, totalFriend, isOwnProfile }: FriendFieldProps) => {
  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.TabNavigation> =
    useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerFriendField}>
        <View style={styles.totalFriend}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>Bạn bè</Text>
          <Text style={{ fontSize: 15 }}>{totalFriend.toLocaleString()} người bạn</Text>
        </View>
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.searchFriend}
            onPress={() =>
              navigation.navigate(AppNaviagtionName.TabNavigation, {
                screen: TabNavigationName.Friend
              })
            }
          >
            <Text style={{ fontSize: 16, color: color.primary }}>Tìm bạn bè</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}
      >
        {friends.map((item, index) => (
          <FriendCard
            avatarUrl={item.avatar}
            username={item.username}
            user_id={item.id}
            key={index}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.allFriendBtn} activeOpacity={0.7} onPress={() => {}}>
        <Text
          style={{ color: color.textColor, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}
        >
          Xem tất cả bạn bè
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  totalFriend: {
    marginLeft: 5,
    marginBottom: 20,
    marginRight: 8
  },
  headerFriendField: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchFriend: {
    padding: 8
  },
  allFriendBtn: {
    marginHorizontal: 10,
    backgroundColor: '#E9F1FE',
    padding: 10,
    borderRadius: 7
  }
});

export default FriendField;
