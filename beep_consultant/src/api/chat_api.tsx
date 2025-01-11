import { axiosInstance, axiosInstance2 } from './axiosInstance';

interface CreateMentorChatRequest {
  title: string;
  person_ids: string[];
  user_id: string;
}

interface StartChatRequest {
  content: string;
}

export const get_person_info = async (name: string): Promise<any> => {
  try {
    console.log(name);
    const response = await axiosInstance.get(`/persons?name=${name}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('화자 정보 불러오기 실패:', error);
    throw error;
  }
};

export const create_mentor_chat = async (createdata: CreateMentorChatRequest) => {
  try {
    const response = await axiosInstance2.post('/chat-rooms/', createdata);
    return response;
  } catch (error) {
    console.error('멘토 채팅방 생성 실패:', error);
    throw error;
  }
};

export const create_group_chat = async (createdata: CreateMentorChatRequest) => {
  try {
    console.log(createdata);
    const response = await axiosInstance2.post('/chat-rooms/', createdata);
    return response;
  } catch (error) {
    console.error('멘토 채팅방 생성 실패:', error);
    throw error;
  }
};

export const start_chat = async (query: StartChatRequest, room_id: string, user_id: string) => {
  console.log(query);
  console.log(room_id);
  try {
    const response = await axiosInstance2.post(`/chat-rooms/${room_id}/messages/?user_id=${user_id}`, query);
    return response;
  } catch (error) {
    console.log("고민 상담 시작 실패 : ", error);
    throw error;
  }
}