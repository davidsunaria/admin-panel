// LOGOUT
export const clearToken = () => {
  localStorage.removeItem('access_token')
}

// LOGIN STATUS
export const isLogin = (): boolean => {
  if (localStorage.getItem('access_token')) return true;
  return false;
}

// LOGIN
export const setToken = (token: string) => {
  localStorage.setItem('access_token', token);
}
export const getToken = (): any => {
  return (localStorage.getItem('access_token') !== undefined) ? localStorage.getItem('access_token') : '';
}
