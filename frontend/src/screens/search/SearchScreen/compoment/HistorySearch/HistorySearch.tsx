import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import BaseFlatList from 'src/components/BaseFlatList';
import { IGetSavedSearch, ISavedSearch } from 'src/interfaces/search.interface';
import { deleteSavedSearchApi, getSaveSearchApi } from 'src/services/search.service';

// import FriendCard from './FriendCard';
interface HistorySearchProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isRefresh: boolean;
  listSavedSearch: ISavedSearch[];
  setListSavedSearch: React.Dispatch<React.SetStateAction<ISavedSearch[]>>;
}
const HistorySearch = (props: HistorySearchProps) => {
  const { openModal, setOpenModal, isRefresh, listSavedSearch, setListSavedSearch } = props;
  const [listAllSavedSearch, setListAllSavedSearch] = useState<ISavedSearch[]>([]);

  useEffect(() => {
    const data: IGetSavedSearch = {
      index: 0,
      count: 20
    };
    const fetchData = async (data: IGetSavedSearch) => {
      try {
        const result = await getSaveSearchApi(data);
        // setTotalRequestFriend(result.data.total);
        setListAllSavedSearch(result.data);
        // setRefreshing(false);
        return result;
      } catch (error) {
        return console.log({ message: 'sever availability' });
      }
    };

    fetchData(data).catch(console.error);
  }, [isRefresh]);

  const handleDeleteSearch = async (IdSearch: number, keyword: any) => {
    const duplicateKeywords = listAllSavedSearch.filter(item => item.keyword === keyword);
    const idArray = duplicateKeywords.map(item => item.id);
    // console.log('duplicateKeywords',idArray)
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

  const handleCancel = () => {
    setOpenModal(false);
  };
  return (
    <View style={styles.container}>
      <Modal
        isVisible={openModal}
        style={styles.container}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        backdropOpacity={0.5}
        onBackdropPress={handleCancel}
      >
        <View style={{ borderBottomColor: color.borderBottom, borderBottomWidth: 2 }}>
          <Text
            style={{
              height: 45,
              color: color.black,
              fontSize: 18,
              fontWeight: 'bold',
              padding: 10,
              textAlign: 'center'
            }}
          >
            Nhật ký hoạt động
          </Text>
        </View>
        <BaseFlatList
          style={{
            marginTop: 20
          }}
          data={listSavedSearch}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.ListSearchResult}>
              <IconButton
                icon='magnify'
                size={25}
                iconColor={color.white}
                containerColor={color.primary}
                style={styles.iconSearch}
              />
              <View style={styles.ListSearchResultText}>
                {/* <Text>{item.username}</Text> */}
                <View
                  style={{
                    display: 'flex',
                    height: 80
                    // marginTop: 10
                  }}
                >
                  <Text
                    style={{
                      color: color.black,
                      fontSize: 15,
                      fontWeight: 'bold'
                    }}
                  >
                    Bạn đã tìm kiếm trên Facebook
                  </Text>
                  <Text>{item.keyword}</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      opacity: 0.7
                    }}
                  >
                    Chỉ mình tôi - đã ẩn khỏi dòng thời gian
                  </Text>
                </View>
              </View>
              <IconButton
                icon='close'
                mode='contained'
                iconColor={color.activeOutlineColor}
                containerColor='#fff'
                size={26}
                // onPress={showModalCover}
                onPress={() => handleDeleteSearch(item.id, item.keyword)}
              />
            </View>
          )}
        />
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    margin: 0,
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: 'white'
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
    // marginTop:20,
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
    // lineHeight: 55,
    color: color.black
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
  iconSearch: {
    marginBottom: 20
  }
});

export default HistorySearch;
