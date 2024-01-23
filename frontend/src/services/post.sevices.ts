import { IGetListPost, IGetNewPosts } from 'src/interfaces/post.interface';
import { postMethodApi } from './api';
import { PostApi } from './clientConstant';
import { IBodyResponse, IListBodyResponse } from 'src/interfaces/common.interface';

export interface IPost {
  id: string;
  name: string;
  image: [{ url: string; id: string }];
  video: {
    url: string;
    thumb: string;
  };
  discribed: string;
  created: string;
  feel: string;
  comment_mark: string;
  is_felt: string;
  is_blocked: string;
  can_edit: string;
  banned: string;
  state: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface IListPost {
  post: IPost[];
  new_posts: string;
  last_id: string;
}

export interface IReportPost {
  id: string;
  subject: string;
  details: string;
}

export const getListPostAPi = async (data: IGetListPost): Promise<IBodyResponse<IListPost>> => {
  return postMethodApi(PostApi.GET_LIST_POSTS, data);
};

export const getPostApi = async (data: { id: string }): Promise<IBodyResponse<IPost>> => {
  return postMethodApi(PostApi.GET_POST, data);
};

export const getListVideoAPi = async (data: IGetListPost): Promise<IBodyResponse<IListPost>> => {
  return postMethodApi(PostApi.GET_LIST_VIDEOS, data);
};

export const deletePostApi = async (data: { id: string }): Promise<IBodyResponse<any>> => {
  return postMethodApi(PostApi.DELETE_POST, data);
};

export const getNewPostApi = async (data: IGetNewPosts): Promise<IListBodyResponse<IPost>> => {
  return postMethodApi(PostApi.GET_NEW_POSTS, data);
};

export const reportPostApi = async (data: IReportPost): Promise<IListBodyResponse<any>> => {
  return postMethodApi(PostApi.REPORT_POST, data);
};
