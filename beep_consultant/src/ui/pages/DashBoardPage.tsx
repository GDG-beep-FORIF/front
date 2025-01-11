import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Card = ({
  url,
  img,
  title,
  participants,
  date,
}: {
  url: string;
  img: string[];
  title: string;
  participants: string[];
  date: string;
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="w-full h-48 bg-black"></div>
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">
        {participants}
        <div className="flex justify-end">
          <span>{date}</span>
        </div>
      </p>
    </div>
  </div>
);
const Dashboard = () => {
  const Cards = [
    {
      url: "",
      img: [""],
      title: "오늘 저녁밥 메뉴에 대한 고민상담",
      author: ["고죠 사토루", "이순신"],
      duration: "2025-01-11",
    },
  ];

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
            <div className="w-52 h-52 bg-gray-100 rounded-lg border border-gray-200 flex justify-center items-center mb-10">
              <img
                src=""
                alt="profile"
                className="w-full h-full object-cover rounded-lg"
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
            {Cards.map((chat, index) => (
              <Card
                key={index}
                url={chat.url}
                img={chat.img}
                title={chat.title}
                participants={chat.author}
                date={chat.duration}
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
