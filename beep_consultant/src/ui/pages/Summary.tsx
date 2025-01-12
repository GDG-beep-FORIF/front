import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { axiosInstance2 } from "../../api/axiosInstance";
import SummaryContent from "../components/SummaryContent";

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
  summary?: string;
  aiList?: any[],
  initialQuery?: string;
}

interface Props {
  summaryContent: string | undefined;
}

const SummaryPage: React.FC<SummaryPageProps> = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<DataFrom | null>(null);
  const [summaryContent, setSummaryContent] = useState<string>("");
  const { user } = useAuth();

  // Get summary from navigation state
  const { summary: locationSummary, aiList, initialQuery } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      if (!roomId || !user?.userId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch chat room basic info
        const detailResponse = await axiosInstance2.get(
          `/chat-rooms/${roomId}?user_id=${user.userId}`
        );
        setDetailData(detailResponse.data);

        // Get summary from location state or fetch from API if not available
        if (locationSummary) {
          setSummaryContent(locationSummary);
        } else {
          const summaryResponse = await axiosInstance2.get(
            `/chat-rooms/${roomId}/summary?user_id=${user.userId}`
          );
          setSummaryContent(summaryResponse.data.summary || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 에러가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [roomId, user?.userId, locationSummary]);

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
          {aiList && aiList.length > 0 ? (
            aiList.map((person: any) => (
              <div
                key={person.id}
                className="p-4 flex space-x-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-32 h-32 bg-[#EBF2EE] flex items-center justify-center flex-shrink-0 rounded-lg">
                  {person.imageUrl && (<img 
                    src={person.imageUrl} 
                    alt={`${person.name} Image`}
                    className="w-full h-full object-contain"
                  />)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium mb-1">{person.name}</h3>
                  {person.era && (
                    <p className="text-gray-600 mb-1">{person.era}</p>
                  )}
                  {person.achievements && person.achievements.length > 0 && (
                    <div className="mt-2">
                      {person.achievements.slice(0, 3).map((item: any) => (
                        <p key={item.id} className="text-gray-700">{item.achievementName}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : detailData?.persons ? (
            // detailData.persons.map((person: Person) => (
            //   <div
            //     key={person.person_id}
            //     className="p-4 flex space-x-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            //   >
            //     <div className="flex-grow">
            //       <h3 className="font-medium mb-1">{person.name}</h3>
            //       {person.era && (
            //         <p className="text-gray-600 mb-1">{person.era}</p>
            //       )}
            //       {person.description && (
            //         <p className="text-gray-700">{person.description}</p>
            //       )}
            //     </div>
            //   </div>
            // ))
            <></>
          ) : null}
        </div>

        <SummaryContent summaryContent={summaryContent} initialQuery={initialQuery}/>

        <div className="mt-12 space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-dark-green text-white py-3 rounded-md hover:bg-dark-green/90 transition-colors"
          >
            대시보드로 돌아가기
          </button>
          {/* <button
          onClick={() => navigate("/chat", { 
            state: { 
              chatHistory: location.state?.chatMessages,
              roomId: roomId
            }
          })}
          className="w-full bg-yellow-50 text-black py-3 rounded-md hover:bg-yellow-100 transition-colors"
        >
          채팅보러가기
        </button> */}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;