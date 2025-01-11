import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const userId = "bc430308-def0-4203-9971-437fdba5283a";

interface ChatRoom {
  room_id: string;
  title: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  person_names: string[];
}

const Card = ({
  room_id,
  title,
  status,
  created_at,
  person_names,
}: {
  room_id: string;
  title: string;
  status: string;
  created_at: string;
  person_names: string[];
}) => (
  <Link to={`/chat/${room_id}`}>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-48 bg-black"></div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">
          {person_names.length > 1
            ? person_names.slice(0, -1).join(", ") +
              ", " +
              person_names.slice(-1)
            : person_names[0]}
          <div className="flex justify-end">
            <span>{created_at}</span>
          </div>
        </p>
      </div>
    </div>
  </Link>
);
const Dashboard = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/chat-rooms/?user_id=${userId}`
        );
        const data = await response.json();
        setChatRooms(data);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white border z-50">
        <div className="m-4 ml-8">
          <h1 className="text-2xl">대시보드</h1>
        </div>
      </div>
      <div className="flex min-h-screen mt-16">
        <div className="w-1/4  p-8">
          <div className="flex justify-center ">
            <p>프로필</p>
          </div>

          <div className="flex justify-center items-center mt-8">
            <div className="relative w-52 h-52 mb-10 group flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg transition-colors duration-200" />
              <img
                src="/peep.jpg"
                alt="profile"
                className="w-full h-full object-cover rounded-lg shadow-md ring-2 ring-gray-200/50"
                onError={(e) => {
                  e.currentTarget.src = "/default-profile.jpg";
                }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8">
            <Link to="" className="cursor-pointer hover:text-gray-600">
              내 채팅 기록
            </Link>
            <Link to="" className="cursor-pointer hover:text-gray-600">
              계정 설정
            </Link>
            <Link to="" className="cursor-pointer hover:text-gray-600">
              로그아웃
            </Link>
          </div>
        </div>

        <div className="flex-1 bg-green-100 p-8">
          <h2 className="text-lg mb-8">내 채팅 기록</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatRooms.map((chat, index) => (
              <Card
                key={index}
                room_id={chat.room_id}
                title={chat.title}
                status={chat.status}
                created_at={chat.created_at.substring(0, 10)}
                person_names={chat.person_names}
              />
            ))}
          </div>

          <button className="fixed bottom-8 right-8 bg-green-700 text-white rounded-full p-4 shadow-lg hover:bg-green-800 transition-colors">
            <div className="flex items-center justify-center">
              <Plus className="w-6 h-6" />
              <span className="ml-2">새 채팅 시작하기</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
