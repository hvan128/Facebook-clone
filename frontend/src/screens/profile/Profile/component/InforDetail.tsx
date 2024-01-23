import { Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

interface InforDetailProps {
  address?: string;
  city?: string;
  country?: string;
  isOwnProfile?: boolean;
}
const InforDetail = ({ address, city, isOwnProfile, country }: InforDetailProps) => {
  return (
    <View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={{ alignItems: 'center', flex: 1, maxWidth: 20 }}>
            <Icon name='home' size={20} color='black' />
          </View>
          {address ? (
            <>
              <Text style={styles.detailLabel}>Sống tại</Text>
              <Text style={styles.detailText}>{address}</Text>
            </>
          ) : (
            <Text style={styles.detailLabel}>không có thông tin</Text>
          )}
        </View>
        <View style={styles.detailRow}>
          <View style={{ alignItems: 'center', flex: 1, maxWidth: 20 }}>
            <Icon name='map-marker' size={20} color='black' />
          </View>
          {city ? (
            <>
              <Text style={styles.detailLabel}>Đến từ</Text>
              <Text style={styles.detailText}>
                {city}, {country}
              </Text>
            </>
          ) : (
            <Text style={styles.detailLabel}>không có thông tin</Text>
          )}
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.editPublicButton}>
        <Text style={styles.editPublicButtonText}>
          {isOwnProfile ? 'Chỉnh sửa chi tiết công khai' : 'Xem thông tin chi tiết'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InforDetail;
