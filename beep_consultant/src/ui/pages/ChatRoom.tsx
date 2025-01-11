import { useParams } from "react-router-dom";

export default function ChatRoom() {
  const { roomId } = useParams();

  // roomId를 사용하여 특정 채팅방의 데이터를 불러오는 로직 구현

  return <div>{/* 채팅방 UI */}</div>;
}
