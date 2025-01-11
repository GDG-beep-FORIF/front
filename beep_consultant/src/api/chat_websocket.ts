import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
}

interface WebSocketPayload {
  content: string;
  user_id: string;
}

interface WebSocketHookResult {
    messages: ChatMessage[];
    isConnected: boolean;
    error: string | null;
    summary: string;
    isChatEnded: boolean;
    sendMessage: (content: string) => void;
  }

export const useChatWebSocket = (roomId: string, userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) return; // roomId가 없으면 연결하지 않음

    // WebSocket 서버 연결
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          if (response.type === 'summary') {
            setSummary(response.content);
            setIsChatEnded(true);
          } else if (response.speaker) {
            // speaker가 있는 메시지는 AI 응답으로 처리
            const newMessage: ChatMessage = {
              id: Date.now().toString(),
              sender: response.speaker,
              content: response.content,
              timestamp: new Date(response.timestamp),
              isAI: true,
            };
            setMessages(prev => [...prev, newMessage]);
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setError('WebSocket connection error');
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    // Clean up on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId]); // roomId가 변경될 때만 재연결

  const sendMessage = (content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('WebSocket is not connected');
      return;
    }

    const payload: WebSocketPayload = {
      content: content,
      user_id: userId ?? ''
    };

    wsRef.current.send(JSON.stringify(payload));
  };

  return {
    messages,
    isConnected,
    error,
    sendMessage,
    summary,
    isChatEnded
  };
};