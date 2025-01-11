import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SummaryPageProps {
  markdown?: string;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ markdown = '' }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 w-full max-w-6xl mx-auto z-50">
        <div 
          className="text-dark-green font-semibold text-xl cursor-pointer" 
          onClick={() => navigate("/")}
        >
          🐥 삐약상담소
        </div>
        <div></div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        {/* Title Section */}
        <h1 className="text-3xl font-bold mb-4">
          오늘 저녁밥은 무엇을 먹어야 할 지 고민이에요.
        </h1>
        <p className="text-gray-600 mb-8">2025년 1월 11일 16:00</p>

        {/* Cards Section */}
        <div className="space-y-6 mb-12">
          {[1, 2].map((index) => (
            <div 
              key={index} 
              className="p-4 flex space-x-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-32 h-32 bg-gray-200 flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="font-medium mb-1">이름 : 임마누엘 칸트</h3>
                <p className="text-gray-600 mb-1">시대 : 1990년대?</p>
                <p className="text-gray-700">짧은 소개, 정형명 모시기...</p>
              </div>
            </div>
          ))}
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <p className="text-lg">
            오늘은 저녁밥을 무엇을 먹어야 할 지에 대해 토론을 진행했어요.
            그리고 결론은 이렇게 났어요.
          </p>
          <p className="text-lg mb-12">
            오늘 점심은 치즈버거였으니, 오늘 저녁밥은 김치볶음밥 어때요?
          </p>
        </div>

        {/* Bottom Buttons */}
        <div className="mt-12 space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-dark-green text-white py-3 rounded-md hover:bg-dark-green/90 transition-colors"
          >
            대시보드로 돌아가기
          </button>
          <button 
            onClick={() => navigate('/chat')}
            className="w-full bg-yellow-50 text-black py-3 rounded-md hover:bg-yellow-100 transition-colors"
          >
            채팅보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;