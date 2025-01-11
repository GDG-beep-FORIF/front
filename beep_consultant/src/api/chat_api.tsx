import { axiosInstance, axiosInstance2 } from './axiosInstance';

interface CreateMentorChatRequest {
  title: string;
  personNames: string[];
  userId: string;
}

interface StartChatRequest {
  content: string;
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

export const create_chat_room = async (createdata: CreateMentorChatRequest) => {
  try {
    const response = await axiosInstance.post('/chat-rooms', createdata);
    console.log(response);
    return response;
  } catch (error) {
    console.error('멘토 채팅방 생성 실패:', error);
    throw error;
  }
};

export const start_chat = async (query: StartChatRequest, room_id: string, user_id: string) => {
  try {
    console.log(query, room_id, user_id);
    const response = await axiosInstance2.post(`/chat-rooms/${room_id}/messages/?user_id=${user_id}`, query);
    return response;
  } catch (error) {
    console.log("고민 상담 시작 실패 : ", error);
    throw error;
  }
}