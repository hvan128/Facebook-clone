import { Appbar, IconButton } from 'react-native-paper';
import { color } from 'src/common/constants/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFont from 'react-native-vector-icons/FontAwesome6';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import {
  AddMoneyNavigationName,
  AppNaviagtionName,
  ChatNavigationName,
  SearchNavigationName
} from 'src/common/constants/nameScreen';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { selectFriend } from 'src/redux/slices/friendSlice';
import database from '@react-native-firebase/database';
import { formatNumber } from 'src/utils/helper';

function Header() {
  const listfriends = useSelector(selectFriend);
  const friends = listfriends.friends?.friends;

  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.SearchNavigation> =
    useNavigation();
  const navigationChatScreen: NavigationProp<AppNavigationType, AppNaviagtionName.ChatNavigation> =
    useNavigation();
  const navigationAddMoney: NavigationProp<AppNavigationType> = useNavigation();

  const [click, setClick] = useState(false);
  const navigaSearchTab = () =>
    navigation.navigate(AppNaviagtionName.SearchNavigation, {
      screen: SearchNavigationName.SearchScreen
    });
  const auth = useAppSelector(selectAuth);

  const createChatList = () => {
    friends?.forEach(friend => {
      const roomId = Number(auth.user?.id) + Number(friend.id);
      console.log(roomId);
      const myData = {
        roomId: roomId,
        name: friend.username,
        avatar: friend.avatar,
        user_id: friend.id,
        lastMsg: ' '
      };

      database()
        .ref('/chatlistt/' + auth.user?.id + '/' + friend.id)
        .update(myData)
        .then(() => console.log('Data updated'));

      database()
        .ref('/chatlistt/' + friend.id + '/' + auth.user?.id)
        .update(friend)
        .then(() => console.log('Data updated'));
    });
  };

  const handleNaviagtionChatScreen = () => {
    navigationChatScreen.navigate(AppNaviagtionName.ChatNavigation, {
      screen: ChatNavigationName.InboxScreen
    });
    createChatList();
  };
  const onPressAddMoney = () =>
    navigationAddMoney.navigate(AppNaviagtionName.AddMoneyNavigation, {
      screen: AddMoneyNavigationName.AddMoneyScreen
    });

  const coins = auth.user?.coins;

  return (
    <Appbar.Header style={{ height: 40, marginTop: 8 }}>
      <Appbar.Content
        title='facebook'
        color={color.primary}
        titleStyle={{ fontWeight: 'bold', fontSize: 28 }}
      />

      <IconButton
        mode='contained'
        icon={() => <IconFont name='coins' color={color.iconButtonColor} size={20} />}
        containerColor={color.iconButtonBackgroundColor}
        size={25}
        onPress={() => setClick(!click)}
        style={click && { display: 'none' }}
      />
      <View
        style={
          !click
            ? { display: 'none' }
            : {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: color.backgroundButton,
                borderRadius: 25
              }
        }
      >
        <IconButton
          icon={() => <IconFont name='plus' color={color.iconButtonColor} size={20} />}
          containerColor={color.iconButtonBackgroundColor}
          size={20}
          onPress={onPressAddMoney}
        />
        <TouchableOpacity
          style={[{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingRight: 10 }]}
          onPress={() => setClick(!click)}
          activeOpacity={0.8}
        >
          <Text style={{ color: color.iconButtonColor, fontWeight: 'bold', fontSize: 16 }}>
            {formatNumber(coins as string)}
          </Text>
          <IconFont name='coins' color={color.iconButtonColor} size={16} />
        </TouchableOpacity>
      </View>
      <IconButton
        mode='contained'
        icon={() => <Icon name='search' color={color.iconButtonColor} size={20} />}
        containerColor={color.iconButtonBackgroundColor}
        size={25}
        onPress={navigaSearchTab}
      />
      <IconButton
        mode='contained'
        icon='facebook-messenger'
        containerColor={color.iconButtonBackgroundColor}
        iconColor={color.iconButtonColor}
        size={25}
        onPress={handleNaviagtionChatScreen}
      />
    </Appbar.Header>
  );
}

export default Header;
