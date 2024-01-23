import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { IPost, getListVideoAPi } from 'src/services/post.sevices';
import { IGetListPost } from 'src/interfaces/post.interface';
import { IErrorData } from 'src/interfaces/common.interface';

interface IVideoState {
  getloading: boolean;
  videos: IPost[];
  error: IErrorData | IErrorData[] | string | null;
  lastId: string | null;
  newPosts: string | null;
  isNextFetch: boolean;
}

const initialState: IVideoState = {
  getloading: false,
  error: null,
  videos: [],
  lastId: null,
  newPosts: null,
  isNextFetch: true
};

export const getNextListVideos = createAsyncThunk(
  'post/getNextListVideos',
  async (data: IGetListPost, { rejectWithValue }) => {
    try {
      const res = await getListVideoAPi(data);
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

export const getListVideos = createAsyncThunk(
  'post/getListVideos',
  async (data: IGetListPost, { rejectWithValue }) => {
    try {
      const res = await getListVideoAPi(data);
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

const videoSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListVideos.pending, state => {
      state.getloading = true;
    });
    builder.addCase(getListVideos.rejected, (state, action) => {
      state.error = action.payload as string;
      state.getloading = false;
    });
    builder.addCase(getListVideos.fulfilled, (state, action) => {
      state.videos = action.payload.post;
      state.lastId = action.payload.last_id;
      state.newPosts = action.payload.new_posts;
      if (!action.payload.post?.length) {
        state.isNextFetch = false;
      }
    });
    builder.addCase(getNextListVideos.rejected, state => {
      state.getloading = true;
    });
    builder.addCase(getNextListVideos.fulfilled, (state, action) => {
      state.videos = [...(state.videos as [IPost]), ...action.payload.post];
      state.lastId = action.payload.last_id;
      state.newPosts = action.payload.new_posts;
      if (!action.payload.post?.length) {
        state.isNextFetch = false;
      }
    });
    builder.addCase(getNextListVideos.pending, state => {
      state.getloading = true;
    });
  }
});

export default videoSlice.reducer;

export const selectVideo = (state: RootState) => state.video;
