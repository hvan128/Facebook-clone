export interface IGetListPost {
  user_id?: string;
  in_campaign?: string;
  campaign_id?: string;
  latitude?: string;
  longitude?: string;
  last_id?: string;
  index: number;
  count: number;
}

export interface IGetNewPosts {
  count: number;
}
