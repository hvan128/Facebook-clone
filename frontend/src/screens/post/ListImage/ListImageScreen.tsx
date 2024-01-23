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

const ListImageScreen = () => {
  const route: RouteProp<PostNavigationType, PostNavigationName.ListImageScreen> = useRoute();
  const { imageList, mediaFiles, onUpdate } = route.params;
  const [updatedImageList, setUpdatedImageList] = useState<string[]>(imageList);
  const [updatedMediaFiles, setUpdatedMediaFiles] = useState<MediaFileType[]>(mediaFiles);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleDeleteImage = (index: number) => {
    const newImageList = [...updatedImageList];
    newImageList.splice(index, 1);
    setUpdatedImageList(newImageList);
    const newMediaFiles = [...updatedMediaFiles];
    newMediaFiles.splice(index, 1);
    setUpdatedMediaFiles(newMediaFiles);
  };
  const handleImageEditing = () => {
    onUpdate(updatedImageList, updatedMediaFiles);
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
        {updatedImageList.map((image, index) => {
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
                  handleDeleteImage(index);
                }}
                index={index}
              />
              <PullDownModal visible={modalVisible} onClose={closeModal}>
                <PostImageDetail image={{ url: image }} />
              </PullDownModal>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ListImageScreen;
