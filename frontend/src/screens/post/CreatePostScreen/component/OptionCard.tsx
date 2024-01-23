import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { color } from 'src/common/constants/color';
export interface OptionProp {
  icon: string;
  color: string;
  title: string;
  textColor?: string;
}
const OptionCard = (props: OptionProp) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.iconCard}>
        <Icon name={props.icon} size={32} color={props.color} />
      </View>
      <Text style={{ fontSize: 14, color: props.textColor ? props.textColor : color.textColor }}>
        {props.title}
      </Text>
    </View>
  );
};

export default OptionCard;

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 5
  },
  iconCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginHorizontal: 10
  }
});
