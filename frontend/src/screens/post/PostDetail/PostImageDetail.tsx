import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';
import globalStyles from 'src/common/styles/globalStyles';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FontAwesomeICon from 'react-native-vector-icons/FontAwesome';
import { Avatar, Card, TouchableRipple } from 'react-native-paper';
import { formatDate, getAvatarUri } from 'src/utils/helper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNaviagtionName, ProfileNavigationName } from 'src/common/constants/nameScreen';
const MAX_LENGTH_CONTENT = 50;

type PostImageDetailProps = {
  image: {
    id?: string;
    url: string;
  };
  video?: {
    url: string;
    thumb: string;
  };
  described?: string;
  created?: Date | string;
  feel?: string;
  comment_mark?: string;
  is_felt?: string;
  is_blocked?: string;
  can_edit?: string;
  banned?: string;
  status?: string;
  author?: {
    id: string;
    name: string;
    avatar: string;
  };
  numberShares?: number;
};
const PostImageDetail = (props: PostImageDetailProps) => {
  const [isShowFullContent, setIsShowFullContent] = useState(true);
  const [displayContent, setDisplayContent] = useState('');
  const content = props.described;
  const [click, setClick] = useState(false);
  const authorId = props.author?.id;
  const navigationProfile: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();

  const handleNavigationProfile = () =>
    navigationProfile.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.Profile,
      params: { user_id: authorId as string }
    });
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

  return (
    <View style={{ flex: 1, backgroundColor: color.black }}>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1
        }}
        onPress={() => setClick(!click)}
      >
        <Image
          style={{ flex: 1 }}
          resizeMode='contain'
          source={{
            uri: props.image.url
          }}
        />
      </TouchableOpacity>

      <View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: color.blackOpacity
          },
          click ? { opacity: 0 } : {}
        ]}
      >
        <Card.Title
          title={props.author?.name}
          titleStyle={{ color: color.white, fontSize: 16, fontWeight: 'bold' }}
          titleVariant='titleMedium'
          subtitle={
            <View style={[globalStyles.flexRow, globalStyles.centerAlignItem, styles.gap]}>
              <Text style={{ color: color.sureface, fontSize: 12 }}>
                {formatDate(props.created as string)}
              </Text>
              <MaterialIcon name='public' size={15} color={color.primary} />
            </View>
          }
          left={Aprops => (
            <TouchableRipple onPress={handleNavigationProfile}>
              <Avatar.Image
                {...Aprops}
                source={getAvatarUri(props?.author ? props?.author.avatar : '')}
              />
            </TouchableRipple>
          )}
        />
        {content && (
          <Card.Content style={{ marginBottom: 10 }}>
            <Text onPress={onPressContent} style={{ color: color.white }}>
              {displayContent}
              {!isShowFullContent && (
                <Text
                  style={{ color: color.white, fontWeight: 'bold' }}
                  onPress={handlePressDisplayFullContent}
                >
                  ... Xem thêm
                </Text>
              )}
            </Text>
          </Card.Content>
        )}
        <View style={[globalStyles.flexRow, globalStyles.spaceBetweenJustify, styles.padding]}>
          {props.feel && props.feel !== '0' && (
            <View style={[globalStyles.flexRow, globalStyles.centerAlignItem]}>
              <AntdIcon name='like1' size={15} color={color.primary} />
              <Text style={[{ color: color.white, fontWeight: 'bold' }, { marginLeft: 5 }]}>
                {props?.feel}
              </Text>
            </View>
          )}
          {((props.comment_mark && props.comment_mark !== '0') || props.numberShares) && (
            <View style={[globalStyles.flexRow, styles.gap]}>
              {props?.comment_mark !== '0' && (
                <Text style={{ color: color.white, fontWeight: 'bold' }}>
                  {props?.comment_mark} bình luận
                </Text>
              )}
              {props?.numberShares && (
                <Text style={{ color: color.white, fontWeight: 'bold' }}>
                  {props?.numberShares} lượt chia sẻ
                </Text>
              )}
            </View>
          )}
        </View>
        <View style={[globalStyles.flexRow, globalStyles.spaceBetweenJustify, styles.borderTop]}>
          <TouchableHighlight
            style={[globalStyles.flexRow, styles.padding, styles.gap]}
            underlayColor={color.borderColor}
            onPress={() => {}}
          >
            <>
              <AntdIcon name='like2' size={20} color={color.white} />
              <Text style={styles.text}>Thích</Text>
            </>
          </TouchableHighlight>
          <TouchableHighlight
            style={[globalStyles.flexRow, styles.padding, styles.gap]}
            underlayColor={color.borderColor}
            onPress={() => {}}
          >
            <>
              <FontAwesomeICon name='comment-o' size={20} color={color.white} />
              <Text style={styles.text}>Bình luận</Text>
            </>
          </TouchableHighlight>
          <TouchableHighlight
            style={[globalStyles.flexRow, styles.padding, styles.gap]}
            underlayColor={color.borderColor}
            onPress={() => {}}
          >
            <>
              <IonIcons name='arrow-redo-outline' size={20} color={color.white} />
              <Text style={styles.text}>Chia sẻ</Text>
            </>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  postContainer: { backgroundColor: color.sureface, marginTop: 8 },
  userComments: { marginLeft: 10, paddingTop: 5 },
  userCommentsContent: { marginBottom: 5, gap: 5 },
  padding: { padding: 15 },
  gap: { gap: 10 },
  text: { color: color.white, fontSize: 16 },
  marginVertical: { marginVertical: 10 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: color.borderBottom
  }
});

export default PostImageDetail;
