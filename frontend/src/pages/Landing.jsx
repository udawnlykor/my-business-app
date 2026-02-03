import React, { useState, useEffect } from 'react';
import { authApi, userApi } from '../api';
import { RiUserLine, RiLoginCircleLine } from 'react-icons/ri';

const Landing = ({ onLogin }) => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [gender, setGender] = useState('Male');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await userApi.getAll();
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to load users', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError('');
        try {
            const response = await authApi.login(name, gender);
            onLogin(response.data);
        } catch (err) {
            setError('로그인에 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (user) => {
        onLogin(user);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Logo & Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-3xl mb-6 shadow-2xl shadow-blue-200 animate-float">
                        B
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        부트캠프 대시보드
                    </h1>
                    <p className="text-slate-500 font-medium">5주차: 팀스 업로드 인증 시스템</p>
                </div>

                <div className="bg-white rounded-[32px] p-10 shadow-2xl border border-slate-100">
                    {/* Existing Users */}
                    {users.length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <RiUserLine size={16} />
                                <span>등록된 멤버 ({users.length}명)</span>
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                {users.slice(0, 6).map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleSelectUser(user)}
                                        className="group relative p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                        ${user.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}
                      `}>
                                                {user.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-slate-400 font-medium">{user.total_points}P</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {users.length > 6 && (
                                <p className="text-xs text-slate-400 text-center">
                                    외 {users.length - 6}명의 멤버가 더 있습니다
                                </p>
                            )}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="relative mb-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-white text-sm font-bold text-slate-400">
                                또는 새로 만들기
                            </span>
                        </div>
                    </div>

                    {/* New User Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="본인의 이름을 입력하세요"
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:outline-none focus:border-blue-500 transition-all bg-slate-50 focus:bg-white font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">성별</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: 'Male', label: '남성', emoji: '👨' },
                                    { value: 'Female', label: '여성', emoji: '👩' }
                                ].map(g => (
                                    <button
                                        key={g.value}
                                        type="button"
                                        onClick={() => setGender(g.value)}
                                        className={`
                      p-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2
                      ${gender === g.value
                                                ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-lg shadow-blue-200'
                                                : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-200'
                                            }
                    `}
                                    >
                                        <span className="text-2xl">{g.emoji}</span>
                                        <span>{g.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-100">
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                w-full p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl 
                font-black text-lg hover:shadow-2xl hover:shadow-blue-200 
                transition-all disabled:opacity-50 active:scale-[0.98]
                flex items-center justify-center gap-2
              "
                        >
                            <RiLoginCircleLine size={24} />
                            <span>{loading ? '처리 중...' : '시작하기'}</span>
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-400 text-sm mt-8">
                    © 2026 Bootcamp Dashboard. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Landing;
