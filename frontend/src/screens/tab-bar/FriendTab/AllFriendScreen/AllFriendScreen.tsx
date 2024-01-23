import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { color } from 'src/common/constants/color';
import { UserFriendCard } from '../../components/FriendCard';
import Modal from 'react-native-modal';
import { useEffect, useState } from 'react';
import OptionCard from 'src/screens/profile/Profile/component/OptionCard';
import { IGetUserFriends, IUserFriends } from 'src/interfaces/friends.interface';
import { getUserFriendsApi } from 'src/services/friends.services';
import { selectAuth } from 'src/redux/slices/authSlice';
import BaseFlatList from 'src/components/BaseFlatList';
import { getUserFriends } from 'src/redux/slices/friendSlice';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNaviagtionName, ProfileNavigationName } from 'src/common/constants/nameScreen';

function AllFriendScreen() {
  const [totalFriend, setTotalFriend] = useState('');

  const [listFriends, setListFriends] = useState<IUserFriends[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const createdFriendAt = (created: string) => {
    const createdDate = new Date(created);
    const month = createdDate.getMonth() + 1;
    const year = createdDate.getFullYear();
    return `tháng ${month} năm ${year}`;
  };

  const userSelector = useAppSelector(selectAuth);
  const user_id = userSelector.user?.id;

  const dispatch = useAppDispatch();

  const onRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    const data: IGetUserFriends = {
      index: 0,
      count: 100,
      user_id: !user_id ? '' : user_id
    };
    const fetchData = async (data: IGetUserFriends) => {
      try {
        const result = await getUserFriendsApi(data);
        setTotalFriend(result.data.total);
        setListFriends(result.data.friends);
        setRefreshing(false);
        return result;
      } catch (error) {
        return console.log({ message: 'sever availability' });
      }
    };

    fetchData(data).catch(console.error);
    dispatch(getUserFriends(data));
  }, [dispatch, refreshing, user_id]);

  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();

  const handleNavigateUserProfile = (user_id: string) => {
    navigation.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.Profile,
      params: { user_id }
    });
  };
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const options = [
    {
      icon: 'auto-mode',
      title: `Mặc định`
    },
    {
      icon: 'arrow-drop-up',
      title: `Bạn bè mới nhất trước tiên`
    },
    {
      icon: 'arrow-drop-down',
      title: `Bạn bè lâu năm nhất trước tiên`
    }
  ];
  const defaultSort = () => {
    hideModal();
  };
  const ascendingSort = () => {
    setListFriends(
      [...listFriends].sort(
        (a: IUserFriends, b: IUserFriends) =>
          new Date(b.created).getTime() - new Date(a.created).getTime()
      )
    );
    hideModal();
  };
  const descendingSort = () => {
    setListFriends(
      [...listFriends].sort(
        (a: IUserFriends, b: IUserFriends) =>
          new Date(a.created).getTime() - new Date(b.created).getTime()
      )
    );
    hideModal();
  };
  const ITEM_HEIGHT = 20;

  return (
    <View style={styles.container}>
      <View style={styles.lineText}>
        <Text style={{ fontWeight: '800', fontSize: 20, color: color.textColor }}>
          {totalFriend} bạn bè
        </Text>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => {
            showModal();
          }}
        >
          <Text style={{ fontSize: 17, color: color.primary }}>Sắp xếp</Text>
        </TouchableOpacity>
      </View>
      <BaseFlatList
        data={listFriends}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNavigateUserProfile(item.id)}>
            <UserFriendCard
              id={item.id}
              created={createdFriendAt(item.created)}
              avatarSource={item.avatar}
              username={item.username}
              same_friends={item.same_friends}
            ></UserFriendCard>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        onRefresh={onRefresh}
        refreshing={refreshing}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index
        })}
      />
      <Modal
        isVisible={modalVisible}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        backdropOpacity={0.5}
        onBackdropPress={hideModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                index === 0 ? defaultSort() : index === 1 ? ascendingSort() : descendingSort();
              }}
            >
              <View style={[styles.option, { height: 19 * 3 }]}>
                <OptionCard icon={option.icon} title={option.title} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 15
  },
  lineText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  option: {
    paddingVertical: 0
  }
});

export default AllFriendScreen;
