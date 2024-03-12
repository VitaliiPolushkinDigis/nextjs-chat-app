import { getAuthUser, postLoginUser, postRegisterUser } from "@/utils/api";
import { CreateUserParams, User, UserCredentialsParams } from "@/utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface UserState {
  user?: User;
  loading: boolean;
  error: boolean;
}

const initialState: UserState = {
  user: undefined,
  loading: false,
  error: false,
};

export const register = createAsyncThunk(
  "user/register",
  async (data: CreateUserParams) => {
    const response = await postRegisterUser(data);

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data: UserCredentialsParams) => {
    const response = await postLoginUser(data);

    return response.data;
  }
);
export const getAuth = createAsyncThunk<User, string | undefined>(
  "user/getAuth",
  async (cookies) => {
    const response = await getAuthUser(cookies);

    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
    });
    builder.addCase(loginUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
    });
    builder.addCase(getAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.user = action.payload;
    });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
