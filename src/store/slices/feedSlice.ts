import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, postService } from '../../services/post.service';

interface FeedState {
  feedPosts: Post[];
  featuredPosts: Post[];
  cursor: string | null;
  hasNextPage: boolean;
  isLoadingFeed: boolean;
  isLoadingFeatured: boolean;
  isLoadingMore: boolean;
}

const initialState: FeedState = {
  feedPosts: [],
  featuredPosts: [],
  cursor: null,
  hasNextPage: true,
  isLoadingFeed: false,
  isLoadingFeatured: false,
  isLoadingMore: false,
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const response = await postService.getFeed(null, 15);
  return response;
});

export const fetchMoreFeed = createAsyncThunk(
  'feed/fetchMoreFeed',
  async (_, thunkAPI: any) => {
    const state = thunkAPI.getState();
    const cursor = state.feed.cursor;
    if (!cursor) return null;
    const response = await postService.getFeed(cursor, 15);
    return response;
  }
);

export const fetchFeatured = createAsyncThunk('feed/fetchFeatured', async () => {
  const response = await postService.getFeatured();
  return response;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    toggleLike(state, action: PayloadAction<string>) {
      const postId = action.payload;
      const post = state.feedPosts.find((p) => p._id === postId);
      if (post) {
        post.isLikedByMe = !post.isLikedByMe;
        post.stats.likes += post.isLikedByMe ? 1 : -1;
      }
    },
    toggleSave(state, action: PayloadAction<string>) {
      const postId = action.payload;
      const post = state.feedPosts.find((p) => p._id === postId);
      if (post) {
        post.isSavedByMe = !post.isSavedByMe;
        post.stats.saves += post.isSavedByMe ? 1 : -1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoadingFeed = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoadingFeed = false;
        state.feedPosts = action.payload.data;
        state.cursor = action.payload.meta.nextCursor;
        state.hasNextPage = action.payload.meta.hasNextPage;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.isLoadingFeed = false;
      })
      .addCase(fetchMoreFeed.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(fetchMoreFeed.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        if (action.payload) {
          state.feedPosts = [...state.feedPosts, ...action.payload.data];
          state.cursor = action.payload.meta.nextCursor;
          state.hasNextPage = action.payload.meta.hasNextPage;
        }
      })
      .addCase(fetchMoreFeed.rejected, (state) => {
        state.isLoadingMore = false;
      })
      .addCase(fetchFeatured.pending, (state) => {
        state.isLoadingFeatured = true;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.isLoadingFeatured = false;
        state.featuredPosts = action.payload;
      })
      .addCase(fetchFeatured.rejected, (state) => {
        state.isLoadingFeatured = false;
      });
  },
});

export const { toggleLike, toggleSave } = feedSlice.actions;
export default feedSlice.reducer;
