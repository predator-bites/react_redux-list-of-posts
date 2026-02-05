/* eslint-disable no-param-reassign */
import { PayloadAction } from '@reduxjs/toolkit';
import { getPostComments } from '../api/comments';
import { Comment } from '../types/Comment';
import { customCreateSlice } from './UsersSlice';
import * as commentsApi from '../api/comments';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SimplifiedComment = Optional<Comment, 'id'>;

type CommentsState = {
  comments: SimplifiedComment[];
  loading: boolean;
  hasError: string;
};

const initialState: CommentsState = {
  comments: [],
  loading: false,
  hasError: '',
};

export const commentsSlice = customCreateSlice({
  name: 'comments',
  initialState,
  reducers(create) {
    return {
      loadComments: create.asyncThunk(
        async (postId: number) => {
          return getPostComments(postId);
        },
        {
          pending: state => {
            state.loading = true;
            state.hasError = '';
          },
          rejected: state => {
            state.hasError = 'Something went wrong';
          },
          fulfilled: (state, { payload }: PayloadAction<Comment[]>) => {
            state.comments = payload;
          },
          settled: state => {
            state.loading = false;
          },
        },
      ),

      add: create.reducer(
        (state, { payload }: PayloadAction<SimplifiedComment>) => {
          state.comments.push(payload);
        },
      ),

      addToServer: create.asyncThunk(async (comment: SimplifiedComment) => {
        return commentsApi.createComment(comment);
      }),

      delete: create.reducer((state, { payload }: PayloadAction<number>) => {
        state.comments = state.comments.filter(
          comment => comment.id !== payload,
        );
      }),

      deleteFromServer: create.asyncThunk(async (commentId: number) => {
        return commentsApi.deleteComment(commentId);
      }),
    };
  },
});
