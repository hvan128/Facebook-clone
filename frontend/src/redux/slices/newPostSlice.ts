import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PostProps } from 'src/components/Post/Post';
import { MediaFileType } from 'src/screens/post/CreatePostScreen/CreatePostScreen';
import { getPost } from 'src/services/post.services';

export interface IUnfinishedPost {
  user_id: string;
  status?: string;
  listImage?: string[];
  video?: string;
  described?: string;
  mediaFiles?: MediaFileType[];
}
interface NewPostState {
  unfinishedPost: IUnfinishedPost | undefined;
  post: PostProps | undefined;
  loading: boolean;
  error: string | null;
  progress: number;
}

const initialState: NewPostState = {
  unfinishedPost: undefined,
  post: undefined,
  loading: false,
  error: null,
  progress: 0
};

export const getNewPost = createAsyncThunk(
  'post/getNewPost',
  async (data: { id: string }, { rejectWithValue }) => {
    try {
      const result = await getPost(data);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (err) {
      return rejectWithValue('Rất tiếc, có lỗi xảy ra.Vui lòng thử lại');
    }
  }
);

export const newPostSlice = createSlice({
  name: 'getPost',
  initialState,
  extraReducers: builder => {
    builder.addCase(getNewPost.pending, state => {
      state.loading = true;
      state.progress = 0.8;
    });
    builder.addCase(getNewPost.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
      state.progress = 0;
    });
    builder.addCase(getNewPost.fulfilled, (state, action) => {
      state.post = {
        id: action.payload.id,
        described: action.payload.described,
        image: action.payload.image,
        video: action.payload.video,
        name: action.payload.name,
        status: action.payload.state,
        author: action.payload.author,
        created: action.payload.created,
        feel: '0',
        comment_mark: '0',
        is_blocked: action.payload.is_blocked,
        is_felt: action.payload.is_felt,
        can_edit: action.payload.can_edit,
        banned: action.payload.banned
      };
      state.loading = false;
      state.progress = 1;
    });
  },
  reducers: {
    deleteNewPost: state => {
      state.post = undefined;
    },
    resetProgress: state => {
      state.progress = 0;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setUnfinishedPost: (state, action: PayloadAction<IUnfinishedPost>) => {
      state.unfinishedPost = action.payload;
    },
    resetUnfinishedPost: state => {
      state.unfinishedPost = undefined;
    }
  }
});

// Action creators are generated for each case reducer function
export const { deleteNewPost, resetProgress, setProgress, setUnfinishedPost, resetUnfinishedPost } =
  newPostSlice.actions;

export default newPostSlice.reducer;
