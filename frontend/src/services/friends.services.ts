import { IBodyResponse, IListBodyResponse } from 'src/interfaces/common.interface';
import {
  IDeleteRequestFriend,
  IGetRequestedFriends,
  ISetAcceptFriend,
  ISetRequestFriend,
  ISuggestedFriends
} from 'src/interfaces/friends.interface';
import { postMethodApi } from './api';
import { FriendApi } from './clientConstant';

export const getRequestedFriendsApi = async (
  data: IGetRequestedFriends
): Promise<IBodyResponse<any>> => {
  return postMethodApi(FriendApi.GET_REQUESTED_FRIENDS, data);
};

export const getUserFriendsApi = async (
  data: IGetRequestedFriends
): Promise<IBodyResponse<any>> => {
  return postMethodApi(FriendApi.GET_USER_FRIENDS, data);
};

export const getSuggestedFriendsApi = async (
  data: IGetRequestedFriends
): Promise<IListBodyResponse<ISuggestedFriends>> => {
  return postMethodApi(FriendApi.GET_SUGGESTED_FRIENDS, data);
};

export const setAcceptFriendApi = async (data: ISetAcceptFriend): Promise<IBodyResponse<any>> => {
  return postMethodApi(FriendApi.SET_ACCEPT_FRIEND, data);
};

export const setRequestFriendApi = async (data: ISetRequestFriend): Promise<IBodyResponse<any>> => {
  return postMethodApi(FriendApi.SET_REQUEST_FRIEND, data);
};

export const deleteRequestFriendApi = async (
  data: IDeleteRequestFriend
): Promise<IBodyResponse<any>> => {
  return postMethodApi(FriendApi.DEL_REQUEST_FRIEND, data);
};

export const unfriendApi = async (data: IDeleteRequestFriend): Promise<IBodyResponse<any>> => {
  return postMethodApi(FriendApi.UNFRIEND, data);
};
