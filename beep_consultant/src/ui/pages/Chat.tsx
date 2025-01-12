import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { get_person_info, create_chat_room, start_chat } from '../../api/chat_api';
import { useAuth } from '../../contexts/AuthContext';
import { useChatWebSocket } from './../../api/chat_websocket';
import { useLocation } from 'react-router-dom';

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
  const [aiList, setAIList] = useState<any[]>([]);
  const [initialQuery, setInitialQuery] = useState('');
  // const [messages, setMessages] = useState<ChatMessage[]>([]);
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // location.state에서 채팅 히스토리가 있다면 변환하여 초기값으로 설정
    const chatHistory = location.state?.chatHistory;
    if (chatHistory) {
      return chatHistory.map((msg: any) => ({
        id: msg.messageId,
        sender: msg.senderType === 'USER' ? '나' : msg.sender,
        senderId: msg.senderId,
        content: msg.message,
        timestamp: new Date(msg.timestamp || Date.now()),
        isAI: msg.senderType === 'AI',
        isSystem: msg.senderType === 'SYSTEM'
      }));
    }
    return [];
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const navigate = useNavigate();
  const [chatRoomID, setChatRoomID] = useState('');
  const { user } = useAuth();
  const userId = user?.userId ?? '';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiParticipants = participants.filter(p => !p.isUser);
  const useWebSocket = aiParticipants.length === 2;
  
  const { messages: wsMessages, isConnected, error: wsError, sendMessage, summary, isChatEnded } = useChatWebSocket(
    useWebSocket ? chatRoomID : '',
    userId
  );

  

  useEffect(() => {
    if (useWebSocket && wsMessages.length > 0) {
      setMessages(prev => [...prev, wsMessages[wsMessages.length - 1]]);
    }
  }, [wsMessages, useWebSocket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = async () => {
    try {
      const aiParticipants = participants.filter(p => !p.isUser);
      const aiNames = aiParticipants.map(p => p.name);
      
      if (!userId) return;

      const response = await create_chat_room({
        title: aiParticipants.length === 1 
          ? `${aiParticipants[0].name}와의 상담`
          : `${aiParticipants[0].name}와 ${aiParticipants[1].name}의 상담`, 
        personNames: aiNames,
        userId: userId
      });

      const roomId = response.data.roomId;
      setChatRoomID(roomId);

      // AI가 한 명일 경우 초기 시작 메시지 전송
      if (aiParticipants.length === 1) {
        const startMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'system',
          content: '채팅이 시작되었습니다.',
          timestamp: new Date(),
          isSystem: true
        };

        setMessages(prev => [...prev, startMessage]);
      }
      // AI가 두 명일 경우 WebSocket 연결 시작
      else if (aiParticipants.length === 2) {
        // WebSocket 연결은 useEffect에서 자동으로 처리됨
        // 필요한 경우 여기서 초기 메시지를 WebSocket으로 전송할 수 있음
        if (isConnected) {
          await sendMessage('안녕하세요');
        }
      }
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  const handleAddParticipant = async () => {
    const participantName = newParticipant.trim();
    if (participantName && participants.length < 3) {
      setIsAddingParticipant(true);
      try {
        const response = await get_person_info(participantName);
        const personInfo = response.data;
        setAIList(prev => [...prev, personInfo]);
        
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
          content: `${participantName}님이 채팅방에 입장하셨습니다.`,
          timestamp: new Date(),
          isSystem: true
        };
        
        setMessages(prev => [...prev, joinMessage]);
        setNewParticipant('');
        setIsSearching(false);
      } catch (error) {
        console.error('참가자 정보 조회 실패:', error);
      } finally {
        setIsAddingParticipant(false);
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
      setIsMessageLoading(true);
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: '나',
        content: currentMessage,
        timestamp: new Date()
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      if (initialQuery === '') {
        setInitialQuery(currentMessage);
      }
      setCurrentMessage('');

      try {
        const aiParticipants = participants.filter(p => !p.isUser);
        
        if (aiParticipants.length === 1) {
          // 단일 AI 상담일 경우 HTTP API 사용
          const response = await start_chat({
            content: currentMessage
          }, chatRoomID, userId);
          
          const newAImessage = {
            id: response.data.message_id,
            sender: aiParticipants[0].name,
            senderId: aiParticipants[0].id,
            content: response.data.ai_response.content,
            timestamp: new Date(response.data.created_at),
            isAI: true,
            isSystem: false
          };
          
          setMessages([...updatedMessages, newAImessage]);
        } else if (aiParticipants.length === 2 && isConnected) {
          // 두 명의 AI 상담일 경우 WebSocket 사용
          await sendMessage(currentMessage);
        }
      } catch (error) {
        console.error('메시지 전송 실패:', error);
      } finally {
        setIsMessageLoading(false);
      }
    }
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.isSystem) {
      // 시스템 메시지 렌더링 (변경 없음)
      return (
        <div className="flex justify-center">
          <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm">
            {message.content}
          </div>
        </div>
      );
    }
  
    // AI 메시지 렌더링
    if (message.isAI) {  // isAI 플래그로 직접 체크
      const sender = participants.find(p => p.name === message.sender);  // speaker로 참가자 찾기
      return (
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            {sender?.image_url ? (
              <img 
                src={sender.image_url} 
                alt={message.sender}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm">
                {message.sender.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">{message.sender}</div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              {message.content}
            </div>
          </div>
        </div>
      );
    }
  
    // 사용자 메시지 렌더링 (이 부분 코드도 추가해야 함)
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
                    disabled={isAddingParticipant}
                  />
                  <button
                    onClick={handleAddParticipant}
                    disabled={isAddingParticipant}
                    className="ml-2 p-2 text-green-600 hover:text-green-700"
                  >
                    {isAddingParticipant ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "추가"
                    )}
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
        {/* 연결 상태 표시 */}
        {!isConnected && chatRoomID && aiParticipants.length === 2 && (
          <div className="bg-red-50 p-2 text-red-600 text-center flex items-center justify-center">
            <WifiOff size={16} className="mr-2" />
            <span>연결이 끊어졌습니다. 재연결 중...</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {renderMessage(message)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

    <div className="bg-white p-4 border-t border-gray-200">
          {useWebSocket ? (
            // WebSocket 사용 시 (AI 2명)
            isChatEnded ? (
              <div className="flex justify-center">
                <button
                  onClick={() => navigate(`/summary/${chatRoomID}`, { state: { 
                    summary,
                    aiList,
                    initialQuery
                  } })}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
                >
                  <span>토론 종료. 요약 보러 가기</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  disabled={!isConnected || !chatRoomID}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!isConnected || !chatRoomID}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
                >
                  <Send size={20} />
                </button>
              </div>
            )
          ) : (
            // HTTP API 사용 시 (AI 1명)
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                disabled={isMessageLoading || !chatRoomID}
              />
              <button
                onClick={handleSendMessage}
                disabled={isMessageLoading || !chatRoomID}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
              >
                {isMessageLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;