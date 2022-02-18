export interface ILogin {
  email: string;
  password: string
}
export interface IForgotPassword {
  email: string;
}
export interface AuthModel {
  access_token: string;
}
export interface IResetPassword {
  otp: string;
  email: string;
  password: string;
  password_confirmation?: string;
}
export interface ILogout {
  
}