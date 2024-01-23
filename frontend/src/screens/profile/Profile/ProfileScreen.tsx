import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles';
import FriendField from './component/FriendField';
import OptionCard from './component/OptionCard';
import Modal from 'react-native-modal';
import CreatePostCard from '../../../components/CreatePostCard/CreatePostCard';
import { color } from 'src/common/constants/color';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { AppNaviagtionName, ProfileNavigationName } from 'src/common/constants/nameScreen';
import { IUser } from 'src/interfaces/common.interface';
import { getAvatarUri, getCoverUri } from 'src/utils/helper';
import { getUserInfoApi } from 'src/services/profile.services';
import ButtonField0 from './component/ButtonField0';
import ButtonField1 from './component/ButtonField1';
import ButtonField3 from './component/ButtonField3';
import InforDetail from './component/InforDetail';
import { HeaderWithSearch } from 'src/components/BaseHeader';
import { IGetUserFriends, IUserFriends } from 'src/interfaces/friends.interface';
import { getUserFriendsApi } from 'src/services/friends.services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonField2 from './component/ButtonField2';
import PullDownModal from 'src/components/PullDownModal/PullDownModal';
import PostImageDetail from 'src/screens/post/PostDetail/PostImageDetail';
import BaseFlatList from 'src/components/BaseFlatList';
import { IPost, getListPostAPi } from 'src/services/post.sevices';
import { useIsFocused } from '@react-navigation/native';
import Post from 'src/components/Post';
const COUNT_ITEM = 5;

function ProfileScreen() {
  const [modalAvatarVisible, setModalAvatarVisible] = useState(false);
  const [modalCoverVisible, setModalCoverVisible] = useState(false);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [listFriends, setListFriends] = useState<IUserFriends[]>([]);
  const [totalFriend, setTotalFriend] = useState('');
  const scrollViewRef = useRef<FlatList>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(true);

  const isFocus = useIsFocused();

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };
  useEffect(() => {
    if (isFocus) {
      scrollToTop();
      setTimeout(() => setIsLoadingUserInfo(false), 500);
    } else {
      setIsLoadingUserInfo(true);
    }
  }, [isFocus]);
  const route: RouteProp<PropfileNavigationType, ProfileNavigationName.Profile> = useRoute();
  const auth = useAppSelector(selectAuth);
  const user_id = route.params.user_id;
  const isOwnProfile = auth.user?.id === user_id;

  useEffect(() => {
    if (isOwnProfile) {
      setProfile(auth.user);
    } else {
      const fetchUserData = async (data: { user_id: string }) => {
        try {
          const result = await getUserInfoApi(data);
          setProfile(result.data);
        } catch (error) {
          return console.log({ message: 'sever availability' });
        }
      };
      fetchUserData({ user_id }).catch(console.error);
    }
    const fetchData = async (data: IGetUserFriends) => {
      try {
        const result = await getUserFriendsApi(data);
        setTotalFriend(result.data.total);
        setListFriends(result.data.friends);
        return result;
      } catch (error) {
        return console.log({ message: 'sever availability' });
      }
    };

    fetchData({
      index: 0,
      count: 6,
      user_id: !user_id ? '' : user_id
    }).catch(console.error);
  }, [auth.user, isOwnProfile, user_id]);

  // scroll to top

  const isFriend = profile?.is_friend;

  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();
  const navigateSettingProfileScreen = () =>
    navigation.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.SettingProfile,
      params: { user_id, username: profile?.username }
    });
  const navigateEditProfileScreen = () =>
    navigation.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.EditProfile
    });

  /*
   * isFirend =
   * *0: chưa gửi/nhận lời mời kết bạn với tài khoản này
   * *1: là bạn bè với tài khoản này
   * *2: đang gửi lời mời kết bạn với tài khoản này
   * *3: đang nhận lời mời kết bạn với tài khoản này
   */

  const showModalAvatar = () => {
    setModalAvatarVisible(true);
  };
  const hideModalAvatar = () => {
    setModalAvatarVisible(false);
  };
  const showModalCover = () => {
    setModalCoverVisible(true);
  };
  const hideModalCover = () => {
    setModalCoverVisible(false);
  };

  const [avatarVisible, setAvatarVisible] = useState(false);
  const [coverVisible, setCoverVisible] = useState(false);
  const showAvatar = () => {
    setAvatarVisible(true);
    hideModalAvatar();
    hideModalCover();
  };

  const hideAvatar = () => {
    setAvatarVisible(false);
  };
  const showCover = () => {
    setCoverVisible(true);
    hideModalCover();
    hideModalCover();
  };

  const hideCover = () => {
    setCoverVisible(false);
  };

  const optionsAvatar = isOwnProfile
    ? [
        {
          icon: 'account-circle',
          title: 'Xem ảnh đại diện'
        },
        {
          icon: 'photo-library',
          title: 'Chọn ảnh đại diện'
        }
      ]
    : profile?.avatar
    ? [
        {
          icon: 'account-circle',
          title: 'Xem ảnh đại diện'
        }
      ]
    : [];
  const optionsCover = isOwnProfile
    ? [
        {
          icon: 'account-circle',
          title: 'Xem ảnh bìa'
        },
        {
          icon: 'photo-library',
          title: 'Chọn ảnh bìa'
        }
      ]
    : profile?.cover_image
    ? [
        {
          icon: 'account-circle',
          title: 'Xem ảnh bìa'
        }
      ]
    : [];

  const totalHeight = 2 * 25;

  // post api
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isNextFetch, setIsNextFetch] = useState(true);
  const [data, setData] = useState<IPost[]>([]);

  const getFirPost = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getListPostAPi({ user_id: user_id, index: 0, count: COUNT_ITEM });
      if (res.success) {
        setData(res.data.post);
        setSkip(COUNT_ITEM);
        if (!res.data.post.length) {
          return setIsNextFetch(false);
        }
      } else {
        setIsNextFetch(false);
      }
    } catch (err) {
      return;
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  //get first post
  useEffect(() => {
    if (isFocus) {
      getFirPost();
    }
  }, [getFirPost, isFocus]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setLoading(true);
      const res = await getListPostAPi({ user_id: user_id, index: 0, count: COUNT_ITEM });
      if (res.success) {
        if (!res.data.post.length) {
          return setIsNextFetch(false);
        }
        setData(res.data.post);
        setSkip(COUNT_ITEM);
      }
    } catch (err) {
      return;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  async function onEndReadable() {
    if (isNextFetch) {
      try {
        setLoading(true);
        const res = await getListPostAPi({ user_id: user_id, index: skip, count: COUNT_ITEM });
        if (res.success) {
          if (!res.data.post.length) {
            return setIsNextFetch(false);
          }
          setData(data => [...data, ...res.data.post]);
          setSkip(skip => skip + COUNT_ITEM);
        }
      } catch (err) {
        return;
      } finally {
        setLoading(false);
      }
    }
  }
  return isLoadingUserInfo ? (
    <ActivityIndicator color={color.activeOutlineColor} style={{ marginTop: '50%' }} />
  ) : (
    <BaseFlatList
      ref={scrollViewRef}
      data={data}
      ListHeaderComponent={
        <View style={styles.container}>
          <HeaderWithSearch title={profile?.username as string} titleIsCenter={true} />
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.coverPhoto}
              onPress={isOwnProfile || profile?.cover_image ? showModalCover : () => null}
              activeOpacity={0.8}
            >
              <Image
                style={styles.coverPhoto}
                source={getCoverUri(profile?.cover_image as string)}
              />
            </TouchableOpacity>
            {isOwnProfile && profile?.avatar && (
              <View style={styles.cameraIconWrapper}>
                <TouchableOpacity
                  style={styles.cameraIcon}
                  onPress={showModalCover}
                  activeOpacity={0.8}
                >
                  <IconButton
                    icon='camera'
                    mode='contained'
                    iconColor='black'
                    containerColor='#E6E6EF'
                    size={28}
                    onPress={showModalCover}
                  />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={isOwnProfile || profile?.avatar ? showModalAvatar : () => null}
              activeOpacity={0.8}
            >
              <Image style={styles.avatar} source={getAvatarUri(profile?.avatar as string)} />
            </TouchableOpacity>
            {isOwnProfile && (
              <TouchableOpacity
                style={styles.cameraIconAvatar}
                onPress={showModalAvatar}
                activeOpacity={0.8}
              >
                <IconButton
                  icon='camera'
                  mode='contained'
                  iconColor={color.textColor}
                  containerColor='#E6E6EF'
                  size={32}
                  onPress={showModalAvatar}
                />
              </TouchableOpacity>
            )}
            <View
              style={isOwnProfile ? styles.infomation : { ...styles.infomation, marginTop: 100 }}
            >
              <Text style={styles.name}>{profile?.username}</Text>
              {profile?.description !== '' ? (
                <Text style={styles.bio}>{profile?.description}</Text>
              ) : (
                <></>
              )}
            </View>
          </View>
          {/* Button Field */}
          {isOwnProfile ? (
            <View
              style={[
                styles.section,
                { flexDirection: 'row', justifyContent: 'space-between', padding: 20 }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  backgroundColor: color.primary,
                  padding: 8,
                  borderRadius: 5,
                  width: '85%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={navigateEditProfileScreen}
              >
                <Text style={[styles.buttonText]}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: color.outlineColor,
                  padding: 8,
                  borderRadius: 5,
                  width: '12%',
                  alignItems: 'center'
                }}
                onPress={navigateSettingProfileScreen}
              >
                <Icon name='dots-horizontal' size={20}></Icon>
              </TouchableOpacity>
            </View>
          ) : !isOwnProfile && isFriend === '0' ? (
            <ButtonField0 user_id={user_id} username={profile?.username as string} />
          ) : !isOwnProfile && isFriend === '1' ? (
            <ButtonField1 user_id={user_id} username={profile?.username as string} />
          ) : !isOwnProfile && isFriend === '2' ? (
            <ButtonField2 user_id={user_id} username={profile?.username as string} />
          ) : !isOwnProfile && isFriend === '3' ? (
            <ButtonField3 user_id={user_id} username={profile?.username as string} />
          ) : null}
          {/* Infor Detail */}
          <InforDetail
            address={profile?.address}
            city={profile?.city}
            country={profile?.country}
            isOwnProfile={isOwnProfile}
          />
          {/* Friend Field */}
          <View style={styles.section}>
            <FriendField
              friends={listFriends}
              totalFriend={totalFriend}
              isOwnProfile={isOwnProfile}
            ></FriendField>
          </View>
          {/* Post Field */}
          {isOwnProfile && (
            <View style={styles.section}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black', marginLeft: 20 }}>
                Bài viết
              </Text>
              <CreatePostCard avatar={profile?.avatar as string} />
            </View>
          )}
          <Modal
            isVisible={modalAvatarVisible}
            animationIn='slideInUp'
            animationOut='slideOutDown'
            backdropOpacity={0.5}
            onBackdropPress={hideModalAvatar}
            style={styles.modal}
          >
            <View style={styles.modalContent}>
              {optionsAvatar.map((option, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() =>
                    index === 0 ? showAvatar() : console.log(`Selected: ${option.title}`)
                  }
                >
                  <View style={[styles.option, { height: totalHeight }]}>
                    <OptionCard icon={option.icon} title={option.title} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
          <Modal
            isVisible={modalCoverVisible}
            animationIn='slideInUp'
            animationOut='slideOutDown'
            backdropOpacity={0.5}
            onBackdropPress={hideModalCover}
            style={styles.modal}
          >
            <View style={styles.modalContent}>
              {optionsCover.map((option, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() =>
                    index === 0 ? showCover() : console.log(`Selected: ${option.title}`)
                  }
                >
                  <View style={[styles.option, { height: totalHeight }]}>
                    <OptionCard icon={option.icon} title={option.title} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>
          <PullDownModal visible={avatarVisible} onClose={hideAvatar}>
            <PostImageDetail
              image={{ url: profile?.avatar as string }}
              author={{
                name: profile?.username as string,
                avatar: profile?.avatar as string,
                id: user_id
              }}
              created={profile?.created}
            />
          </PullDownModal>
          <PullDownModal visible={coverVisible} onClose={hideCover}>
            <PostImageDetail
              image={{ url: profile?.cover_image as string }}
              author={{
                name: profile?.username as string,
                avatar: profile?.avatar as string,
                id: user_id
              }}
              created={profile?.created}
            />
          </PullDownModal>
        </View>
      }
      ListEmptyComponent={
        <Text
          style={{
            textAlign: 'center',
            color: color.black,
            fontSize: 16,
            fontWeight: '500',
            padding: 10
          }}
        >
          {profile?.username} chưa có bài viết nào.
        </Text>
      }
      renderItem={({ item }) => (
        <Post
          id={item.id}
          author={item.author}
          created={item.created}
          comment_mark={item.comment_mark}
          described={item.described}
          image={item.image}
          video={item.video}
          name={item.name}
          feel={item.feel}
          numberShares={item.numberShares}
          banned={item.banned}
          can_edit={item.can_edit}
          is_blocked={item.is_blocked}
          is_felt={item.is_felt}
          status={item.state}
        />
      )}
      keyExtractor={item => item.id}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReadable}
      onEndReachedThreshold={0.005}
      isFootterLoading={loading}
    />
  );
}

export default ProfileScreen;
