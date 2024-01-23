import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { color } from 'src/common/constants/color';
import { IDeleteRequestFriend, ISetRequestFriend } from 'src/interfaces/friends.interface';
import { deleteRequestFriendApi, setRequestFriendApi } from 'src/services/friends.services';
import { getAvatarUri } from 'src/utils/helper';

interface SuggestFriendCardProps {
  id: string;
  username: string;
  avatarSource: string;
  same_friends: string;
  created: string;
}

const SuggestFriendCard: React.FC<SuggestFriendCardProps> = ({
  id,
  username,
  avatarSource,
  same_friends
}) => {
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
            setStatus('AddFriend');
          } catch (error) {
            return console.log({ message: 'sever availability' });
          }
        }
      }
    ]);
  };
  const onPressDelete = () => {
    Alert.alert('XÁC NHẬN', `Không muốn gợi ý bạn bè từ ${username}?`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: () => {
          setStatus('Delete');
        }
      }
    ]);
  };
  const onPressCancel = async (data: IDeleteRequestFriend) => {
    try {
      const result = await deleteRequestFriendApi(data);
      setStatus('Cancel');
      return result;
    } catch (error) {
      return console.log({ message: 'sever availability' });
    }
  };

  return (
    <>
      {status === '' ? (
        <View style={styles.cardContainer}>
          <View style={styles.avatarContainer}>
            {avatarSource && avatarSource !== '' ? (
              <Image source={getAvatarUri(avatarSource)} style={styles.avatar} />
            ) : (
              <Image
                source={require('../../../../assets/avatar-default.jpg')}
                style={styles.avatar}
              />
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.username}>{username}</Text>
            {parseInt(same_friends) < 1 ? (
              <></>
            ) : (
              <Text
                style={{ marginBottom: 7, marginTop: 2, fontSize: 15 }}
              >{`${same_friends} bạn chung`}</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onPressAddFriend({ user_id: id })}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Thêm bạn bè</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={onPressDelete}>
                <Text style={[styles.buttonText, { color: color.textColor }]}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : status === 'AddFriend' ? (
        <View style={styles.cardContainer}>
          <View style={styles.avatarContainer}>
            {avatarSource && avatarSource !== '' ? (
              <Image source={getAvatarUri(avatarSource)} style={styles.avatar} />
            ) : (
              <Image
                source={require('../../../../assets/avatar-default.jpg')}
                style={styles.avatar}
              />
            )}
          </View>
          <View style={styles.infoContainer}>
            <View>
              <Text style={[styles.username, { marginTop: 0 }]}>{username}</Text>
            </View>
            <Text style={{ marginBottom: 10 }}>Đã gửi yêu cầu</Text>
            <TouchableOpacity style={styles.button} onPress={() => onPressCancel({ user_id: id })}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : status === 'Cancel' ? (
        <View style={styles.cardContainer}>
          <View style={styles.avatarContainer}>
            {avatarSource && avatarSource !== '' ? (
              <Image source={getAvatarUri(avatarSource)} style={styles.avatar} />
            ) : (
              <Image
                source={require('../../../../assets/avatar-default.jpg')}
                style={styles.avatar}
              />
            )}
          </View>
          <View style={styles.infoContainer}>
            <View>
              <Text style={[styles.username, { marginTop: 0 }]}>{username}</Text>
            </View>
            <Text style={{ marginBottom: 10 }}>Đã hủy yêu cầu</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onPressAddFriend({ user_id: id })}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Thêm bạn bè</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={onPressDelete}>
                <Text style={[styles.buttonText, { color: color.textColor }]}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13
  },
  avatarContainer: {
    marginRight: 16
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45
  },
  infoContainer: {
    flex: 1
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    color: color.textColor
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  acceptButton: {
    flex: 1,
    backgroundColor: color.primary,
    padding: 8,
    borderRadius: 5,
    marginRight: 10
  },
  deleteButton: {
    flex: 1,
    backgroundColor: color.outlineColor,
    padding: 8,
    borderRadius: 5
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
  },
  button: {
    backgroundColor: color.outlineColor,
    padding: 9,
    borderRadius: 5
  },
  buttonText: {
    color: color.textColor,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default SuggestFriendCard;
