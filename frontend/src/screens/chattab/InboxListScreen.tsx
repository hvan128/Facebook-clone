import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TextInput, IconButton, Avatar } from 'react-native-paper';
import database from '@react-native-firebase/database';
import { useAppSelector } from 'src/redux';
import { selectAuth } from 'src/redux/slices/authSlice';
import { getAvatarUri } from 'src/utils/helper';
import { useNavigation } from '@react-navigation/native';

const InboxListScreen = ({ route }: { route: any }) => {
  //   const alltestchat = [
  //     {
  //       sender: 'you',
  //       text: 'Hello from you',
  //       messageType: 'sent'
  //     },
  //     {
  //       sender: 'other',
  //       text: 'Hi from other',
  //       messageType: 'received'
  //     },
  //     {
  //       sender: 'other',
  //       text: 'Hi from other',
  //       messageType: 'received'
  //     },
  //     {
  //       sender: 'you',
  //       text: 'Hello from you',
  //       messageType: 'sent'
  //     },
  //     {
  //       sender: 'you',
  //       text: 'Hello from you',
  //       messageType: 'sent'
  //     },
  //     {
  //       sender: 'other',
  //       text: 'Hi from other',
  //       messageType: 'received'
  //     }
  //     // Thêm tin nhắn khác nếu cần
  //   ];
  const { contact } = route.params;

  //   const [text, setText] = useState('');
  const [, setIsTyping] = useState(false);
  const [msg, setMsg] = useState('');
  const [allChat, setAllChat] = useState<Message[]>([]);

  interface Message {
    // Định nghĩa kiểu dữ liệu của một tin nhắn
    // Ví dụ:
    from: string;
    messages: string;
    mstType: string;
    roomId: string;
    to: string;
    // Các trường khác nếu cần
  }

  useEffect(() => {
    const onChildAdd = database()
      .ref('/messages/' + contact?.roomId)
      .on('child_added', snapshot => {
        const newMessage = snapshot.val();
        setAllChat(state => [...state, newMessage]);
      });

    // Stop listening for updates when no longer required
    return () =>
      database()
        .ref('/messages' + contact?.roomId)
        .off('child_added', onChildAdd);
  }, [contact?.roomId]);
  const auth = useAppSelector(selectAuth);

  const msgvalid = (txt: string) => txt && txt.replace(/\s/g, '').length;
  const [isMessageSent, setIsMessageSent] = useState(false);

  const sendMsg = () => {
    if (isMessageSent || msg == '' || msgvalid(msg) == 0) {
      alert('Enter something...');
      return;
    }
    setIsMessageSent(true);
    setTimeout(() => {
      setIsMessageSent(false);
    }, 1000);
    const msgData = {
      roomId: contact?.roomId,
      messages: msg,
      from: auth.user?.id,
      to: contact?.user_id,
      mstType: 'text'
    };

    // Tạo một reference đến đường dẫn cụ thể trong Firebase
    const newReference = database()
      .ref('/messages/' + contact?.roomId)
      .push();

    // console.log('Auto generated key: ', newReference.key);

    // Set dữ liệu tại key mới tạo
    newReference.set(msgData).then(() => {
      const chatlistupdate = {
        lastMsg: msg
      };

      database()
        .ref('/chatlistt/' + contact?.user_id + '/' + auth.user?.id)
        .update(chatlistupdate)
        .then(() => console.log('Data updated'));
      database()
        .ref('/chatlistt/' + auth.user?.id + '/' + contact?.user_id)
        .update(chatlistupdate)
        .then(() => console.log('Data updated'));

      setMsg('');
    });
  };
  const navigation = useNavigation();

  return (
    <>
      <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
        <IconButton
          icon={'keyboard-backspace'}
          iconColor={'#6A5ACD'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Avatar.Image size={35} style={{ marginTop: 10 }} source={getAvatarUri(contact?.avatar)} />
        <View style={{ flexDirection: 'column', marginTop: 8, marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#003' }}>{contact?.name}</Text>
          <Text style={{ fontSize: 10, fontWeight: '500' }}> Đang hoạt động </Text>
        </View>
      </View>
      <ScrollView invertStickyHeaders style={styles.container}>
        <View style={{ flex: 1, width: '100%', flexDirection: 'column' }}>
          {allChat.length === 0 ? (
            <Text style={styles.emptyMessage}>
              Hai bạn đã là bạn bè của nhau, hãy bắt đầu cuộc trò chuyện nhé
            </Text>
          ) : (
            allChat.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  message.from === auth.user?.id ? styles.sentMessage : styles.receivedMessage
                ]}
              >
                <Text
                  style={message.from === auth.user?.id ? styles.sentText : styles.receivedText}
                >
                  {message.messages}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          paddingBottom: 10,
          paddingRight: 10,
          paddingTop: 10
        }}
      >
        <IconButton icon={'dots-grid'} size={30} iconColor='#0066FF' onPress={() => {}} />

        <TextInput
          label='Nhập tin nhắn'
          value={msg}
          onFocus={() => setIsTyping(true)}
          onChangeText={msg => setMsg(msg)}
          onSubmitEditing={() => {
            if (!isMessageSent) {
              sendMsg();
            }
          }}
          underlineColor='transparent'
          style={{
            borderColor: '#fff',
            backgroundColor: '#DCDCDC',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flex: 1
          }}
        />
        <IconButton
          icon={'send'} // Icon gửi tin nhắn, bạn có thể thay đổi theo ý muốn
          size={30}
          iconColor='#0066FF'
          onPress={() => {
            if (!isMessageSent) {
              sendMsg();
            }
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#F4F4F4'
  },

  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0066FF'
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF'
  },
  sentText: {
    color: '#FFFFFF'
  },
  receivedText: {
    color: '#000000'
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888888',
    fontWeight: 'bold'
  }
});
export default InboxListScreen;
