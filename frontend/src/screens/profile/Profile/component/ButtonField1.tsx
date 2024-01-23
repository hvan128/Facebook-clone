//react native
import { Alert, Text, TouchableOpacity, View } from 'react-native';

//icon
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import IconF from 'react-native-vector-icons/Fontisto';
import styles from '../styles';
import { color } from 'src/common/constants/color';
import { useState } from 'react';
import { unfriendApi } from 'src/services/friends.services';
import { IUnfriend } from 'src/interfaces/friends.interface';
import ButtonField0 from './ButtonField0';
import Modal from 'react-native-modal';
import OptionCard from './OptionCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  AppNaviagtionName,
  ProfileNavigationName,
  TabNavigationName
} from 'src/common/constants/nameScreen';
import { setBlockApi } from 'src/services/block.service';
import { useAppDispatch } from 'src/redux';
import { blockComponent } from 'src/redux/slices/blockSlice';

const ButtonField1 = ({ user_id, username }: { user_id: string; username: string }) => {
  const [status, setStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigationHome: NavigationProp<AppNavigationType, AppNaviagtionName.TabNavigation> =
    useNavigation();
  const dispatch = useAppDispatch();
  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  const options = [
    {
      icon: 'person-remove',
      title: `Hủy kết bạn`
    },
    {
      icon: 'person-off',
      title: `Chặn trang cá nhân`
    }
  ];
  const handleUnfriend = (data: IUnfriend) => {
    Alert.alert('XÁC NHẬN', `Bạn có muốn hủy kết bạn với ${username}?`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const result = await unfriendApi(data);
            hideModal();
            setStatus('unfriended');
            return result;
          } catch (error) {
            return console.log({ message: 'sever availability' });
          }
        }
      }
    ]);
  };
  const handleBlockUser = async () => {
    Alert.alert(
      `Chặn trang cá nhân của ${username}`,
      `Những người bạn chặn sẽ không thể bắt đầu trò chuyện, thêm bạn vào danh sách bạn bè hoặc xem nội dung của bạn đăng trên dòng thời gian của mình nữa. Nếu bạn chặn ai đó khi hai người đang là bạn bè thì hành động này cũng sẽ hủy kết bạn với họ.`,
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Chặn',
          onPress: async () => {
            try {
              await setBlockApi({ user_id });
              dispatch(blockComponent());
              hideModal();
              Alert.alert(
                `Thành công`,
                `Bạn đã chặn ${username}.\n${username} sẽ không nhận được thông báo về hành động này.`,
                [
                  {
                    text: 'Đóng',
                    onPress: () =>
                      navigationHome.navigate(AppNaviagtionName.TabNavigation, {
                        screen: TabNavigationName.Home
                      }),
                    style: 'cancel'
                  }
                ]
              );
            } catch (error) {
              return;
            }
          }
        }
      ]
    );
  };
  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();
  const navigateSettingProfileScreen = () =>
    navigation.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.SettingProfile,
      params: { user_id, username }
    });

  return (
    <View>
      {status === '' ? (
        <View
          style={[
            styles.section,
            { flexDirection: 'row', justifyContent: 'space-between', padding: 20 }
          ]}
        >
          <TouchableOpacity
            style={{
              backgroundColor: color.outlineColor,
              padding: 8,
              borderRadius: 5,
              width: '42%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => {
              showModal();
            }}
          >
            <IconFA name='user-check' color={'black'} size={15} style={{ paddingRight: 5 }} />
            <Text style={[styles.buttonText, { color: color.textColor }]}>Bạn bè</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: color.primary,
              padding: 8,
              borderRadius: 5,
              width: '42%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconF name='messenger' color={'white'} size={15} style={{ paddingRight: 5 }} />
            <Text style={styles.buttonText}>Nhắn tin</Text>
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
      ) : (
        <ButtonField0 user_id={user_id} username={username} />
      )}
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
              onPress={() =>
                index === 0
                  ? handleUnfriend({ user_id: user_id })
                  : index === 1
                  ? handleBlockUser()
                  : hideModal()
              }
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
};

export default ButtonField1;
