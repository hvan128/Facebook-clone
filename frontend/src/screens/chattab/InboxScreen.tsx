import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { IconButton, Avatar, TouchableRipple, ActivityIndicator, Appbar } from 'react-native-paper';
import database from '@react-native-firebase/database';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { AppNaviagtionName, ChatNavigationName } from 'src/common/constants/nameScreen';
import { useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { getAvatarUri } from 'src/utils/helper';
interface Contact {
  name: string;
  lastMsg: string;
  avatar: string;
}

function ContactList() {
  const [chatlist, setChatlist] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const navigationChatScreen: NavigationProp<AppNavigationType, AppNaviagtionName.ChatNavigation> =
    useNavigation();
  const handleNaviagtionChatScreen = (contact: Contact) =>
    navigationChatScreen.navigate(AppNaviagtionName.ChatNavigation, {
      screen: ChatNavigationName.InboxListScreen,
      params: { contact }
    });
  const auth = useAppSelector(selectAuth);
  useEffect(() => {
    const timer = setTimeout(() => {
      getChatlist().then(() => {
        setLoading(false);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [auth.user?.id]);

  const getChatlist = async () => {
    database()
      .ref('/chatlistt/' + auth.user?.id)
      .on('value', snapshot => {
        if (snapshot.val()) {
          const chatlistData = snapshot.val();
          setChatlist(Object.values(chatlistData));
        }
      });
  };

  return (
    <>
      {loading && <ActivityIndicator color='#0066FF' style={{ marginTop: '50%' }} />}
      {!loading &&
        chatlist.map((contact, index) => (
          <TouchableRipple
            key={index}
            style={{ marginVertical: 10 }}
            onPress={() => handleNaviagtionChatScreen(contact)}
            rippleColor='rgba(0, 0, 0, .32)'
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Image
                size={60}
                style={{ marginTop: 10, marginLeft: 10 }}
                source={getAvatarUri(contact?.avatar)}
              />
              <View style={{ flexDirection: 'column', marginLeft: 10, marginTop: 10 }}>
                <Text style={{ fontWeight: '500', fontSize: 15, color: '#000', marginBottom: 5 }}>
                  {contact?.name}
                </Text>
                <Text style={{ fontWeight: '500', color: '#000' }}> {contact?.lastMsg}</Text>
              </View>
              <IconButton icon={'check-circle-outline'} style={{ marginLeft: 'auto' }} size={20} />
            </View>
          </TouchableRipple>
        ))}
    </>
  );
}
function InboxScreen() {
  const navigation = useNavigation();
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Đoạn chat' />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <ContactList />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  surface: {
    flexDirection: 'row',
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 4
  },
  iconButton: {
    backgroundColor: '#DCDCDC',
    marginTop: 10
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10
  },
  scrollView: {
    backgroundColor: '#fff'
  },
  textInput: {
    borderColor: '#fff',
    backgroundColor: '#DCDCDC',
    margin: 15,
    marginTop: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  }
});

export default InboxScreen;
