import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth_api";
import { useAuth } from "../../contexts/AuthContext";

interface LoginForm {
    username: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { login: authLogin, user } = useAuth();
    const [formData, setFormData] = useState<LoginForm>({
        username: "",
        password: "",
    });
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
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
        if (!formData.username.trim() || !formData.password.trim()) {
            setError("모든 필드를 입력해주세요.");
            return;
        }

        try {
            const response = await login(formData.username, formData.password);
            authLogin({
                user: response.data.user,
            });
            navigate("/dashboard");
        } catch (error: any) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
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

            {/* Left side - Image/Title section */}
            <div className="flex-1 bg-light-green flex items-center justify-center">
                <h1 className="text-3xl font-bold">병아리그림</h1>
            </div>

            {/* Right side - Login form */}
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-dark-green mb-12">
                            로그인
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="id"
                                    className="block text-sm font-medium text-gray-700">
                                    이메일
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
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700">
                                    비밀번호
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 mb-24 block w-full border-0 border-b-2 border-light-green focus:outline-none focus:ring-0 focus:border-dark-green py-3 px-3"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark-green hover:dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;