export interface IGetMarkComment {
  id: string;
  index: number;
  count: number;
}

export interface ISetMarkComment {
  id: string;
  content: string;
  index: number;
  count: number;
  mark_id: number | null;
  type: number;
}

export interface IFeel {
  id: string;
  type: number;
}

export interface IGetListFeels {
  id: string;
  index: number;
  count: number;
}

export interface IDeleteFeel {
  id: string;
}
export interface IListCommentPost {
  id: string;
  mark_content: string;
  type_of_mark: any;
  created: any;
  poster: {
    id: string;
    name: string;
    avatar: string;
  };
  comments?: [];
}
export interface IListFeels {
  id: string;
  feel: {
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    type: string;
  };
  comments?: IListCommentPost[];
}
