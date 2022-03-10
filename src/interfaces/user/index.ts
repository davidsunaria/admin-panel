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
  type: string;
  status?: any;
  is_blocked_by_admin?:any
}


export interface IInviteuser {
  email: string;
}


export interface IEventGroups extends IUsersProps {
  _id?: string;
  id?: string;
  name?: string;
}
