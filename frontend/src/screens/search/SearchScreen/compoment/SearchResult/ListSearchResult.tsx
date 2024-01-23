import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import BaseFlatList from 'src/components/BaseFlatList';
import { useEffect, useState } from 'react';
import Post from 'src/components/Post';
import { IGetSavedSearch, ISavedSearch } from 'src/interfaces/search.interface';
import { getSaveSearchApi } from 'src/services/search.service';
// import FriendCard from './FriendCard';
interface ListSearchResultProps {
  searchText: string;
}
export interface ISearchResult {
  id: string;
  name: string;
  image: any;
  video: any;
  described: any;
  created: any;
  feel: any;
  mark_comment: any;
  is_felt: any;
  state: any;
  author: any;
}
const ListSearchResult = (props: ListSearchResultProps) => {
  const [listSavedSearch, setListSavedSearch] = useState<ISavedSearch[]>([]);
  useEffect(() => {
    const data: IGetSavedSearch = {
      index: 0,
      count: 20
    };
    const fetchData = async (data: IGetSavedSearch) => {
      try {
        const result = await getSaveSearchApi(data);
        // setTotalRequestFriend(result.data.total);
        setListSavedSearch(result.data);
        // setRefreshing(false);

        return result;
      } catch (error) {
        return console.log({ message: 'sever availability' });
      }
    };

    fetchData(data).catch(console.error);
  }, []);

  const [data, setdata] = useState<any[]>([]);
  setTimeout(() => {
    setdata(data => [...data]);
  }, 2000);

  return (
    <View style={styles.container}>
      {props.searchText !== '' ? (
        // Hiển thị data.data khi searchText khác rỗng
        <BaseFlatList
          data={data}
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
              status={item.status}
            />
          )}
          keyExtractor={item => item.id}
          // onRefresh={onRefresh}
          // refreshing={refreshing}
        />
      ) : (
        // Hiển thị HistorySearch khi searchText có giá trị
        <>
          {listSavedSearch.length === 0 ? (
            // Hiển thị dòng text không có tìm kiếm nào gần đây
            <Text style={styles.noSearchText}>Không có tìm kiếm nào gần đây</Text>
          ) : (
            // Hiển thị danh sách lưu trữ tìm kiếm
            listSavedSearch.map(item => (
              <TouchableOpacity key={item.id} style={styles.allFriendBtn} activeOpacity={0.5}>
                <View key={item.id} style={styles.ListSearchResult}>
                  <View style={styles.ListSearchResultText}>
                    <IconButton
                      icon='clock-outline'
                      size={25}
                      iconColor={color.activeOutlineColor}
                    />
                    <Text style={styles.username}>{item.keyword}</Text>
                  </View>
                  <IconButton
                    icon='close'
                    mode='contained'
                    iconColor='#4b4c4f'
                    containerColor='#fff'
                    size={26}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
    // padding: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  image: {
    height: 40,
    width: 40
  },

  ListSearchResult: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ListSearchResultText: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  username: {
    lineHeight: 55,
    color: color.black,
    marginBottom: 2
  },
  searchFriend: {
    padding: 8
  },
  allFriendBtn: {
    marginHorizontal: 10
    // backgroundColor: '#E9F1FE',
    // padding: 10,
    // borderRadius: 7
  },
  noSearchText: {
    marginLeft: 10,
    marginTop: 10
  }
});

export default ListSearchResult;
