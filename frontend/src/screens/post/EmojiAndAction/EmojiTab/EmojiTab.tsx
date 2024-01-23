import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { color } from 'src/common/constants/color';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library

function EmojiTab() {
  interface CardData {
    id: number;
    emoji: string;
    label: string;
  }

  const data: CardData[] = [
    { id: 1, emoji: '😊', label: 'Hạnh phúc' },
    { id: 2, emoji: '😢', label: 'Buồn bã' },
    { id: 3, emoji: '😍', label: 'Hồn nhiên' },
    { id: 4, emoji: '😎', label: 'Phong cách' },
    { id: 5, emoji: '🥳', label: 'Vui mừng' },
    { id: 6, emoji: '🤔', label: 'Nghi ngờ' },
    { id: 7, emoji: '🚀', label: 'Phiêu lưu' },
    { id: 8, emoji: '🌈', label: 'Màu sắc' },
    { id: 9, emoji: '💖', label: 'Tình yêu' },
    { id: 10, emoji: '🎉', label: 'Chúc mừng' },
    { id: 11, emoji: '👍', label: 'Tốt lắm' },
    { id: 12, emoji: '🌟', label: 'Nổi bật' },
    { id: 13, emoji: '🔥', label: 'Nóng bỏng' },
    { id: 14, emoji: '🌺', label: 'Hoa đẹp' },
    { id: 15, emoji: '🍕', label: 'Pizza time!' },
    { id: 16, emoji: '🎈', label: 'Bong bóng' },
    { id: 17, emoji: '🍦', label: 'Kem ngon' },
    { id: 18, emoji: '🎸', label: 'Âm nhạc' },
    { id: 19, emoji: '🏆', label: 'Vô địch' },
    { id: 20, emoji: '🍓', label: 'Dễ thương' },
    { id: 21, emoji: '😃', label: 'Tươi vui' },
    { id: 22, emoji: '😂', label: 'Cười nghiêng ngả' },
    { id: 23, emoji: '😇', label: 'Thánh thiện' },
    { id: 24, emoji: '😋', label: 'Ngon miệng' },
    { id: 25, emoji: '😷', label: 'Đeo khẩu trang' },
    { id: 26, emoji: '🤩', label: 'Quá tuyệt' },
    { id: 27, emoji: '😏', label: 'Cười tinh nghịch' },
    { id: 28, emoji: '🤯', label: 'Sốc' },
    { id: 29, emoji: '🥺', label: 'Làm ơn' },
    { id: 30, emoji: '🤗', label: 'Chia sẻ tình thương' },
    { id: 31, emoji: '😴', label: 'Buồn ngủ' },
    { id: 32, emoji: '🙄', label: 'Chán chường' },
    { id: 33, emoji: '😜', label: 'Ngộ nghĩnh' },
    { id: 34, emoji: '🤓', label: 'Nerd' },
    { id: 35, emoji: '🥴', label: 'Say xỉn' },
    { id: 36, emoji: '😖', label: 'Buồn phiền' },
    { id: 37, emoji: '😳', label: 'Ngượng ngùng' },
    { id: 38, emoji: '🤮', label: 'Buồn nôn' },
    { id: 39, emoji: '🤥', label: 'Nói dối' },
    { id: 40, emoji: '🤫', label: 'Giữ bí mật' },
    { id: 41, emoji: '🥱', label: 'Buồn ngủ' },
    { id: 42, emoji: '🙃', label: 'Ngược đời' },
    { id: 43, emoji: '😵', label: 'Chóng mặt' },
    { id: 44, emoji: '🤬', label: 'Tức giận' },
    { id: 45, emoji: '🤔', label: 'Suy nghĩ' },
    { id: 46, emoji: '🤭', label: 'Nhăn răng' },
    { id: 47, emoji: '🤕', label: 'Đau đớn' },
    { id: 48, emoji: '🥶', label: 'Lạnh lẽo' },
    { id: 49, emoji: '😶', label: 'Im lặng' },
    { id: 50, emoji: '🤣', label: 'Cười sặc sụa' }
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
  const navigation: NavigationProp<PostNavigationType> = useNavigation();

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

export default EmojiTab;
