import { MyFormData } from 'src/common/type/type';
import { IBodyResponse } from 'src/interfaces/common.interface';
import { postMethodApi, postMethodWithFormDataApi } from './api';
import { PostApi } from './clientConstant';

export interface IAddPostData {
  id: string;
  coins: string;
  code: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  coins: string;
  listing: any[];
}

export interface Category {
  id: string;
  has_name: string;
  name: string;
}

export interface IGetPostData {
  id: string;
  name: string;
  created: string;
  described: string;
  modified: string;
  fake: string;
  trust: string;
  kudos: string;
  disappointed: string;
  is_felt: string;
  is_marked: string;
  image?: [{ id: string; url: string }];
  author: Author;
  category: Category;
  state: string;
  is_blocked: string;
  can_edit: string;
  banned: string;
  can_mark: string;
  can_rate: string;
  url: string;
  messages: string;
  video?: {
    url: string;
    thumb: string;
  };
}

export const addPost = async (data: MyFormData): Promise<IBodyResponse<IAddPostData>> => {
  return postMethodWithFormDataApi(PostApi.ADD_POST, data);
};

export const editPost = async (data: MyFormData): Promise<IBodyResponse<IAddPostData>> => {
  return postMethodWithFormDataApi(PostApi.EDIT_POST, data);
};

export const getPost = async (data: { id: string }): Promise<IBodyResponse<IGetPostData>> => {
  return postMethodApi(PostApi.GET_POST, data);
};
