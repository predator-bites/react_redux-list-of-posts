/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { getUserPosts } from '../api/posts';
import { customCreateSlice } from './UsersSlice';
import { Post } from '../types/Post';
import { authorSlice } from './AuthorSlice';

type PostsSliceType = {
  posts: Post[];
  loading: boolean;
  error: string;
};

const initialState: PostsSliceType = {
  posts: [],
  loading: false,
  error: '',
};

export const postsSlice = customCreateSlice({
  name: 'posts',
  initialState: initialState,
  reducers(create) {
    return {
      loadAuthorPosts: create.asyncThunk(
        async (userId: number) => {
          return getUserPosts(userId);
        },
        {
          pending: state => {
            state.loading = true;
            state.error = '';
          },
          rejected: state => {
            state.error = 'Something went wrong';
          },
          fulfilled: (state, { payload }: PayloadAction<Post[]>) => {
            state.posts = payload;
          },
          settled: state => {
            state.loading = false;
          },
        },
      ),
    };
  },
  extraReducers(builder) {
    builder.addCase(authorSlice.actions.set, state => {
      state.posts = [];
    });
  },
});
