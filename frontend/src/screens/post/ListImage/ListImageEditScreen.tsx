import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import IconM from 'react-native-vector-icons/MaterialIcons';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { PostNavigationName } from 'src/common/constants/nameScreen';
import { MediaFileType } from '../CreatePostScreen/CreatePostScreen';
import ImageItem from 'src/components/GridImages/components/ImageItem';
import { color } from 'src/common/constants/color';
import PullDownModal from 'src/components/PullDownModal/PullDownModal';
import PostImageDetail from '../PostDetail/PostImageDetail';

const ListImageEditScreen = () => {
  const route: RouteProp<PostNavigationType, PostNavigationName.ListImageEditScreen> = useRoute();
  const { oldImage, newImage, newMediaFiles, listImage, imageDel, onUpdate } = route.params;
  // eslint-disable-next-line no-unused-vars
  const [updateImageList, setUpdateImageList] = useState<string[]>(listImage);
  const [updateNewMediaFiles, setUpdateNewMediaFiles] = useState<MediaFileType[]>(newMediaFiles);
  const [updateImageDel, setUpdateImageDel] = useState<string[]>(imageDel as string[]);
  const [updateOldImage, setUpdateOldImage] = useState<{ id: string; url: string }[]>(
    oldImage as { id: string; url: string }[]
  );
  const [updateNewImage, setUpdatedNewImage] = useState<string[]>(newImage);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleDeleteNewImage = (index: number) => {
    const listNewImageDeleted = [...updateNewImage];
    listNewImageDeleted.splice(index, 1);
    setUpdatedNewImage(listNewImageDeleted);
    const listNewMediaFilesDeleted = [...updateNewMediaFiles];
    listNewMediaFilesDeleted.splice(index, 1);
    setUpdateNewMediaFiles(listNewMediaFilesDeleted);
    setUpdateNewMediaFiles([...updateNewMediaFiles].splice(index, 1));
  };
  const handleDeleteOldImage = (index: number) => {
    const listOldImageDeleted = [...updateOldImage];
    listOldImageDeleted.splice(index, 1);
    setUpdateOldImage(listOldImageDeleted);
    const oldImageDeleted = updateOldImage[index].id;
    setUpdateImageDel([...updateImageDel, oldImageDeleted]);
  };
  const handleImageEditing = () => {
    setUpdateImageList([...updateOldImage.map(item => item.url), ...updateNewImage]);
    onUpdate(
      [...updateOldImage.map(item => item.url), ...updateNewImage],
      updateNewMediaFiles,
      updateImageDel,
      updateOldImage,
      updateNewImage
    );
    navigation.goBack();
  };
  return (
    <View style={{ backgroundColor: color.white, flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 15,
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          borderBottomColor: color.borderColor,
          borderBottomWidth: 1
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity onPress={handleImageEditing} activeOpacity={0.8}>
            <IconM name='arrow-back' size={26} color={color.textColor} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: color.textColor }}>Chỉnh sửa</Text>
        </View>
        <TouchableOpacity onPress={handleImageEditing} activeOpacity={0.8}>
          <Text style={{ fontSize: 14, color: color.textColor }}>XONG</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {updateOldImage.length > 0 && (
          <View>
            <Text style={{ margin: 10, fontWeight: 'bold', color: color.textColor }}>
              Ảnh đã thêm trước đó
            </Text>
            <View>
              {updateOldImage.map((image, index) => {
                return (
                  <View key={index} style={{ marginBottom: 20 }}>
                    <ImageItem
                      key={index}
                      style={{ height: 500 }}
                      image={image.url}
                      isShowCloseIcon
                      onPress={() => {
                        openModal;
                      }}
                      onPressCloseIcon={() => {
                        handleDeleteOldImage(index);
                      }}
                      index={index}
                    />
                    <PullDownModal visible={modalVisible} onClose={closeModal}>
                      <PostImageDetail image={{ url: image.url }} />
                    </PullDownModal>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        {updateNewImage.length > 0 && (
          <View>
            <Text style={{ margin: 10, fontWeight: 'bold', color: color.textColor }}>Ảnh mới</Text>
            <View>
              {updateNewImage.map((image, index) => {
                return (
                  <View key={index} style={{ marginBottom: 20 }}>
                    <ImageItem
                      key={index}
                      style={{ height: 500 }}
                      image={image}
                      isShowCloseIcon
                      onPress={() => {
                        openModal;
                      }}
                      onPressCloseIcon={() => {
                        handleDeleteNewImage(index);
                      }}
                      index={index}
                    />
                    <PullDownModal visible={modalVisible} onClose={closeModal}>
                      <PostImageDetail image={{ url: image }} />
                    </PullDownModal>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ListImageEditScreen;
