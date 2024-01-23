import { Text, ActivityIndicator } from 'react-native-paper';

import { color } from 'src/common/constants/color';

import { useCallback, useEffect, useState } from 'react';

import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { PostNavigationName } from 'src/common/constants/nameScreen';

import { IGetPostData, getPost } from 'src/services/post.services';
import Post from 'src/components/Post/Post';
// define props
const defaultPost = {
  id: '',
  name: '',
  created: '',
  described: '',
  modified: '',
  fake: '',
  trust: '',
  kudos: '',
  disappointed: '',
  is_felt: '',
  is_marked: '',
  author: {
    id: '',
    name: '',
    avatar: '',
    coins: ''
  },
  state: '',
  is_blocked: '',
  can_edit: '',
  banned: '',
  can_mark: '',
  can_rate: '',
  url: '',
  messages: ''
};

function AllPostDetail() {
  const route: RouteProp<PostNavigationType, PostNavigationName.AllPostDetail> = useRoute();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<IGetPostData>(defaultPost as IGetPostData);
  const [isNotExistPost, setIsNotExistPost] = useState<boolean>(false);
  const { postId } = route.params;
  const isFocused = useIsFocused();

  const getPostCall = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getPost({ id: postId });
      if (res.success) {
        setPost(res.data);
      } else {
        setIsNotExistPost(true);
      }
    } catch (e) {
      return;
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isFocused) {
      getPostCall();
    }
  }, [getPostCall, isFocused]);

  const {
    kudos,
    disappointed,
    described,
    state,
    author,
    created,
    is_blocked,
    is_felt,
    banned,
    image,
    video,
    can_edit,
    name
  } = post;

  const totalFeel = parseInt(kudos) + parseInt(disappointed);

  return isLoading ? (
    <ActivityIndicator color={color.primary} style={{ marginTop: '50%' }} />
  ) : isNotExistPost ? (
    <Text variant='titleMedium' style={{ textAlign: 'center', padding: 20, marginTop: '50%' }}>
      Bài viết không còn tồn tại hoặc đã được hạn chế truy cập
    </Text>
  ) : (
    <Post
      id={postId}
      author={author}
      created={created}
      comment_mark={(parseInt(post.trust) + parseInt(post.fake)).toString()}
      described={described}
      image={image as [{ url: string; id: string }]}
      video={video as { url: string; thumb: string }}
      name={name}
      feel={totalFeel.toString()}
      banned={banned}
      can_edit={can_edit}
      is_blocked={is_blocked}
      is_felt={is_felt}
      status={state}
    />
  );
}

export default AllPostDetail;
