import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/auth_api";
import { useAuth } from "../../contexts/AuthContext";

interface SignUpForm {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string; // 비밀번호 확인 필드 추가
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin, user } = useAuth();
  const [formData, setFormData] = useState<SignUpForm>({
    password: "",
    username: "",
    email: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
      try {
        // signup API 호출 시 passwordConfirm 제외하고 password만 전송
        const { passwordConfirm, ...signupData } = formData;
        await signup(signupData);
        navigate('/login');
      } catch (error: any) {
        setError("회원가입에 실패했습니다.");
      }
  };

  return (
    <div className="min-h-screen flex">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-6 py-4 fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl mx-auto z-50">
                    <div className="text-dark-green2 font-semibold text-xl" onClick={() => navigate("/")}>
                    🐥 삐약상담소
                    </div>
                    <div></div>
            </nav>

      {/* Right side - Login form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-dark-green mb-12">회원가입</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  아이디
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full border-0 border-b-2 border-light-green focus:outline-none focus:ring-0 focus:border-dark-green py-3 px-3"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-0 border-b-2 border-light-green focus:outline-none focus:ring-0 focus:border-dark-green py-3 px-3"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full border-0 border-b-2 border-light-green focus:outline-none focus:ring-0 focus:border-dark-green py-3 px-3"
                />
              </div>

              {/* 비밀번호 확인 필드 추가 */}
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className="mt-1 block w-full border-0 border-b-2 border-light-green focus:outline-none focus:ring-0 focus:border-dark-green py-3 px-3"
                />
              </div>

            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark-green hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>

      {/* Left side - Image/Title section */}
      <div className="flex-1 bg-light-green flex items-center justify-center">
        <h1 className="text-3xl font-bold">병아리그림</h1>
      </div>

    </div>
  );
};

export default SignUpPage;