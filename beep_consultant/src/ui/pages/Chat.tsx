import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { get_person_info, create_mentor_chat, create_group_chat, start_chat } from '../../api/chat_api';
import { useAuth } from '../../contexts/AuthContext';

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  image_url?: string;
  joinedAt: Date;
  isUser?: boolean
}

interface ChatMessage {
  id: string;
  sender: string;
  senderId?: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
  isSystem?: boolean;
}

const ChatPage = () => {
  const [participants, setParticipants] = useState<ChatParticipant[]>([
    {
      id: 'user',
      name: '삐약이',
      joinedAt: new Date(),
      isUser: true,
    }
  ]);
  const [newParticipant, setNewParticipant] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [chatRoomID, setChatRoomID] = useState('');
  const { user } = useAuth();
  const userId = user?.userId;

  const handleStartChat = async () => {
    try {
      const aiParticipants = participants.filter(p => !p.isUser);
      console.log(aiParticipants);
      const aiIds = aiParticipants.map(p => p.id);
      
      let response;
      if (userId) {
        if (aiIds.length === 1) {
          console.log(aiIds);
          response = await create_mentor_chat({
            title: `${aiParticipants[0].name}과의 상담`, 
            person_ids: aiIds,
            user_id: userId
          });
          console.log(response.data.room_id);
          setChatRoomID(response.data.room_id);
          console.log(chatRoomID);
        } else {
          response = await create_group_chat({
            title: `${aiParticipants[0].name}, ${aiParticipants[1].name}과의 상담`, 
            person_ids: aiIds,
            user_id: userId
          });
          console.log(response.data.room_id);
          setChatRoomID(response.data.room_id);
          console.log(chatRoomID);
        }
      }

      
      const startMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'system',
        content: '채팅이 시작되었습니다.',
        timestamp: new Date(),
        isSystem: true
      };
      
      setMessages(prev => [...prev, startMessage]);
      
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  const handleAddParticipant = async () => {
    const participantName = newParticipant.trim();
    if (participantName && participants.length < 3) {
      try {
        const response = await get_person_info(participantName);
        const personInfo = response.data;
        
        const newParticipant: ChatParticipant = {
          id: personInfo.id,
          name: personInfo.name,
          image_url: personInfo.imageUrl,
          joinedAt: new Date()
        };
        
        setParticipants(prev => [...prev, newParticipant]);
        
        const joinMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'system',
          content: `${personInfo.name}님이 채팅방에 입장하셨습니다.`,
          timestamp: new Date(),
          isSystem: true
        };
        
        setMessages(prev => [...prev, joinMessage]);
        setNewParticipant('');
        setIsSearching(false);
      } catch (error) {
        console.error('참가자 정보 조회 실패:', error);
      }
    }
  };

  const handleRemoveParticipant = (id: string) => {
    if (id === 'user') return;
    
    const participant = participants.find(p => p.id === id);
    if (participant) {
      setParticipants(participants.filter(p => p.id !== id));
      
      const leaveMessage = {
        id: Date.now().toString(),
        sender: '',
        content: `${participant.name}님이 채팅방을 나갔습니다.`,
        timestamp: new Date(),
        isSystem: true
      };
      
      setMessages(prev => [...prev, leaveMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim() && userId) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: '나',
        content: currentMessage,
        timestamp: new Date()
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      const response = await start_chat({
        content: currentMessage
      }, chatRoomID, userId);
      console.log(response);
      
      let senderName, senderID;
      if (participants.length == 2) {
        const ai_mentor = participants.filter(p => !p.isUser)[0]
        senderName = ai_mentor.name;
        senderID = ai_mentor.id;
      } else {
        // senderName, senderID for 2-AI chat
      }
      const newAImessage = {
        id: response.data.message_id,
        sender: senderName || '',
        senderId: senderID,
        content: response.data.ai_response.content,
        timestamp: new Date(response.data.created_at),
        isAI: true,
        isSystem: false
      }

      setMessages([...updatedMessages, newAImessage]);
      setCurrentMessage('');
    }
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.isSystem) {
      return (
        <div className="flex justify-center">
          <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm">
            {message.content}
          </div>
        </div>
      );
    }

    const sender = participants.find(p => p.id === message.senderId);
    const isAI = !message.isSystem && sender && !sender.isUser;

    if (isAI) {
      return (
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            {sender?.image_url ? (
              <img 
                src={sender.image_url} 
                alt={sender.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm">
                {sender?.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">{sender?.name}</div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              {message.content}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-end">
        <div className="bg-green-100 px-4 py-2 rounded-lg max-w-[70%]">
          {message.content}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <nav className="flex items-center justify-between px-6 py-4 w-full max-w-6xl mx-auto z-50">
          <div 
            className="text-dark-green font-semibold text-xl cursor-pointer" 
            onClick={() => navigate("/")}
          >
            🐥 삐약상담소
          </div>
          <div></div>
        </nav>
        <div className="mb-6 ml-4 mt-8">
          <h2 className="text-xl font-bold mb-4">삐약님의 고민을 알려주세요!</h2>
          {participants.length > 1 && (
            <button
              onClick={handleStartChat}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors mb-4"
            >
              채팅 시작하기
            </button>
          )}
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {participant.image_url ? (
                    <img 
                      src={participant.image_url} 
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {participant.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="font-medium">{participant.name}</span>
                {participant.isUser && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">나</span>
                )}
              </div>
              {!participant.isUser && (
                <button
                  onClick={() => handleRemoveParticipant(participant.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  x
                </button>
              )}
            </div>
          ))}
          {participants.length < 3 && (
            <div className="mt-4">
              {isSearching ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                    placeholder="대화 상대 이름"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                  <button
                    onClick={handleAddParticipant}
                    className="ml-2 p-2 text-green-600 hover:text-green-700"
                  >
                    추가
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearching(true)}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <Search size={16} className="mr-2" />
                  대화 상대 선택하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-light-green bg-opacity-10">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="text-xl font-semibold">채팅</div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-light-green">
          {messages.map((message) => (
            <div key={message.id}>
              {renderMessage(message)}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white p-4 border-t border-gray-200 sticky bottom-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="고민을 알려주세요!"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;