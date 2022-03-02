import { axiosApi } from '../lib/utils/HttpService';
import { IPayload } from 'react-app-interfaces';
import { objectToQuery } from  '../lib/utils/HttpService';
const apiUrl = process.env.REACT_APP_API_URL;
export const postApi = async (formData: IPayload): Promise<any> => {
  const { url, payload } = formData;
  try {
    const response = await axiosApi.post(`${apiUrl}/${url}`, payload);
    return response?.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getApi = async (formData: IPayload): Promise<any> => {
  let queryString="";
  const { url, payload } = formData;
  if(payload){
   queryString =  objectToQuery(payload);
  }
  try {
    const response = await axiosApi.get(`${apiUrl}/${url}?${queryString}`);
    return response?.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
