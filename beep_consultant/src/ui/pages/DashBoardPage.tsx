import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { axiosInstance, axiosInstance2 } from "../../api/axiosInstance";

interface CardProps {
  room_id: string;
  title: string;
  status: string;
  created_at: string;
  person_names: string[];
}

const Card = ({ room_id, title, status, created_at, person_names }: CardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleCardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Get summary from API
      const summaryResponse = await axiosInstance.get(
        `/chat-rooms/${room_id}`
      );
      console.log(summaryResponse);
      
      // Get person info
      // const detailResponse = await axiosInstance2.get(
      //   `/chat-rooms/${room_id}?user_id=${user?.userId}`
      // );

      // Navigate to summary page with all required data
      navigate(`/summary/${room_id}`, {
        state: {
          summary: summaryResponse.data.summary,
          chatMessages: summaryResponse.data.chatMessage, // 채팅 히스토리 추가
          // aiList: detailResponse.data.persons.map((person: any) => ({
          //   id: person.person_id,
          //   name: person.name,
          //   era: person.era,
          //   description: person.description,
          //   imageUrl: person.image_url
          // }))
        }
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
      // Even if summary fetch fails, navigate to the page
      navigate(`/summary/${room_id}`);
    }
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
        <div className="w-full h-36 sm:h-48 bg-[#558F6B] relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity duration-200" />
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 group-hover:text-[#558F6B] transition-colors duration-200">
            {title}
          </h3>
          <div className="flex flex-col space-y-2">
            <p className="text-gray-600 text-xs sm:text-sm line-clamp-1">
              {person_names.length > 1
                ? person_names.slice(0, -1).join(", ") + ", " + person_names.slice(-1)
                : person_names[0]}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{created_at}</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  status === "ACTIVE"
                    ? "bg-[#EBF2EE] text-[#558F6B]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {status === "ACTIVE" ? "진행중" : "종료"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL2}/chat-rooms/?user_id=${user?.userId}`
        );
        const data = await response.json();
        setChatRooms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        setChatRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.userId) {
      fetchChatRooms();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleCreateChat = () => {
    navigate('/chat');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8]">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              대시보드
            </h1>
            <button
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 text-gray-600 ${
                  isMobileMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row min-h-screen pt-16">
        <div
          className={`fixed inset-0 bg-gray-800/50 z-40 transition-opacity duration-300 backdrop-blur-sm sm:hidden
            ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`fixed sm:static top-16 bottom-0 w-4/5 sm:w-1/4 bg-white z-40 
            transition-transform duration-300 ease-out transform
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
            sm:translate-x-0 overflow-y-auto border-r border-gray-200`}
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">프로필</h2>
            </div>

            <div className="flex justify-center items-center mt-6 sm:mt-8">
              <div className="relative w-32 sm:w-48 h-32 sm:h-48 mb-6 sm:mb-8 group">
                <div className="absolute inset-0 rounded-full bg-[#558F6B] opacity-75 group-hover:opacity-100 transition-opacity duration-200" />
                <img
                  src="/peep.jpg"
                  alt="profile"
                  className="relative w-full h-full object-cover rounded-full ring-4 ring-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/default-profile.jpg";
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 mt-4">
              <Link to="" className="w-full">
                <button className="w-full py-2 px-4 rounded-lg text-gray-700 hover:bg-[#EBF2EE] hover:text-[#558F6B] transition-colors duration-200 flex items-center justify-center">
                  내 채팅 기록
                </button>
              </Link>
              <Link to="" className="w-full">
                <button className="w-full py-2 px-4 rounded-lg text-gray-700 hover:bg-[#EBF2EE] hover:text-[#558F6B] transition-colors duration-200 flex items-center justify-center">
                  계정 설정
                </button>
              </Link>
              <Link to="" className="w-full">
                <button className="w-full py-2 px-4 rounded-lg text-gray-700 hover:bg-[#EBF2EE] hover:text-[#558F6B] transition-colors duration-200 flex items-center justify-center" onClick={handleLogout}>
                  로그아웃
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#F7FAF8] p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 sm:mb-8">
              내 채팅 기록
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : chatRooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">채팅 기록이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
            )}
          </div>

          <button className="fixed bottom-6 right-6 bg-dark-green text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-[#4A7D5D] transition-all duration-200 group" onClick={handleCreateChat}>
            <div className="flex items-center justify-center">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="ml-2 text-sm sm:text-base font-medium">
                새 채팅 시작하기
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
