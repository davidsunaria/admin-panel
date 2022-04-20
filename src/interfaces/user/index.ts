export interface IUsers {
  q?: string;
  page?: string | number;
  limit?: string | number;
  status?: any;
  is_premium?: string | number;
  group_id?: string | number;
  is_blocked_by_admin?: string | number;
}

export interface IUsersProps extends IUsers{
  onSearch: (payload?: any) => any;
  onReset: () => any;
  type?: string;
}

export interface IEnableDisable {
  _id: string;
  type?: string;
  status?: any;
  is_blocked_by_admin?:any;
  is_only_admin_authorised_to_post?:boolean | string | number
}

export interface IPremiumStatus {
  type?: any;
  is_premium?:any;
  user_id?:any;
  expire_at?:any
}


export interface IInviteuser {
  email: string;
}

export interface IPremiumuser {
  type?: string | number;
  is_premium?:string | number;
  user_id?:string | number;
  expire_at?: any;
}

export interface ILockedGroup {
  restriction_mode?:string | number;
  _id?:string | number;
}


export interface IEventGroups extends IUsersProps {
  _id?: string;
  id?: string;
  name?: string;
}
