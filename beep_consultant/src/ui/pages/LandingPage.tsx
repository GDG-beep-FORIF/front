import { useNavigate } from "react-router-dom";
import FilledButton from "../components/FilledButton";
import TextButton from "../components/TextButton";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
    navigate("/signup");
  };
  const moveTo = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-40">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between py-4 fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm w-full px-4 sm:px-6 z-50">
          <div className="text-dark-green font-semibold text-lg sm:text-xl">
            🐥 삐약상담소
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <TextButton text="로그인" onClick={handleLogin} />
            <FilledButton text="회원가입" onClick={handleSignup} />
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center pt-20 sm:pt-24 lg:space-x-6">
          {/* Left Section */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh]">
              <div className="w-full px-4">
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">
                    24시간 언제나 열려있는
                    <br className="hidden sm:block" />
                    당신의 AI 상담소,
                    <br className="hidden sm:block" />
                    당신만의 특별한 기록
                  </h1>
                  <p className="text-gray-600 mb-8 text-sm sm:text-base">
                    나의 롤모델과 상담할 수 있는 삐약상담소
                  </p>
                  <div className="flex justify-center lg:justify-start space-x-4">
                    <FilledButton text="시작하기" onClick={() => navigate('/signup')} />
                    <TextButton text="더 알아보기" onClick={() => {}} />
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Right Section - Mock Chat Interface */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 px-4">
            <div className="bg-white rounded-lg shadow-xl p-4 max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-end mb-4">
                  <div className="max-w-[80%]">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <p className="text-sm">혁신과 창의성을 유지하는 방법이 있을까요?</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">스티브 잡스</p>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm">직관을 믿고, 항상 불편함을 감수하면서 세상을 바꾸는 일을 하세요. 실패를 두려워하지 마세요.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-40">

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center sm:pt-24 lg:space-x-6">

          {/* Right Section - Mock Chat Interface */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 px-4">
            <div className="bg-white rounded-lg shadow-xl p-4 max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-end mb-4">
                  <div className="max-w-[80%]">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <p className="text-sm">회사 상사에게 받는 스트레스를 어떻게 해결해야 할까요?</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">퇴계 이황</p>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm">고민을 나누어 주셔서 감사합니다. 상사의 요구가 부담스러울 수 있겠지만, 그 안에서 배울 수 있는 것이 무엇인지 찾아보는 것도 좋은 방법일 것입니다. 한발 물러서서 상황을 객관적으로 바라보려고 노력하는 것은 종종 많은 것을 깨닫게 해줍니다. 또한, 침착하게 자신의 생각을 표현할 수 있는 기회를 찾아보시길 권해드립니다.<br/>버지니아 울프 여사, 당신은 현대의 사회적 변화를 많이 경험하신 분으로서 어떤 조언을 드릴 수 있겠습니까?</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">버지니아 울프</p>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm">퇴계 선생님의 말씀은 참으로 깊이가 있습니다. 자연과의 조화를 통한 스트레스 해결법이라니, 참신하고도 실천할 가치가 있는 방법인 것 같군요. 사실 저의 시대, 그러니까 빅토리아 시대의 막바지와 모더니즘의 시대가 오면서 우리는 사회적 변화와 개인의 내면적 갈등을 많이 경험하게 됐습니다. 저는 이러한 변화를 소설과 에세이로 풀어내고자 했고, 그 과정에서 내면의 목소리에 귀 기울이는 것을 크게 중요시했습니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Section */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh]">
              <div className="w-full px-4">
                <div className="text-center lg:text-left">
                  <p className="text-gray-600 mb-8 text-sm sm:text-base">
                    나의 고민에 대해 머리 맞대고 고민해주는
                    <br className="hidden sm:block" />
                    퇴계 이황과 버지니아 울프도 삐약상담소에서
                  </p>
                  <div className="flex justify-center lg:justify-start space-x-4">
                    <FilledButton text="시작하기" onClick={() => navigate('/signup')} />
                    <TextButton text="더 알아보기" onClick={() => {}} />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        
        
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-12 sm:mt-40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold text-dark-green">
              삐약상담소
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            © 2025 삐약상담소 OFFICIAL. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a href="/about" className="text-sm text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="/faq" className="text-sm text-gray-600 hover:text-gray-900">
              FAQ
            </a>
            <a href="/report" className="text-sm text-gray-600 hover:text-gray-900">
              Report
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;