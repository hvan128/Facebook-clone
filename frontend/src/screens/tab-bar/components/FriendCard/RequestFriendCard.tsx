import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import Modal from 'react-native-modal';
import OptionCard from 'src/screens/profile/Profile/component/OptionCard';
import { ISetAcceptFriend } from 'src/interfaces/friends.interface';
import { setAcceptFriendApi } from 'src/services/friends.services';
import { getAvatarUri } from 'src/utils/helper';
import { setBlockApi } from 'src/services/block.service';
import { blockComponent } from 'src/redux/slices/blockSlice';
import { useAppDispatch } from 'src/redux';

interface RequestFriendCardProps {
  id: string;
  username: string;
  avatarSource: string;
  same_friends: string;
  created: string;
}

const RequestFriendCard: React.FC<RequestFriendCardProps> = ({
  id,
  username,
  avatarSource,
  same_friends,
  created
}) => {
  const dispatch = useAppDispatch();
  const options = [
    {
      icon: 'report',
      title: `Báo cáo ${username}`
    },
    {
      icon: 'person-remove',
      title: `Chặn trang cá nhân của ${username}`
    }
  ];

  const [status, setStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    const currentTime = new Date();
    const createdTime = new Date(created);
    const timeDifference = Math.abs(currentTime.getTime() - createdTime.getTime());
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);

    if (hoursDifference < 1) {
      setTimeDisplay(minutesDifference < 1 ? 'vừa xong' : `${minutesDifference} phút trước`);
    } else {
      setTimeDisplay(
        hoursDifference < 24
          ? `${hoursDifference} giờ trước`
          : `${Math.floor(hoursDifference / 24)} ngày trước`
      );
    }
  }, [created]);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  const onPressAccept = async (data: ISetAcceptFriend) => {
    Alert.alert('XÁC NHẬN', `Bạn có muốn chấp nhận lời mời kết bạn của ${username}?`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const result = await setAcceptFriendApi(data);
            if (result.code == 1000) {
              setStatus('Accept');
              return result;
            } else if (result.code == 9994) {
              setStatus('Failed');
              Alert.alert(
                'Yêu cầu không hợp lệ',
                'Lời mời kết bạn đã hết hạn. Vui lòng thử lại sau!'
              ),
                setStatus('Failed');
              return result;
            } else {
              setStatus('Failed');
              return console.log({ message: 'sever availability' });
            }
          } catch (error) {
            console.log(error);
            return console.log({ message: 'sever availability' });
          }
        }
      }
    ]);
  };

  const onPressDelete = (data: ISetAcceptFriend) => {
    Alert.alert('XÁC NHẬN', `Bạn có muốn xóa lời mời kết bạn từ ${username}?`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const result = await setAcceptFriendApi(data);
            setStatus('Delete');
            return result;
          } catch (error) {
            return console.log({ message: 'sever availability' });
          }
        }
      }
    ]);
  };
  const handleBlockUser = async (id: string) => {
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
              await setBlockApi({ user_id: id });
              dispatch(blockComponent());
              setStatus('Block');
              hideModal();
            } catch (error) {
              return;
            }
          }
        }
      ]
    );
  };

  return (
    status !== 'Block' && (
      <View style={styles.cardContainer}>
        <View style={styles.avatarContainer}>
          <Image source={getAvatarUri(avatarSource)} style={styles.avatar} />
        </View>

        {status === '' ? (
          <View style={styles.infoContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.timeText}>{timeDisplay}</Text>
            </View>
            {parseInt(same_friends) < 1 ? (
              <></>
            ) : (
              <Text
                style={{ marginBottom: 7, marginTop: -8, fontSize: 15 }}
              >{`${same_friends} bạn chung`}</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onPressAccept({ user_id: id, is_accept: '1' })}
              >
                <Text style={styles.buttonText}>Chấp nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onPressDelete({ user_id: id, is_accept: '0' })}
              >
                <Text style={[styles.buttonText, { color: color.textColor }]}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : status === 'Accept' ? (
          <View style={styles.infoContainer}>
            <View style={styles.usernameField}>
              <Text style={styles.username}>{username}</Text>
            </View>
            <Text style={{ marginBottom: 20 }}>Các bạn đã là bạn bè</Text>
          </View>
        ) : status === 'Failed' ? (
          <View style={styles.infoContainer}>
            <View style={styles.usernameField}>
              <Text style={styles.username}>{username}</Text>
            </View>
            <Text style={{ marginBottom: 20 }}>Lời mời kết bạn đã hết hạn</Text>
          </View>
        ) : status === 'Delete' ? (
          <View style={styles.infoContainer}>
            <View style={styles.usernameField}>
              <Text style={styles.username}>{username}</Text>
              <IconButton
                icon={require('../../../../assets/three-dot.png')}
                onPress={() => {
                  showModal();
                }}
              ></IconButton>
            </View>
            <Text style={{ marginBottom: 20 }}>Đã gỡ lời mời</Text>
          </View>
        ) : (
          <></>
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
                onPress={index === 1 ? () => handleBlockUser(id) : hideModal}
              >
                <View style={[styles.option, { height: 19 * 3 }]}>
                  <OptionCard icon={option.icon} title={option.title} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8
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
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: color.textColor
  },
  usernameField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timeContainer: {
    marginTop: 5
  },
  timeText: {
    color: 'gray'
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
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

export default RequestFriendCard;
