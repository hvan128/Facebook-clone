import { StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';
export const styles = StyleSheet.create({
  ListFeel: {
    paddingLeft: 20,
    height: 43,
    gap: 30,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  likeIcon: {
    padding: 3,
    paddingLeft: 4,
    borderWidth: 1, // Border width
    borderColor: color.white, // Border color
    borderRadius: 50,
    backgroundColor: '#3578E5',
    color: color.white
  },
  dislikeIcon: {
    padding: 3,
    paddingLeft: 4,
    borderWidth: 1, // Border width
    borderColor: color.white, // Border color
    borderRadius: 50,
    backgroundColor: color.Comment,
    color: color.black
  },
  CommentItem: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 14,
    gap: 6
  },
  top: {
    position: 'relative',
    flexDirection: 'row',
    gap: 10
  },
  Content: {
    flexDirection: 'column',
    display: 'flex',
    // alignItems:'center',
    gap: 2,
    justifyContent: 'center',
    backgroundColor: color.Comment,
    borderRadius: 14,
    paddingRight: 20,
    paddingBottom: 2,
    maxWidth: 290
  },
  ContentNameFeel: {
    flexDirection: 'column',
    display: 'flex',
    // alignItems:'center',
    gap: 2,
    justifyContent: 'center',
    // backgroundColor: color.white,
    borderRadius: 14,
    paddingRight: 20,
    paddingBottom: 2,
    maxWidth: 290
  },
  TextName: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 10,
    // height: 21,
    color: color.black,
    paddingRight: 2,
    paddingLeft: 2,
    fontWeight: 'bold'
  },
  TextNameFeel: {
    fontSize: 15,
    marginTop: 2,
    marginLeft: 10,
    // height: 21,
    color: color.black,
    paddingRight: 2,
    paddingLeft: 2,
    fontWeight: 'bold'
  },
  touchableHighlight: {
    borderRadius: 50, // Đảm bảo các góc của TouchableHighlight phù hợp với hình ảnh
    overflow: 'hidden', // Để các phần không phù hợp với hình ảnh bị ẩn đi
    // width: 40,
    height: 40,
    // marginTop:8,
    marginLeft: 8
    // zIndex:10
  },

  avatarImage: {
    opacity: 0.8
  },
  likeIconFeel: {
    padding: 3,
    paddingLeft: 4,
    borderWidth: 1, // Border width
    borderColor: color.white, // Border color
    borderRadius: 50,
    backgroundColor: '#3578E5',
    color: color.white,
    zIndex: 1
  },
  dislikeIconFeel: {
    padding: 3,
    paddingLeft: 4,
    borderWidth: 1, // Border width
    borderColor: color.white, // Border color
    borderRadius: 50,
    backgroundColor: color.Comment,
    color: color.black,
    zIndex: 1
  }
});
