// src/store/slices/appSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { configService, AuthMediaItem } from '../../services/config.service';

interface AppState {
  hasCompletedOnboarding: boolean;
  isAppReady: boolean;
  authBackgroundMedia: AuthMediaItem[];
  isLoadingConfig: boolean;
}

const initialState: AppState = {
  hasCompletedOnboarding: false,
  isAppReady: false,
  authBackgroundMedia: [],
  isLoadingConfig: false,
};

export const loadAppState = createAsyncThunk('app/loadAppState', async () => {
  const value = await SecureStore.getItemAsync('hasCompletedOnboarding');
  return value === 'true';
});

export const fetchAuthConfig = createAsyncThunk('app/fetchAuthConfig', async () => {
  const media = await configService.fetchAuthBackgroundMedia();
  return media;
});

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnboardingComplete(state) {
      state.hasCompletedOnboarding = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAppState.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.hasCompletedOnboarding = action.payload;
        state.isAppReady = true;
      })
      .addCase(loadAppState.rejected, (state) => {
        state.isAppReady = true;
      })
      .addCase(fetchAuthConfig.pending, (state) => {
        state.isLoadingConfig = true;
      })
      .addCase(fetchAuthConfig.fulfilled, (state, action) => {
        state.isLoadingConfig = false;
        state.authBackgroundMedia = action.payload;
      })
      .addCase(fetchAuthConfig.rejected, (state) => {
        state.isLoadingConfig = false;
      });
  },
});

export const { setOnboardingComplete } = appSlice.actions;
export default appSlice.reducer;
