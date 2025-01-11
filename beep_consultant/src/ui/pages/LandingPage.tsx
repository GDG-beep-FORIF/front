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
      <div className="max-w-6xl mx-auto px-6 mb-40">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-6 py-4 fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl mx-auto z-50">
          <div className="text-dark-green font-semibold text-xl">
            🐥 삐약상담소
          </div>

          <div className="flex items-center space-x-4">
            <>
              <TextButton text="로그인" onClick={handleLogin} />
              <FilledButton text="회원가입" onClick={handleSignup} />
            </>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex items-center space-x-6">
          <div>
            <div
              className="flex items-center justify-center"
              style={{ height: "calc(100vh - 72px)" }}
            >
              <div className="max-w-7xl w-full px-4">
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-8">
                    24시간 언제나 열려있는 당신의 AI 상담소,
                    <br />
                    당신만의 특별한 기록
                  </h1>
                </div>
                <div>
                  <TextButton text="move" onClick={moveTo} />
                </div>
              </div>
            </div>
          </div>
          <div>실제 상담 화면 비슷하게?</div>
        </div>
      </div>
      <footer className="mt-auto bg-gray-100 py-6 mt-40">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8"></div>
            <span className="text-xl font-bold text-dark-green">
              삐약상담소
            </span>
          </div>
          <div className="text-sm text-gray-600">
            © 2025 삐약상담소 OFFICIAL. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="/faq" className="text-gray-600 hover:text-gray-900">
              FAQ
            </a>
            <a href="/report" className="text-gray-600 hover:text-gray-900">
              Report
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
