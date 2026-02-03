import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiTrophyLine, RiMedalLine } from 'react-icons/ri';

const Rankings = ({ users = [] }) => {
    const navigate = useNavigate();
    const sortedUsers = [...users].sort((a, b) => b.total_points - a.total_points);

    const getRankIcon = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold mb-4 transition-colors"
                >
                    <RiArrowLeftLine size={20} />
                    <span>대시보드로 돌아가기</span>
                </button>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                        <RiTrophyLine size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">전체 랭킹</h1>
                        <p className="text-slate-500 font-medium">모든 멤버의 순위를 확인하세요</p>
                    </div>
                </div>
            </div>

            {/* Rankings List */}
            <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-lg">
                {sortedUsers.map((user, index) => {
                    const rankIcon = getRankIcon(index);
                    const isTopThree = index < 3;

                    return (
                        <div
                            key={user.id}
                            className={`
                                flex items-center gap-4 p-6 border-b border-slate-100 last:border-b-0
                                hover:bg-slate-50 transition-colors
                                ${isTopThree ? 'bg-gradient-to-r from-amber-50 to-transparent' : ''}
                            `}
                        >
                            {/* Rank */}
                            <div className={`
                                w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg
                                ${isTopThree ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-100 text-slate-600'}
                            `}>
                                {rankIcon || (index + 1)}
                            </div>

                            {/* Avatar */}
                            <div className={`
                                w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl
                                ${user.gender === 'Male' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}
                            `}>
                                {user.name[0]}
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-lg">{user.name}</p>
                                <p className="text-sm text-slate-400 font-medium">@{user.name.toLowerCase()}</p>
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <p className="text-2xl font-black text-blue-600">{user.total_points}</p>
                                <p className="text-xs text-slate-400 font-bold">POINTS</p>
                            </div>
                        </div>
                    );
                })}

                {sortedUsers.length === 0 && (
                    <div className="py-20 text-center">
                        <RiTrophyLine className="mx-auto mb-4 text-slate-300" size={48} />
                        <p className="text-slate-400 font-medium">아직 랭킹 정보가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rankings;
