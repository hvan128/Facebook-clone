import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { Avatar, Card, IconButton, Text, TouchableRipple } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import {
  AppNaviagtionName,
  PostNavigationName,
  ProfileNavigationName
} from 'src/common/constants/nameScreen';
import globalStyles from 'src/common/styles/globalStyles';
import { coverTimeToNow } from 'src/utils/dayjs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FontAwesomeICon from 'react-native-vector-icons/FontAwesome';
import { getAvatarUri } from 'src/utils/helper';
import ReportModal from 'src/components/Post/ReportModal';
import PullDownModal from 'src/components/PullDownModal';
import PostImageDetail from './PostImageDetail';
const MAX_LENGTH_CONTENT = 300;

const ListImageDetail = () => {
  const route: RouteProp<PostNavigationType, PostNavigationName.ListImageDetail> = useRoute();
  const { data } = route.params;
  const { described, image, id } = data;
  const content = described;
  const listImage: { id: string; url: string }[] = image;
  const [isShowFullContent, setIsShowFullContent] = useState(true);
  const [displayContent, setDisplayContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isShowImage, setIsShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const showModal = () => {
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
  };
  const showImage = (url: string) => {
    setIsShowImage(true);
    setImageUrl(url);
  };
  const hideImage = () => {
    setIsShowImage(false);
  };

  useEffect(() => {
    if (content) {
      setDisplayContent(content);
      setIsShowFullContent(true);
      if (content.length > MAX_LENGTH_CONTENT) {
        setIsShowFullContent(false);
        setDisplayContent(content?.slice(0, MAX_LENGTH_CONTENT));
      }
    }
  }, [content]);
  const onPressContent = () => {
    if (isShowFullContent && (content?.length as number) > MAX_LENGTH_CONTENT) {
      setIsShowFullContent(displayContent.length === MAX_LENGTH_CONTENT);
      setDisplayContent(content?.slice(0, MAX_LENGTH_CONTENT) as string);
    }
  };
  const handlePressDisplayFullContent = () => {
    setIsShowFullContent(true);
    setDisplayContent(content as string);
  };
  const navigationProfile: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  const handleNavigationProfile = () =>
    navigationProfile.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.Profile,
      params: { user_id: data.author.id }
    });
  return (
    <ScrollView style={{ flex: 1, backgroundColor: color.sureface, marginTop: 8 }}>
      <Card.Title
        title={data.author?.name}
        titleVariant='titleMedium'
        subtitle={
          <View style={[globalStyles.flexRow, globalStyles.centerAlignItem, styles.gap]}>
            <Text variant='bodySmall'>{coverTimeToNow(data.created)}</Text>
            <MaterialIcon name='public' />
          </View>
        }
        left={Adata => (
          <TouchableRipple onPress={handleNavigationProfile}>
            <Avatar.Image {...Adata} source={getAvatarUri(data.author.avatar as string)} />
          </TouchableRipple>
        )}
        right={data => (
          <View style={globalStyles.flexRow}>
            <IconButton {...data} icon='dots-horizontal' onPress={showModal} />
            <IconButton {...data} icon='close-thick' onPress={goBack} />
          </View>
        )}
      />
      {content && (
        <Card.Content style={{ marginBottom: 10 }}>
          <Text onPress={onPressContent}>
            {displayContent}
            {!isShowFullContent && (
              <Text
                style={{ color: color.activeOutlineColor }}
                onPress={handlePressDisplayFullContent}
              >
                ... Xem thêm
              </Text>
            )}
          </Text>
        </Card.Content>
      )}
      <View style={[globalStyles.flexRow, globalStyles.spaceBetweenJustify, styles.padding]}>
        {data.feel && data.feel !== '0' && (
          <View style={[globalStyles.flexRow, globalStyles.centerAlignItem]}>
            <AntdIcon name='like1' size={15} color={color.primary} />
            <Text style={[{ color: color.black }, { marginLeft: 5 }]}>{data?.feel}</Text>
          </View>
        )}
        {((data.comment_mark && data.comment_mark !== '0') || data.numberShares) && (
          <View style={[globalStyles.flexRow, styles.gap]}>
            {data?.comment_mark !== '0' && (
              <Text style={{ color: color.white, fontWeight: 'bold' }}>
                {data?.comment_mark} bình luận
              </Text>
            )}
            {data?.numberShares && (
              <Text style={{ color: color.white, fontWeight: 'bold' }}>
                {data?.numberShares} lượt chia sẻ
              </Text>
            )}
          </View>
        )}
      </View>
      <View style={[globalStyles.flexRow, globalStyles.spaceBetweenJustify, { padding: 5 }]}>
        <TouchableHighlight
          style={[globalStyles.flexRow, styles.padding, styles.gap]}
          underlayColor={color.borderColor}
          onPress={() => {}}
        >
          <>
            <AntdIcon name='like2' size={20} />
            <Text>Thích</Text>
          </>
        </TouchableHighlight>
        <TouchableHighlight
          style={[globalStyles.flexRow, styles.padding, styles.gap]}
          underlayColor={color.borderColor}
          onPress={() => {}}
        >
          <>
            <FontAwesomeICon name='comment-o' size={20} />
            <Text>Bình luận</Text>
          </>
        </TouchableHighlight>
        <TouchableHighlight
          style={[globalStyles.flexRow, styles.padding, styles.gap]}
          underlayColor={color.borderColor}
          onPress={() => {}}
        >
          <>
            <IonIcons name='arrow-redo-outline' size={20} />
            <Text>Chia sẻ</Text>
          </>
        </TouchableHighlight>
      </View>

      {listImage &&
        listImage.length > 0 &&
        listImage.map((item, index) => (
          <View style={styles.borderTop} key={index}>
            <TouchableRipple
              onPress={() => {
                showImage(item.url);
              }}
            >
              <Image source={{ uri: item.url }} style={{ width: '100%', height: 500 }} />
            </TouchableRipple>
            <View style={[globalStyles.flexRow, globalStyles.spaceBetweenJustify, { padding: 5 }]}>
              <TouchableHighlight
                style={[globalStyles.flexRow, styles.padding, styles.gap]}
                underlayColor={color.borderColor}
                onPress={() => {}}
              >
                <>
                  <AntdIcon name='like2' size={20} />
                  <Text>Thích</Text>
                </>
              </TouchableHighlight>
              <TouchableHighlight
                style={[globalStyles.flexRow, styles.padding, styles.gap]}
                underlayColor={color.borderColor}
                onPress={() => {}}
              >
                <>
                  <FontAwesomeICon name='comment-o' size={20} />
                  <Text>Bình luận</Text>
                </>
              </TouchableHighlight>
              <TouchableHighlight
                style={[globalStyles.flexRow, styles.padding, styles.gap]}
                underlayColor={color.borderColor}
                onPress={() => {}}
              >
                <>
                  <IonIcons name='arrow-redo-outline' size={20} />
                  <Text>Chia sẻ</Text>
                </>
              </TouchableHighlight>
            </View>
          </View>
        ))}
      <ReportModal isVisible={modalVisible} onBackdropPress={hideModal} id={id} />
      <PullDownModal visible={isShowImage} onClose={hideImage}>
        <PostImageDetail
          image={{ url: imageUrl as string }}
          author={{
            name: data.author?.name as string,
            avatar: data.author?.avatar as string,
            id: data.author.id
          }}
          created={data.created as Date}
          described={content}
        />
      </PullDownModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  postContainer: { backgroundColor: color.sureface, marginTop: 8 },
  userComments: { marginLeft: 10, paddingTop: 5 },
  userCommentsContent: { marginBottom: 5, gap: 5 },
  padding: { padding: 10 },
  gap: { gap: 10 },
  marginVertical: { marginVertical: 10 },
  borderTop: {
    borderTopWidth: 5,
    borderTopColor: color.borderBottom
  }
});

export default ListImageDetail;
