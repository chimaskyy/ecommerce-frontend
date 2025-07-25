import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserLocation,
  updateUserLocation,
  patchUserLocation,
  createUserLocation,
} from "./locationThunk";

const initialState = {
  isLoading: false,
  userLocation: null,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearLocationError(state) {
      state.error = null;
    },
    clearUserLocation(state) {
      state.userLocation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user location
      .addCase(fetchUserLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userLocation = action.payload;
      })
      .addCase(fetchUserLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch user location";
      })

      // Update user location
      .addCase(updateUserLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userLocation = action.payload;
      })
      .addCase(updateUserLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update user location";
      })

      // Patch user location
      .addCase(patchUserLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(patchUserLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userLocation = action.payload;
      })
      .addCase(patchUserLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to patch user location";
      })

      // Create user location
      .addCase(createUserLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userLocation = action.payload;
      })
      .addCase(createUserLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create user location";
      });
  },
});

export const { clearLocationError, clearUserLocation } = locationSlice.actions;
export default locationSlice.reducer;
