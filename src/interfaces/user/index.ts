export interface IUsers {
  q?: string;
  page?: string | number;
  limit?: string | number;
  status?: string | number;
  is_premium?: string | number;
}

export interface IUsersProps extends IUsers{
  onSearch: (payload?: any) => any;
  onReset: () => any;
}

export interface IEnableDisable {
  _id: string;
  type: string;
  status: string | number;
}
export interface IInviteuser {
  email: string;
}
