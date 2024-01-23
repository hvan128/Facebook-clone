import { View, Text, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';
import styles from './styles';
import { ActivityIndicator, Appbar, Divider, IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import HistorySearch from './compoment/HistorySearch';
import { IGetSavedSearch, ISavedSearch, ISearch } from 'src/interfaces/search.interface';
import {
  getSaveSearchApi,
  deleteSavedSearchApi,
  searchApi,
  searchUserAPi,
  ISearchUserItem
} from 'src/services/search.service';
import BaseFlatList from 'src/components/BaseFlatList';
import Post from 'src/components/Post';
import NetInfo from '@react-native-community/netinfo';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import BaseFlatListSearch from 'src/components/BaseFlatListSearch';
import UserItem from 'src/screens/setting/SearchUserScreen/components/UserItem';
import { AppNaviagtionName, ProfileNavigationName } from 'src/common/constants/nameScreen';
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
function SearchScreen() {
  const ListTab = {
    POST: 'Bài viết',
    USER: 'Mọi người'
  };
  const COUNT_ITEM = 10;
  const [openModalHistorySearch, setOpenModalHistorySearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);
  const [isRefreshSaveSearch, setIsRefreshSaveSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listSearch, setListSearch] = useState<ISearchResult[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isLoadingFirstApi, setIsLoadingFirstAPi] = useState<boolean>(false);
  const [isLoadingFirstApiListSaveSearch, setIsLoadingFirstAPiListSaveSearch] =
    useState<boolean>(true);
  const [tab, setTab] = useState(ListTab.POST);
  const [data, setData] = useState<ISearchUserItem[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const [skipPost, setSkipPost] = useState<number>(0);
  const [isNextFetch, setIsNextFetch] = useState<boolean>(true);
  const [isNextFetchPost, setIsNextFetchPost] = useState<boolean>(true);
  const [isNextSearch, setIsNextSearch] = useState<boolean>(false);
  const [isNextSearchPost, setIsNextSearchPost] = useState<boolean>(false);
  const navigation = useNavigation();
  const navigationProfile: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();

  // const [onSearch, setOnSearch] = useState(false)
  // const handleOpenCommentTab = () => {
  //   setOpenModal(true);
  // };
  const handleNavigationProfile = (id: string) =>
    navigationProfile.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.Profile,
      params: { user_id: id }
    });
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // `state.isConnected` sẽ là `true` nếu có kết nối mạng và `false` nếu không có
      setIsConnected(state.isConnected);
    });

    // Clear event listener khi component bị unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  const _goBack = () => navigation.goBack();

  const handleTextChange = (e: any) => {
    setSearchText(e);
    setCurrentIndex(0);
  };

  const handleSearch = async (index: any, keyword: any) => {
    Keyboard.dismiss();

    setIsRefreshSaveSearch(!isRefreshSaveSearch);
    setIsLoadingFirstAPi(true);
    setIsSearching(true);
    setTimeout(() => {
      setIsLoadingFirstAPi(false);
    }, 500);
    // setListSavedSearch([keyword, ...listSavedSearch])
    const data: ISearch = {
      keyword: keyword,
      user_id: null,
      index: index,
      count: COUNT_ITEM
    };

    try {
      const result = await searchApi(data);
      if (result.success) {
        const response = result.data;
        const searchResult: any = [];
        if (!response.length) {
          setIsNextFetchPost(false);
          setListSearch([]);
          return;
        }
        response.forEach(item => {
          const newData = {
            ...item // Sao chép tất cả các trường từ data cũ
            //image: item.image.map((imageObj: any) => imageObj.url) // Thay đổi trường image thành mảng các URL
          };
          searchResult.push(newData);
        });

        setListSearch(searchResult);
        setIsNextFetchPost(true);
        setSkipPost(COUNT_ITEM);
      }
      const res = await searchUserAPi({ keyword: searchText, index: 0, count: COUNT_ITEM });
      if (res.success) {
        if (!res.data.length) {
          setIsNextFetch(false);

          return;
        }
        setData(res.data);
        setIsNextFetch(true);
        setSkip(COUNT_ITEM);
      }

      // setCurrentIndex(0)
    } catch (error) {
      return console.log({ message: 'sever availability' });
    }
  };

  async function onEndReadable() {
    if (searchText !== '' && isNextFetch) {
      try {
        setIsNextSearch(true);
        setSkip(skip => skip + COUNT_ITEM);
        const res = await searchUserAPi({ keyword: searchText, index: skip, count: COUNT_ITEM });
        if (res.success) {
          if (!res.data.length) {
            setIsNextFetch(false);
            return;
          }
          setData(data => [...data, ...res.data]);
        }
      } catch (e) {
        setSkip(skip => skip - COUNT_ITEM);
        return;
      } finally {
        setIsNextSearch(false);
      }
    }
  }

  async function onEndReadablePost() {
    if (searchText !== '' && isNextFetchPost) {
      try {
        setIsNextSearchPost(true);
        setSkipPost(skipPost => skipPost + COUNT_ITEM);
        const res = await searchApi({
          keyword: searchText,
          user_id: null,
          index: skipPost,
          count: COUNT_ITEM
        });
        if (res.success) {
          if (!res.data.length) {
            setIsNextFetchPost(false);
            return;
          }
          const response = res.data;
          const searchResult: any = [];
          response.forEach(item => {
            const newData = {
              ...item // Sao chép tất cả các trường từ data cũ
              //image: item.image.map((imageObj: any) => imageObj.url) // Thay đổi trường image thành mảng các URL
            };
            searchResult.push(newData);
          });

          setListSearch(listSearch => [...listSearch, ...searchResult]);
        }
      } catch (e) {
        setSkipPost(skipPost => skipPost - COUNT_ITEM);
        return;
      } finally {
        setIsNextSearchPost(false);
      }
    }
  }
  // const onEndReadable = async () => {
  //   try {
  //     const result = await searchApi(
  //       {
  //         keyword: searchText,
  //         user_id: null,
  //         index: currentIndex + 20,
  //         count: 20,

  //       });
  //     if (result.success) {
  //       const response = result.data
  //       let searchResult: any = []
  //       response.forEach(item => {
  //         const newData = {
  //           ...item,  // Sao chép tất cả các trường từ data cũ
  //           image: item.image.map((imageObj: any) => imageObj.url),  // Thay đổi trường image thành mảng các URL
  //         };
  //         searchResult.push(newData)
  //       })
  //       setListSearch([...listSearch, searchResult])
  //       setCurrentIndex(skip => skip + 20);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  // const fetchMoreResult =() =>{
  //   handleSearch(currentIndex+20)
  //   setCurrentIndex(currentIndex+20)
  // }
  // const fetchMorePosts = async () => {
  //   // Gọi API để lấy thêm 20 bài post tiếp theo
  //   const morePosts = await fetchMoreData();

  //   // Cập nhật state để hiển thị toàn bộ danh sách
  //   setPosts([...posts, ...morePosts]);
  //   setCurrentIndex(currentIndex + 20);
  // };

  // const _handleMore = () => console.log('Shown more');
  useEffect(() => {
    if (searchText == '') {
      setIsSearching(false);
    }
  }, [searchText]);

  const handleTextClear = () => {
    setSearchText('');
  };
  const [listSavedSearch, setListSavedSearch] = useState<ISavedSearch[]>([]);
  const [listAllSavedSearch, setListAllSavedSearch] = useState<ISavedSearch[]>([]);
  useEffect(() => {
    const data: IGetSavedSearch = {
      index: 0,
      count: 30
    };

    const fetchData = async (data: IGetSavedSearch) => {
      setTimeout(() => {
        setIsLoadingFirstAPiListSaveSearch(false);
      }, 1000);
      try {
        const listResult: any[] = [];
        const result = await getSaveSearchApi(data);
        setListAllSavedSearch(result.data);
        for (let i = 0; i < result.data.length; i++) {
          const currentItem = result.data[i];
          const exist = listResult.some(item => item.keyword === currentItem.keyword);
          if (!exist && listResult.length < 20) {
            listResult.push(currentItem);
          }
        }

        setListSavedSearch(listResult);
      } catch (error) {
        return console.log({ message: 'sever availability' });
      }
    };

    fetchData(data).catch(console.error);
  }, [isRefreshSaveSearch, isSearching]);

  const handleDeleteSearch = async (IdSearch: number, keyword: any) => {
    const duplicateKeywords = listAllSavedSearch.filter(item => item.keyword === keyword);
    const idArray = duplicateKeywords.map(item => item.id);
    // console.log('duplicateKeywords',idArray)
    setIsRefresh(!isRefresh);
    const updatedList = listSavedSearch.filter(item => item.id !== IdSearch);
    setListSavedSearch(updatedList);
    let currentIndex = 0;
    const deleteSearchWithInterval = async () => {
      const id = idArray[currentIndex];

      try {
        // Gọi API để xóa đối tượng từ server
        await deleteSavedSearchApi({ search_id: id, all: 0 });
      } catch (error) {
        console.log(error);
      }
      // Chuyển sang phần tử tiếp theo trong mảng
      currentIndex++;
      // Nếu đã xử lý hết mọi phần tử trong mảng, dừng vòng lặp
      if (currentIndex === idArray.length) {
        clearInterval(intervalId);

        // Xóa đối tượng cụ thể từ listSavedSearch
      }
    };

    // Chuyển sang phần tử tiếp theo trong mảng
    const intervalId = setInterval(deleteSearchWithInterval, 100);
    // Nếu đã xử lý hết mọi phần tử trong mảng, dừng vòng lặ
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: color.white }}>
        <Appbar.BackAction onPress={_goBack} />
        {/* <Appbar.Content title='Title' /> */}
        <View>
          <TextInput
            placeholder='Tìm kiếm'
            clearButtonMode='always'
            onChangeText={handleTextChange}
            value={searchText}
            style={{
              height: 40,
              width: 250,
              borderRadius: 50,
              backgroundColor: color.backgroundColor,
              paddingLeft: 20
            }}
          />
          {searchText !== '' && (
            <IconButton
              icon='close'
              size={25}
              iconColor={color.black}
              style={styles.clearButton}
              onPress={handleTextClear}
            />
          )}
        </View>
        <Appbar.Action icon='magnify' onPress={() => handleSearch(currentIndex, searchText)} />
        {/* <Appbar.Action icon='dots-vertical' onPress={_handleMore} /> */}
      </Appbar.Header>
      <View style={styles.container}>
        {isSearching && searchText !== '' ? (
          <View style={styles.headerSearchresult}>
            <Text style={styles.All}>Tất cả</Text>
            <Text
              style={tab === ListTab.POST ? styles.post : styles.All}
              onPress={() => {
                setTab(ListTab.POST);
                setIsLoadingFirstAPi(true);
                setTimeout(() => {
                  setIsLoadingFirstAPi(false);
                }, 300);
              }}
            >
              Bài viết
            </Text>
            <Text
              style={tab === ListTab.USER ? styles.post : styles.All}
              onPress={() => {
                setTab(ListTab.USER);
                setIsLoadingFirstAPi(true);
                setTimeout(() => {
                  setIsLoadingFirstAPi(false);
                }, 300);
              }}
            >
              Mọi người
            </Text>
            <Text style={styles.All}>Nhóm</Text>
            <Text style={styles.All}>Reals</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.nearlyall}
              // onPress={navigateEditProfileScreen}
            >
              <Text style={styles.nearly}>Tìm kiếm gần đây</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.nearlyall}
              // onPress={navigateEditProfileScreen}
              onPress={() => {
                setOpenModalHistorySearch(true);
              }}
            >
              <Text style={styles.seeall}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
        )}
        <Divider style={{ marginTop: 10 }} bold />

        <View style={styles.section}>
          <View style={styles.containers}>
            {isSearching && searchText !== '' ? (
              // Hiển thị data.data khi searchText khác rỗng
              isConnected ? (
                isLoadingFirstApi ? (
                  <ActivityIndicator
                    color={color.activeOutlineColor}
                    style={{ marginTop: '50%' }}
                  />
                ) : tab == ListTab.POST ? (
                  <BaseFlatListSearch
                    data={listSearch}
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
                    isFootterLoading={isNextSearchPost}
                    onEndReached={onEndReadablePost}
                    onEndReachedThreshold={0.001}
                  />
                ) : (
                  <BaseFlatList
                    ListEmptyComponent={
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <IconButton icon='account-off' size={100} iconColor={color.borderColor} />
                        <Text style={{ color: color.borderColor }}>Không tìm thấy người dùng</Text>
                      </View>
                    }
                    data={data}
                    keyExtractor={item => item.id}
                    refreshing={false}
                    renderItem={({ item }) => (
                      <>
                        <UserItem
                          title={item.username}
                          avatar={item.avatar}
                          id={item.id}
                          onPress={() => {
                            handleNavigationProfile(item.id);
                          }}
                          // onPress={() => onPressUser(item)}
                        />
                        <Divider />
                      </>
                    )}
                    isFootterLoading={isNextSearch}
                    onEndReached={onEndReadable}
                    onEndReachedThreshold={0.001}
                  />
                )
              ) : (
                // Handle the case when isConnected is false
                <>
                  <Text>Không có kết nối mạng</Text>
                </>
              )
            ) : (
              // Hiển thị HistorySearch khi searchText có giá trị
              <>
                {isLoadingFirstApiListSaveSearch ? (
                  <ActivityIndicator
                    color={color.activeOutlineColor}
                    style={{ marginTop: '50%' }}
                  />
                ) : listSavedSearch.length === 0 ? (
                  // Hiển thị dòng text không có tìm kiếm nào gần đây
                  <Text style={styles.noSearchText}>Không có tìm kiếm nào gần đây</Text>
                ) : (
                  // Hiển thị danh sách lưu trữ tìm kiếm
                  listSavedSearch.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.allFriendBtn}
                      activeOpacity={0.5}
                      onPress={() => {
                        setSearchText(item.keyword);
                        setTimeout(() => {
                          handleSearch(currentIndex, item.keyword);
                        }, 300);
                      }}
                    >
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
                          onPress={() => handleDeleteSearch(item.id, item.keyword)}
                        />
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </>
            )}
          </View>
        </View>
        <HistorySearch
          openModal={openModalHistorySearch}
          setOpenModal={setOpenModalHistorySearch}
          isRefresh={isRefresh}
          listSavedSearch={listSavedSearch}
          setListSavedSearch={setListSavedSearch}
        />
      </View>
    </>
  );
}

export default SearchScreen;
