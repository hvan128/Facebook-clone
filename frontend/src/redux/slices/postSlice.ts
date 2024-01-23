import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { IPost, getListPostAPi } from 'src/services/post.sevices';
import { IGetListPost } from 'src/interfaces/post.interface';
import { IErrorData } from 'src/interfaces/common.interface';

interface IPostState {
  getPostloading: boolean;
  post: IPost[];
  error: IErrorData | IErrorData[] | string | null;
  lastId: string | null;
  newPosts: string | null;
  isNextFetch: boolean;
  haveNewPost: boolean;
}

const initialState: IPostState = {
  getPostloading: false,
  error: null,
  post: [],
  lastId: null,
  newPosts: null,
  isNextFetch: true,
  haveNewPost: false
};

export const getNextListPosts = createAsyncThunk(
  'post/getNextListPosts',
  async (data: IGetListPost, { rejectWithValue }) => {
    try {
      const res = await getListPostAPi(data);
      if (res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message);
      }
    } catch (err) {
      return rejectWithValue('Rất tiếc, có lỗi xảy ra.Vui lòng thử lại');
    }
  }
);

export const getListPosts = createAsyncThunk(
  'post/getListPosts',
  async (data: IGetListPost, { rejectWithValue }) => {
    try {
      const res = await getListPostAPi(data);
      if (res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message);
      }
    } catch (err) {
      return rejectWithValue('Rất tiếc, có lỗi xảy ra.Vui lòng thử lại');
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListPosts.pending, state => {
      state.getPostloading = true;
    });
    builder.addCase(getListPosts.rejected, (state, action) => {
      state.error = action.payload as string;
      state.getPostloading = false;
    });
    builder.addCase(getListPosts.fulfilled, (state, action) => {
      state.post = action.payload.post;
      state.lastId = action.payload.last_id;
      state.newPosts = action.payload.new_posts;
      if (!action.payload.post?.length) {
        state.isNextFetch = false;
      }
      state.getPostloading = false;
    });
    builder.addCase(getNextListPosts.rejected, state => {
      state.getPostloading = false;
    });
    builder.addCase(getNextListPosts.fulfilled, (state, action) => {
      state.post = [...(state.post as [IPost]), ...action.payload.post];
      state.lastId = action.payload.last_id;
      state.newPosts = action.payload.new_posts;
      if (!action.payload.post?.length) {
        state.isNextFetch = false;
      }
      state.getPostloading = false;
    });
    builder.addCase(getNextListPosts.pending, state => {
      state.getPostloading = true;
    });
  }
});

export default postSlice.reducer;

export const selectPost = (state: RootState) => state.post;
