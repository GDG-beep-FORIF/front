import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface DataFrom {
  room_id: string;
  title: string;
  status: string;
  created_at: string;
  persons: Person[];
  summary?: string;
}

export interface Person {
  person_id: string;
  name: string;
  era?: string;
  description?: string;
}

interface SummaryPageProps {
  markdown?: string;
}

const userId = "bc430308-def0-4203-9971-437fdba5283a";

const SummaryPage: React.FC<SummaryPageProps> = ({ markdown = "" }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<DataFrom | null>(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!roomId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL3}/chat-rooms/${roomId}?user_id=${userId}`
        );

        if (!response.ok) {
          throw new Error("데이터를 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setDetailData(data);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 에러가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, [roomId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-44"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-[#558F6B] text-white rounded-md hover:bg-[#4A7D5D] transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">데이터를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-[#558F6B] text-white rounded-md hover:bg-[#4A7D5D] transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-6xl mx-auto">
          <div
            className="text-[#558F6B] font-semibold text-xl cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            🐥 삐약상담소
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-4">{detailData.title}</h1>
        <p className="text-gray-600 mb-8">
          {new Date(detailData.created_at).toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <div className="space-y-6 mb-12">
          {detailData.persons.map((person) => (
            <div
              key={person.person_id}
              className="p-4 flex space-x-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-32 h-32 bg-[#EBF2EE] flex items-center justify-center flex-shrink-0 rounded-lg"></div>
              <div className="flex-grow">
                <h3 className="font-medium mb-1">이름: {person.name}</h3>
                {person.era && (
                  <p className="text-gray-600 mb-1">시대: {person.era}</p>
                )}
                {person.description && (
                  <p className="text-gray-700">{person.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {detailData.summary && (
          <div className="space-y-6">
            <div className="prose max-w-none">{detailData.summary}</div>
          </div>
        )}

        <div className="mt-12 space-y-4">
          <div className="mt-12 space-y-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-dark-green text-white py-3 rounded-md hover:bg-dark-green/90 transition-colors"
            >
              대시보드로 돌아가기
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="w-full bg-yellow-50 text-black py-3 rounded-md hover:bg-yellow-100 transition-colors"
            >
              채팅보러가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
