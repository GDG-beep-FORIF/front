import axiosInstance from './axiosInstance';

interface PersonResponse {
  data: {
    id: string;
    name: string;
    avatar?: string;
  }
}

export const get_person_info = async (name: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/persons?name=${name}`);
    return response;
  } catch (error) {
    console.error('화자 정보 불러오기 실패:', error);
    throw error;
  }
};