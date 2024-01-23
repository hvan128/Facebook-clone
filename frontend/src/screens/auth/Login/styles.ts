import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column-reverse'
  },
  formGroup: {
    flex: 3,
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center'
  },

  bottom: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 4
  }
});
export default styles;
