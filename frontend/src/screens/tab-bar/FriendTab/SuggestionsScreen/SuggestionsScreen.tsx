import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { color } from 'src/common/constants/color';
import { SuggestFriendCard } from '../../components/FriendCard';
import { getSuggestedFriendsApi } from 'src/services/friends.services';
import BaseFlatList from 'src/components/BaseFlatList';
import useLoadingListApi from 'src/hooks/useLoadingListApi';
import BaseActivityIndicator from 'src/components/BaseActivityIndicator';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppNaviagtionName, ProfileNavigationName } from 'src/common/constants/nameScreen';

function SuggestionsScreen() {
  const navigation: NavigationProp<AppNavigationType, AppNaviagtionName.ProfileNavigation> =
    useNavigation();

  const handleNavigateUserProfile = (user_id: string) => {
    navigation.navigate(AppNaviagtionName.ProfileNavigation, {
      screen: ProfileNavigationName.Profile,
      params: { user_id }
    });
  };

  const { data, isLoadingFirstApi, isNextFetchingApi, onEndReadable, refreshing, onRefresh } =
    useLoadingListApi(getSuggestedFriendsApi);
  return isLoadingFirstApi ? (
    <BaseActivityIndicator />
  ) : (
    <View style={styles.container}>
      <BaseFlatList
        ListHeaderComponent={() => (
          <View style={styles.lineText}>
            <Text style={{ fontWeight: '800', fontSize: 20, color: color.textColor }}>
              Những người bạn có thể biết
            </Text>
          </View>
        )}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNavigateUserProfile(item.id)}>
            <SuggestFriendCard
              id={item.id}
              username={item.username}
              avatarSource={item.avatar}
              same_friends={item.same_friends}
              created={item.created}
            />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        onEndReached={onEndReadable}
        onEndReachedThreshold={0.01}
        isFootterLoading={isNextFetchingApi}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  lineText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10
  }
});

export default SuggestionsScreen;
