import { axiosInstance } from './axiosInstance';

interface LoginResponse {
  email: string;
  userId: string;
}

interface SignupData {
    username: string;
    password: string;
    email: string;
}

export const signup = async (signupData: SignupData): Promise<void> => {
    try {
      const response = await axiosInstance.post('/api/sign-up', signupData);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
};

export const login = async (email: string, password: string): Promise<any> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/api/sign-in', { email: email, password: password });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
};