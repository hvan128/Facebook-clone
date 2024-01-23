import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  BackHandler,
  Alert
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import IconM from 'react-native-vector-icons/MaterialIcons';
import { color } from 'src/common/constants/color';
import GridImage from 'src/components/GridImages/GridImage';
import OptionCard from './component/OptionCard';
import Modal from 'react-native-modal';
import { MediaType, PhotoQuality, launchImageLibrary } from 'react-native-image-picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getAvatarUri, handShowErrorMessage } from 'src/utils/helper';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { changeCoins, selectAuth } from 'src/redux/slices/authSlice';
import BaseButton from 'src/components/BaseButton';
import { addPost } from 'src/services/post.services';
import { setMessage } from 'src/redux/slices/appSlice';
import {
  AddMoneyNavigationName,
  AppNaviagtionName,
  PostNavigationName
} from 'src/common/constants/nameScreen';
import {
  IUnfinishedPost,
  getNewPost,
  resetProgress,
  resetUnfinishedPost,
  setProgress,
  setUnfinishedPost
} from 'src/redux/slices/newPostSlice';

export type File = {
  uri?: string;
  type?: string;
  name?: string;
  data?: string;
};
export type MediaFileType = {
  base64?: File;
  fileName?: string;
  fileSize?: number;
  height?: number;
  originalPath?: string;
  type?: string;
  uri?: string;
  width?: number;
};
const CreatePostScreen = () => {
  const [listImage, setListImage] = useState(['']);
  const [mediaFiles, setMediaFiles] = useState<MediaFileType[]>([]);
  const [video, setVideo] = useState('');
  const [described, setDescribed] = useState('');
  const [status, setStatus] = useState('');
  const dispatch = useAppDispatch();

  const route: RouteProp<PostNavigationType, PostNavigationName.CreatePostScreen> = useRoute();
  const selectedItem = route?.params?.selectedItem;

  const navigation: NavigationProp<PostNavigationType, PostNavigationName.EnAScreen> =
    useNavigation();
  const navigation2: NavigationProp<AppNavigationType, AppNaviagtionName.PostNavigation> =
    useNavigation();
  const navigationAddMoney: NavigationProp<AppNavigationType> = useNavigation();
  const auth = useAppSelector(selectAuth);
  const avatar = auth.user?.avatar;
  const username = auth.user?.username;
  const unfinishedPost = useAppSelector(state => state.newPost.unfinishedPost);
  useEffect(() => {
    setStatus(
      selectedItem
        ? !selectedItem?.label.startsWith('Đang')
          ? `- Đang ${selectedItem.emoji} cảm thấy ${selectedItem.label.toLowerCase()}`
          : `- Đang ${selectedItem.emoji} ${selectedItem.label.slice(5)}`
        : ''
    );
  }, [selectedItem]);
  useEffect(() => {
    if (unfinishedPost && unfinishedPost.user_id === auth.user?.id) {
      Alert.alert('Bạn đã tạo bài đăng trước đó', 'Bạn có muốn tiếp tục', [
        {
          text: 'Hủy',
          onPress: () => {
            dispatch(resetUnfinishedPost());
          },
          style: 'cancel'
        },
        {
          text: 'Tiếp tục',
          onPress: () => {
            setListImage(unfinishedPost.listImage as string[]);
            setVideo(unfinishedPost.video as string);
            setDescribed(unfinishedPost.described as string);
            setMediaFiles(unfinishedPost.mediaFiles as MediaFileType[]);
            setStatus(unfinishedPost.status as string);
            dispatch(resetUnfinishedPost());
          }
        }
      ]);
    }
  }, [unfinishedPost]);
  interface IOption {
    icon: string;
    title: string;
    color: string;
    textColor?: string;
  }
  const options: IOption[] = [
    {
      icon: 'insert-photo',
      title: 'Ảnh/video',
      color: color.green
    },
    {
      icon: 'emoji-emotions',
      title: 'Cảm xúc/hoạt động',
      color: color.yellow
    }
  ];

  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleSavePost = () => {
    _goBack();
    const post: IUnfinishedPost = {
      user_id: auth.user?.id as string,
      listImage: listImage,
      video: video,
      described: described,
      status: status,
      mediaFiles: mediaFiles
    };
    dispatch(setUnfinishedPost(post));
  };

  const optionsModal: IOption[] = [
    {
      icon: 'flag',
      title: `Lưu làm bản nháp`,
      color: color.textColor
    },
    {
      icon: 'delete',
      title: `Bỏ bài viết`,
      color: color.textColor
    },
    {
      icon: 'check',
      title: `Tiếp tục chỉnh sửa`,
      color: color.primary,
      textColor: color.primary
    }
  ];
  //Xử lý sử kiện button back của android
  useEffect(() => {
    const backAction = () => {
      showModal();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Xóa lắng nghe khi component bị hủy
    return () => backHandler.remove();
  }, []);

  const openImagePicker = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission given');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    const options = {
      mediaType: 'mixed' as MediaType,
      includeBase64: true,
      base64: true,
      allowsEditing: true,
      quality: 1 as PhotoQuality,
      multiple: true,
      maxWidth: 800,
      maxHeight: 800
    };
    await launchImageLibrary(options, response => {
      const src = response && response?.assets ? response?.assets[0]?.uri : '';
      const type = response && response?.assets ? response?.assets[0]?.type : '';
      const assets = response && response?.assets ? response?.assets[0] : {};
      if (src) {
        if (type === 'video/mp4') {
          if (listImage.length === 1) {
            video === ''
              ? setVideo(src)
              : Alert.alert('Lỗi!', 'Vui lòng chỉ đăng nhiều nhất 1 video.');
          } else {
            Alert.alert('Lỗi!', 'Vui lòng chỉ đăng ảnh hoặc video.');
          }
        } else {
          if (video === '') {
            if (type === 'image/png' || type === 'image/jpg') {
              const file = {
                uri: src,
                type: 'image/png/jpg',
                name: 'image.png/jpg',
                data: response && response?.assets ? response?.assets[0]?.base64 : ''
              };
              listImage.length <= 4
                ? (setMediaFiles([{ ...assets, base64: file }, ...mediaFiles]),
                  setListImage([...listImage, src]))
                : Alert.alert('Lỗi!', 'Vui lòng không đăng quá 4 ảnh.');
            }
            if (type === 'image/jpeg') {
              const file = {
                uri: src,
                type: 'image/jpeg',
                name: 'image.jpeg',
                data: response && response?.assets ? response?.assets[0]?.base64 : ''
              };
              listImage.length <= 4
                ? (setMediaFiles([{ ...assets, base64: file }, ...mediaFiles]),
                  setListImage([...listImage, src]))
                : Alert.alert('Lỗi!', 'Vui lòng không đăng quá 4 ảnh.');
            }
          } else {
            Alert.alert('Lỗi!', 'Vui lòng chỉ đăng ảnh hoặc video.');
          }
        }
      }
    });
  };

  const handleEnA = () => {
    navigation.navigate('EnAScreen');
  };
  const navigationGoBack = useNavigation();
  const _goBack = () => {
    navigationGoBack.goBack();
  };
  const handleBack = () => {
    showModal();
  };
  const navigateToListImageScreen = () => {
    navigation2.navigate(AppNaviagtionName.PostNavigation, {
      screen: PostNavigationName.ListImageScreen,
      params: {
        imageList: listImage,
        mediaFiles: mediaFiles,
        onUpdate: (updateImageList: string[], updateMediaFiles: MediaFileType[]) => {
          setListImage(updateImageList);
          setMediaFiles(updateMediaFiles);
        }
      }
    });
  };
  const onPressAddMoney = () =>
    navigationAddMoney.navigate(AppNaviagtionName.AddMoneyNavigation, {
      screen: AddMoneyNavigationName.AddMoneyScreen
    });

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      if (described !== '') {
        formData.append('described', described);
      }
      if (video) {
        formData.append('video', {
          uri: video,
          type: 'video/mp4',
          name: 'video.mp4'
        } as never);
      }
      mediaFiles.forEach(file => {
        formData.append(`image`, file.base64 as never);
      });
      if (status !== '') {
        formData.append('status', status);
      }
      formData.append('auto_accept', 'true');
      navigationGoBack.goBack();
      dispatch(setProgress(0.3));
      await setTimeout(() => {
        dispatch(setProgress(0.6));
      }, 500);
      const res = await addPost(formData);
      console.log(res);
      if (res.success) {
        dispatch(getNewPost({ id: res.data.id }));
        dispatch(resetUnfinishedPost());
        dispatch(changeCoins(res.data.coins));
        return res;
      } else if (res.message == 'Not enough coins') {
        Alert.alert(
          'Lỗi!',
          'Tài khoản của bạn không đủ số dư.\nVui lòng nạp thêm coins để tiếp tục thực hiện thao tác này! ',
          [
            {
              text: 'Hủy',
              onPress: () => {},
              style: 'cancel'
            },
            {
              text: 'Tiếp tục',
              onPress: () => {
                onPressAddMoney();
              }
            }
          ]
        );
      } else {
        dispatch(resetProgress());
        dispatch(setMessage(handShowErrorMessage(parseInt(res.code as unknown as string))));
      }
    } catch (error) {
      dispatch(resetProgress());
      dispatch(setMessage('Vui lòng kiểm tra lại kết nối'));
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          justifyContent: 'space-between',
          paddingHorizontal: 15
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.8}>
            <IconM name='arrow-back' size={26} color={color.textColor} />
          </TouchableOpacity>
          <Text style={{ fontSize: 19, color: color.textColor }}>Tạo bài viết</Text>
        </View>
        <BaseButton
          borderRadius={5}
          onPress={() => {
            handleCreatePost();
          }}
          labelStyle={{ color: 'white' }}
          style={{ backgroundColor: color.primary }}
        >
          Đăng
        </BaseButton>
      </View>
      <ScrollView keyboardShouldPersistTaps='handled' style={{ marginBottom: 90 }}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={getAvatarUri(avatar as string)} style={styles.avatar} />
          </View>
          <View style={styles.userInfo}>
            <View style={{ flexDirection: 'row', marginRight: 80, marginBottom: 5 }}>
              <Text style={styles.username}>
                {username}{' '}
                {status !== '' ? (
                  <Text style={styles.username}>{status}</Text>
                ) : selectedItem ? (
                  !selectedItem?.label.startsWith('Đang') ? (
                    <Text style={styles.username}>
                      - Đang {selectedItem.emoji} cảm thấy {selectedItem.label.toLowerCase()}
                    </Text>
                  ) : (
                    <Text style={styles.username}>
                      - Đang {selectedItem.emoji} {selectedItem.label.slice(5)}
                    </Text>
                  )
                ) : (
                  <Text></Text>
                )}
              </Text>
            </View>
            <View style={styles.wrapMode}>
              <Icon name='earth-asia' size={16} color={color.primary} style={{ padding: 5 }}></Icon>
              <Text style={styles.userMode}>Công khai</Text>
            </View>
          </View>
        </View>

        <TextInput
          multiline
          // placeholder={
          //   listImage.length === 1 && video === ''
          //     ? 'Bạn đang nghĩ gì...'
          //     : listImage.length === 1 && video !== ''
          //     ? 'Hãy nói gì đó về video này...'
          //     : listImage.length === 2 && video === ''
          //     ? 'Hãy nói gì đó về bức ảnh này...'
          //     : listImage.length > 2 && video === ''
          //     ? 'Hãy nói gì đó về các bức ảnh này...'
          //     : 'Hãy nói gì đó về nội dung này...'
          // }
          style={styles.input}
          value={described}
          onChange={e => {
            setDescribed(e.nativeEvent.text);
          }}
        />
        <View>
          <GridImage
            images={[...listImage, video]}
            onPress={navigateToListImageScreen}
            style={{ width: '100%', height: 300, marginBottom: 8 }}
          ></GridImage>
        </View>
      </ScrollView>
      <View style={styles.modelFooter}>
        {options.map((option, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={index === 0 ? openImagePicker : handleEnA}
              style={{ borderTopColor: color.borderBottom, borderTopWidth: 1 }}
            >
              <OptionCard icon={option.icon} color={option.color} title={option.title} />
            </TouchableOpacity>
          );
        })}
      </View>
      <Modal
        isVisible={modalVisible}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        backdropOpacity={0.5}
        onBackdropPress={hideModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={{ marginBottom: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingBottom: 10,
                marginLeft: 15
              }}
            >
              <View style={{ alignContent: 'center' }}>
                <Text style={{ fontWeight: '500', fontSize: 17, color: color.textColor }}>
                  Bạn muốn hoàn thành bài viết của mình sau?
                </Text>
                <Text style={{ marginTop: 5, fontSize: 14 }}>
                  Lưu làm bản nháp hoặc bạn có thể tiếp tục chỉnh sửa
                </Text>
              </View>
            </View>
          </View>
          {optionsModal.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={
                index === 0
                  ? () => handleSavePost()
                  : index === 1
                  ? () => _goBack()
                  : index === 2
                  ? hideModal
                  : () => console.log('Lỗi!')
              }
            >
              <View style={[styles.option, { height: 19 * 3 }]}>
                <OptionCard
                  icon={option.icon}
                  title={option.title}
                  color={option.color}
                  textColor={option?.textColor}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  wrapMode: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    backgroundColor: color.opacity,
    borderRadius: 5,
    padding: 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  avatarContainer: {
    marginRight: 12
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  userInfo: {},
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.textColor
  },
  userMode: {
    color: color.primary,
    fontWeight: 'bold',
    alignContent: 'center'
  },
  input: {
    paddingHorizontal: 16,
    textAlignVertical: 'top',
    maxHeight: 500,
    fontSize: 16
  },
  button: {
    marginTop: 16,
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  },
  modelFooter: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  modalContent: {
    backgroundColor: 'white',
    paddingTop: 20
  },
  option: {
    paddingVertical: 0
  }
});

export default CreatePostScreen;
