import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { color } from 'src/common/constants/color';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library

function ActionTab() {
  interface CardData {
    id: number;
    emoji: string;
    label: string;
  }

  const data: CardData[] = [
    { id: 1, emoji: '🎉', label: 'Đang ăn mừng ngày đặc biệt' },
    { id: 2, emoji: '🎊', label: 'Đang ăn mừng năm mới' },
    { id: 3, emoji: '🎈', label: 'Đang ăn mừng ngày kỷ niệm' },
    { id: 4, emoji: '🥳', label: 'Đang ăn mừng tiệc tùng' },
    { id: 5, emoji: '🍰', label: 'Đang ăn mừng bánh' },
    { id: 6, emoji: '📺', label: 'Đang xem ti vi' },
    { id: 7, emoji: '🎥', label: 'Đang xem máy quay phim' },
    { id: 8, emoji: '👀', label: 'Đang nhìn' },
    { id: 9, emoji: '🍿', label: 'Đang ăn bỏng ngô' },
    { id: 10, emoji: '🎮', label: 'Đang chơi trò chơi điện tử' },
    { id: 11, emoji: '🎲', label: 'Đang chơi xúc xắc game' },
    { id: 12, emoji: '🏀', label: 'Đang chơi bóng rổ' },
    { id: 13, emoji: '⚽', label: 'Đang chơi bóng đá' },
    { id: 14, emoji: '🎸', label: 'Đang chơi đàn ghi-ta' },
    { id: 15, emoji: '🎧', label: 'Đang nghe tai nghe' },
    { id: 16, emoji: '🎶', label: 'Đang nghe hòa âm' },
    { id: 17, emoji: '🔊', label: 'Đang nghe loa âm thanh cao' },
    { id: 18, emoji: '🎵', label: 'Đang nghe nhạc' },
    { id: 19, emoji: '🍹', label: 'Đang uống nước hoa quả' },
    { id: 20, emoji: '🍺', label: 'Đang uống bia' },
    { id: 21, emoji: '🥤', label: 'Đang uống cốc có ống' },
    { id: 22, emoji: '🍷', label: 'Đang uống ly rượu' },
    { id: 23, emoji: '☕', label: 'Đang uống đồ uống nóng' },
    { id: 24, emoji: '📚', label: 'Đang đọc sách' },
    { id: 25, emoji: '📰', label: 'Đang đọc báo' },
    { id: 26, emoji: '✈️', label: 'Đang đi du lịch máy bay' },
    { id: 27, emoji: '🚗', label: 'Đang đi du lịch ô tô' },
    { id: 28, emoji: '🚢', label: 'Đang đi du lịch tàu thủy' },
    { id: 29, emoji: '🚆', label: 'Đang đi du lịch tàu hỏa' },
    { id: 30, emoji: '🗺️', label: 'Đang đi du lịch thế giới' },
    { id: 31, emoji: '🖥️', label: 'Đang làm việc máy tính để bàn' },
    { id: 32, emoji: '📊', label: 'Đang làm việc phân tích' },
    { id: 33, emoji: '📆', label: 'Đang làm việc lịch rơi' },
    { id: 34, emoji: '💻', label: 'Đang làm việc laptop' }
  ];

  // Continue adding items for the remaining categories as needed

  interface CardProps {
    item: CardData;
  }

  const Card: React.FC<CardProps> = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );
  const navigation: NavigationProp<CreatePostNavigationType> = useNavigation();

  const handleChooseEmoji = (data: CardData) => {
    navigation.navigate('CreatePostScreen', { selectedItem: data });
  };

  const [search, setSearch] = useState('');
  const filteredData = data.filter(item => {
    return item.label.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name='search' size={20} color='grey' style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder='Tìm kiếm...'
          onChangeText={text => setSearch(text)}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => handleChooseEmoji(item)} style={{ flex: 1 }}>
              <Card item={item} />
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: color.borderBottom,
    borderBottomWidth: 1,
    borderRightColor: color.borderBottom,
    borderRightWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  emoji: {
    fontSize: 24,
    marginRight: 15
  },
  label: {
    fontSize: 15,
    color: color.textColor,
    marginRight: 25
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.borderBottom
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    height: 40
  }
});

export default ActionTab;
