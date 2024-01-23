import { StyleSheet } from 'react-native';
import { color } from 'src/common/constants/color';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: color.textColor
  },
  bio: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
    marginBottom: 20
  },
  section: {
    // marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nearlyall: {
    marginTop: 10,
    position: 'relative'
  },

  nearly: {
    marginLeft: 20,
    color: '#050505',
    fontWeight: '700',
    fontSize: 16
  },

  seeall: {
    fontSize: 16,
    marginRight: 20,
    color: '#0064d1'
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  coverPhoto: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  avatarWrapper: {
    display: 'flex',
    position: 'absolute',
    top: 150,
    borderRadius: 105,
    borderWidth: 5,
    borderColor: 'white',
    overflow: 'hidden'
  },
  infomation: {
    marginTop: 40
  },
  cameraIconWrapper: {
    position: 'absolute',
    top: 200,
    right: 0
  },
  cameraIcon: {
    padding: 10
  },
  cameraIconAvatar: {
    position: 'relative',
    top: 40,
    left: 70
  },
  closeButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black'
  },
  detailsContainer: {
    marginTop: 20,
    marginLeft: 20
  },
  detailLabel: {
    fontSize: 18,
    marginRight: 5,
    marginLeft: 10
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.textColor
  },
  editPublicButton: {
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: '#E9F1FE',
    padding: 10,
    borderRadius: 7
  },
  editPublicButtonText: {
    color: color.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  option: {
    paddingVertical: 0
  },
  clearButton: {
    position: 'absolute',
    top: -5,
    right: 0,
    opacity: 0.5
  },
  headerSearchresult: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  All: {
    fontSize: 16,
    fontWeight: '500'
  },
  post: {
    fontSize: 16,
    fontWeight: '500',
    color: color.primary
  },
  //Search Result
  containers: {
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
export default styles;
