import { View } from 'react-native';
import Post from 'src/components/Post';

import { IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import BaseFlatList from 'src/components/BaseFlatList';
import { useScrollToTop } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { getListVideos, getNextListVideos, selectVideo } from 'src/redux/slices/videoSlice';
import globalStyles from 'src/common/styles/globalStyles';
const COUNT_ITEM = 5;

function VideoTab() {
  // video api
  const dispatch = useAppDispatch();
  const [skip, setSkip] = useState<number>(0);

  const videoStore = useAppSelector(selectVideo);

  const [refreshing, setrefreshing] = useState(false);
  const onRefresh = async () => {
    setrefreshing(true);
    const skips = Math.floor(Math.random() * (videoStore.videos.length ?? 1));
    dispatch(getListVideos({ index: skips, count: COUNT_ITEM }));
    setSkip(skips + COUNT_ITEM);
    setrefreshing(false);
  };

  async function onEndReadable() {
    if (videoStore.isNextFetch) {
      dispatch(getNextListVideos({ index: skip, count: COUNT_ITEM }));
      setSkip(skip => skip + COUNT_ITEM);
    }
  }

  useEffect(() => {
    dispatch(getListVideos({ index: 0, count: COUNT_ITEM }));
    setSkip(skip => skip + COUNT_ITEM);
  }, [dispatch]);

  //scroll to top
  const ref = useRef(null);
  useScrollToTop(ref);

  return (
    <SafeAreaView>
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.spaceBetweenJustify,
          globalStyles.centerAlignItem
        ]}
      >
        <Text style={styles.menuTitle}>Videos</Text>
        <IconButton icon='magnify' size={25} />
      </View>
      <BaseFlatList
        ref={ref}
        data={videoStore.videos}
        renderItem={({ item }) => (
          <Post
            id={item.id}
            author={item.author}
            created={item.created}
            comment_mark={item.comment_mark}
            described={item.described}
            image={item.image}
            video={item.video}
            name={item.name}
            feel={item.feel}
            numberShares={item.numberShares}
            banned={item.banned}
            can_edit={item.can_edit}
            is_blocked={item.is_blocked}
            is_felt={item.is_felt}
            status={item.state}
          />
        )}
        keyExtractor={item => item.id}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReadable}
        onEndReachedThreshold={0.01}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row', justifyContent: 'space-between' },
  menuTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 20 }
});

export default VideoTab;
