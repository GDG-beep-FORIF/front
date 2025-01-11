import axiosInstance from './axiosInstance';

interface LoginResponse {
    accessToken: string;
}

interface SignupData {
    name: string;
    password: string;
    email: string;
}

export const signup = async (signupData: SignupData): Promise<void> => {
    try {
      const response = await axiosInstance.post('/auth/signup', signupData);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
};

export const login = async (email: string, password: string): Promise<any> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
};