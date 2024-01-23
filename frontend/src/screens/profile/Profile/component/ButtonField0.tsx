//react native
import { Alert, Text, TouchableOpacity, View } from 'react-native';

//icon
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import IconF from 'react-native-vector-icons/Fontisto';
import styles from '../styles';
import { color } from 'src/common/constants/color';
import { useState } from 'react';
import { IDeleteRequestFriend, ISetRequestFriend } from 'src/interfaces/friends.interface';
import { deleteRequestFriendApi, setRequestFriendApi } from 'src/services/friends.services';
import IconFA6 from 'react-native-vector-icons/FontAwesome6';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNaviagtionName, ProfileNavigationName } from 'src/common/constants/nameScreen';

const ButtonField0 = ({ user_id, username }: { user_id: string; username: string }) => {
  const [status, setStatus] = useState('');
  const onPressAddFriend = (data: ISetRequestFriend) => {
    Alert.alert('XÁC NHẬN', `Bạn có muốn gửi lời mời kết bạn tới ${username}?`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await setRequestFriendApi(data);
            setStatus('RequestFriend');
          } catch (error) {
            return console.log({ message: 'sever availability' });
          }
        }
      }
    ]);
  };

  const onPressCancel = async (data: IDeleteRequestFriend) => {
    try {
      const result = await deleteRequestFriendApi(data);
      setStatus('');
      return result;
    } catch (error) {
      return console.log({ message: 'sever availability' });
    }
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
              backgroundColor: color.primary,
              padding: 8,
              borderRadius: 5,
              width: '42%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => onPressAddFriend({ user_id })}
          >
            <IconFA name='user-plus' color={'white'} size={15} style={{ paddingRight: 5 }} />
            <Text style={styles.buttonText}>Thêm bạn bè</Text>
          </TouchableOpacity>
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
          >
            <IconF name='messenger' color={'black'} size={15} style={{ paddingRight: 5 }} />
            <Text style={[styles.buttonText, { color: color.textColor }]}>Nhắn tin</Text>
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
      ) : status === 'RequestFriend' ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
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
            onPress={() => onPressCancel({ user_id })}
          >
            <IconFA6 name='user-clock' color={'white'} size={15} style={{ paddingRight: 5 }} />
            <Text style={styles.buttonText}>Hủy lời mời</Text>
          </TouchableOpacity>
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
          >
            <IconF name='messenger' color={'black'} size={15} style={{ paddingRight: 5 }} />
            <Text style={[styles.buttonText, { color: color.textColor }]}>Nhắn tin</Text>
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
        <></>
      )}
    </View>
  );
};

export default ButtonField0;
