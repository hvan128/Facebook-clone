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
import Modal from 'react-native-modal';
import { MediaType, PhotoQuality, launchImageLibrary } from 'react-native-image-picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getAvatarUri, handShowErrorMessage } from 'src/utils/helper';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { changeCoins, selectAuth } from 'src/redux/slices/authSlice';
import BaseButton from 'src/components/BaseButton';
import { editPost } from 'src/services/post.services';
import { setMessage } from 'src/redux/slices/appSlice';
import { PostNavigationName } from 'src/common/constants/nameScreen';
import OptionCard from '../CreatePostScreen/component/OptionCard';
import { getNewPost } from 'src/redux/slices/newPostSlice';

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
const EditPostScreen = () => {
  const route: RouteProp<PostNavigationType, PostNavigationName.EditPostScreen> = useRoute();
  const selectedItem = route?.params?.selectedItem;
  const data = route?.params?.data;
  const [oldImages, setOldImages] = useState<{ id: string; url: string }[]>(data.image);
  const [imageDel, setImageDel] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<string[]>([]);
  const [listImage, setListImage] = useState(oldImages.map(item => item.url));
  const [newMediaFiles, setNewMediaFiles] = useState<MediaFileType[]>([]);
  const [video, setVideo] = useState('');
  const [described, setDescribed] = useState(data.described);
  const dispatch = useAppDispatch();

  const navigation: NavigationProp<PostNavigationType, PostNavigationName.EnAScreen> =
    useNavigation();
  const navigation1: NavigationProp<PostNavigationType, PostNavigationName.ListImageEditScreen> =
    useNavigation();
  const auth = useAppSelector(selectAuth);
  const avatar = auth.user?.avatar;
  const username = auth.user?.username;
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
          if (listImage.length === 0) {
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
              listImage.length < 4
                ? (setNewMediaFiles([{ ...assets, base64: file }, ...newMediaFiles]),
                  setNewImage([...newImage, src]),
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
              listImage.length < 4
                ? (setNewMediaFiles([{ ...assets, base64: file }, ...newMediaFiles]),
                  setNewImage([...newImage, src]),
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
  const handleBackPress = () => {
    navigationGoBack.goBack();
  };
  const navigateToListImageEditScreen = () => {
    navigation1.navigate(PostNavigationName.ListImageEditScreen, {
      oldImage: oldImages,
      newImage: newImage,
      listImage: listImage,
      newMediaFiles: newMediaFiles,
      imageDel: imageDel,
      onUpdate: (
        updateImageList: string[],
        updateNewMediaFiles: MediaFileType[],
        updateImageDel?: string[],
        updateOldImage?: { id: string; url: string }[],
        updateNewImage?: string[]
      ) => {
        setListImage(updateImageList);
        setNewMediaFiles(updateNewMediaFiles);
        setImageDel(updateImageDel as string[]);
        setOldImages(updateOldImage as { id: string; url: string }[]);
        setNewImage(updateNewImage as string[]);
      }
    });
  };

  const handleCreatePost = async () => {
    try {
      const status = data.status;
      const id = data.id;
      const formData = new FormData();
      formData.append('id', id);
      if (described !== '') {
        formData.append('described', described);
      }
      if (status !== '') {
        formData.append('status', status);
      }
      if (video) {
        formData.append('video', {
          uri: video,
          type: 'video/mp4',
          name: 'video.mp4'
        } as never);
      }
      newMediaFiles.forEach(file => {
        formData.append(`image`, file.base64 as never);
      });
      formData.append('image_del', imageDel.join(','));
      formData.append('image_sort', '1,2,3,4');
      formData.append('auto_accept', 'true');
      const res = await editPost(formData);
      if (res.success) {
        dispatch(setMessage('Bạn đã chỉnh sửa bài viết.'));
        dispatch(getNewPost({ id: res.data.id }));
        dispatch(changeCoins(res.data.coins));
        navigationGoBack.goBack();
        return res;
      } else {
        dispatch(setMessage(handShowErrorMessage(parseInt(res.code as unknown as string))));
      }
      dispatch(getNewPost({ id: res.data.id }));
    } catch (error) {
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
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.8}>
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
          Xong
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
                {selectedItem ? (
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
                  <Text>{data.status}</Text>
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
          style={styles.input}
          value={described}
          onChange={e => {
            setDescribed(e.nativeEvent.text);
          }}
        />
        <View>
          <GridImage
            images={[...listImage, video]}
            onPress={navigateToListImageEditScreen}
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
                  ? () => console.log('Save Post & Go to Home Page')
                  : index === 1
                  ? () => console.log('Go to Home Page')
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

export default EditPostScreen;
