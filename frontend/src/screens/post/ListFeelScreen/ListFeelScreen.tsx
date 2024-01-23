import { Text, View, TouchableHighlight } from 'react-native';
import { ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import { color } from 'src/common/constants/color';
import BaseFlatList from 'src/components/BaseFlatList';
import { getAvatarUri } from 'src/utils/helper';
import { styles } from './styles';
import { useCallback, useEffect, useState } from 'react';
import { IListFeels } from 'src/interfaces/comments.interface';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  AppNaviagtionName,
  PostNavigationName,
  ProfileNavigationName
} from 'src/common/constants/nameScreen';
import { getListFeelsApi } from 'src/services/comment.service';

function ListFeelScreen() {
  const navigationProfile: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();
  const route: RouteProp<PostNavigationType, PostNavigationName.ListFeelScreen> = useRoute();
  const { postId } = route.params;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listFeels, setListFeels] = useState<IListFeels[]>([]);
  const [totalFeel, setTotalFeel] = useState(0);
  const [kudosFeel, setKudosFeel] = useState(0);
  const handleNavigationProfile = (id: string) =>
    navigationProfile.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.Profile,
      params: { user_id: id }
    });
  const getListFeel = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getListFeelsApi({
        id: postId,
        index: 0,
        count: 100
      });
      if (result.success) {
        if (!result.data.length) {
          return;
        } else {
          const listFeel = result.data;
          setTotalFeel(result.data.length);
          // console.log('listFeel', listFeel)
          const kudosFeel = listFeel.filter((feel: any) => feel.feel.type == 1);
          setKudosFeel(kudosFeel.length);
          // console.log('kudosFeel', kudosFeel)
          setListFeels(result.data);
        }
      }
    } catch (error) {
      return console.log({ message: 'sever availability' });
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    getListFeel();
  }, [getListFeel]);
  return isLoading ? (
    <ActivityIndicator color={color.borderColor} style={{ marginTop: '50%' }} />
  ) : (
    <>
      <View style={styles.ListFeel}>
        <Text> Tất cả {String(totalFeel)}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          <AntdIcon name='like1' size={13} style={styles.likeIcon} />
          <Text>{String(kudosFeel)}</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          <AntdIcon name='dislike1' size={13} style={styles.dislikeIcon} />
          <Text> {String(totalFeel - kudosFeel)}</Text>
        </View>
      </View>

      <Divider />
      <View style={{ paddingTop: 20, paddingLeft: 10 }}>
        <BaseFlatList
          data={listFeels}
          renderItem={({ item }) => (
            <>
              <TouchableHighlight
                style={styles.CommentItem}
                underlayColor={color.Comment}
                onPress={() => {
                  handleNavigationProfile(item.feel.user.id);
                }}
              >
                <View style={styles.top}>
                  <TouchableHighlight
                    // activeOpacity={0.8}
                    // underlayColor={color.borderColor}
                    onPress={() => {}}
                    style={styles.touchableHighlight}
                    underlayColor={color.Comment}
                  >
                    <>
                      <View>
                        <Avatar.Image
                          source={getAvatarUri(item.feel.user.avatar)}
                          size={40}
                          style={styles.avatarImage}
                        />
                      </View>
                    </>
                  </TouchableHighlight>
                  <View style={{ position: 'absolute', top: 20, left: 30 }}>
                    {item.feel.type == '1' ? (
                      <View>
                        <AntdIcon name='like1' size={13} style={styles.likeIconFeel} />
                      </View>
                    ) : (
                      <View>
                        <AntdIcon name='dislike1' size={13} style={styles.dislikeIconFeel} />
                      </View>
                    )}
                  </View>
                  <View style={styles.ContentNameFeel}>
                    <Text style={styles.TextNameFeel}>{item.feel.user.name}</Text>

                    {/* <Text style={styles.TextCommment}>{item.mark_content}</Text> */}
                  </View>
                </View>
              </TouchableHighlight>
            </>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </>
  );
}

export default ListFeelScreen;
