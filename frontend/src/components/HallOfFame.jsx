import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMedalLine, RiTrophyLine, RiArrowRightLine } from 'react-icons/ri';

const HallOfFame = ({ users }) => {
    const [period, setPeriod] = useState('weekly');
    const navigate = useNavigate();

    const top3 = [...users].sort((a, b) => b.total_points - a.total_points).slice(0, 3);

    const getRankBadge = (index) => {
        const badges = [
            { icon: '🥇', label: '1위' },
            { icon: '🥈', label: '2위' },
            { icon: '🥉', label: '3위' },
        ];
        return badges[index];
    };

    return (
        <div className="mb-16">
            {/* Header with Tabs */}
            <div className="text-center mb-8">


                {/* Period Tabs */}
                <div className="flex justify-center gap-2 mb-6">
                    <button
                        onClick={() => setPeriod('weekly')}
                        className={`
                            px-6 py-2 rounded-full text-sm font-bold transition-all
                            ${period === 'weekly'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                        `}
                    >
                        <RiTrophyLine className="inline mr-1" size={14} />
                        WEEKLY BEST
                    </button>
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={`
                            px-6 py-2 rounded-full text-sm font-bold transition-all
                            ${period === 'monthly'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                        `}
                    >
                        <RiTrophyLine className="inline mr-1" size={14} />
                        MONTHLY BEST
                    </button>
                </div>
            </div>

            {/* Top 3 - Horizontal Layout */}
            <div className="flex justify-center items-end gap-4 mb-8 max-w-4xl mx-auto">
                {top3.map((user, index) => {
                    const badge = getRankBadge(index);
                    const heights = ['h-64', 'h-56', 'h-52']; // Different heights for visual hierarchy
                    const scales = ['scale-105', 'scale-100', 'scale-95'];

                    return (
                        <div
                            key={user.id}
                            className={`flex-1 ${scales[index]} transition-transform hover:scale-110`}
                        >
                            <div
                                className={`
                                    relative bg-white rounded-3xl p-6 ${heights[index]}
                                    ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-2xl shadow-amber-200' : 'border-2 border-slate-100 shadow-lg'}
                                    overflow-hidden flex flex-col items-center justify-center
                                `}
                            >
                                {/* Decorative Background for 1st place */}
                                {index === 0 && (
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                                    </div>
                                )}

                                {/* Rank Badge */}
                                <div className="relative z-10 text-center">
                                    <div className={`
                                        w-16 h-16 rounded-full flex items-center justify-center text-4xl mx-auto mb-3
                                        ${index === 0 ? 'bg-white/20 backdrop-blur-sm' : 'bg-gradient-to-br from-amber-400 to-orange-500'}
                                        shadow-lg
                                    `}>
                                        {badge.icon}
                                    </div>

                                    {/* User Info */}
                                    <h3 className={`text-xl font-black mb-1 ${index === 0 ? 'text-white' : 'text-slate-800'}`}>
                                        {user.name}
                                    </h3>


                                    {/* Points Display */}
                                    <div className={`
                                        inline-flex flex-col items-center px-5 py-3 rounded-2xl
                                        ${index === 0 ? 'bg-white/20 backdrop-blur-sm' : 'bg-slate-50'}
                                    `}>
                                        <span className={`text-3xl font-black ${index === 0 ? 'text-white' : 'text-blue-600'}`}>
                                            {user.total_points}
                                        </span>
                                        <span className={`text-xs font-bold ${index === 0 ? 'text-amber-100' : 'text-slate-400'}`}>
                                            POINTS
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {top3.length === 0 && (
                    <div className="col-span-3 py-20 text-center">
                        <div className="inline-block p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <RiTrophyLine className="mx-auto mb-4 text-slate-300" size={48} />
                            <p className="text-slate-400 font-medium">
                                아직 랭킹 정보가 없습니다.<br />
                                첫 인증의 주인공이 되어보세요!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* View All Rankings Button */}
            <div className="text-center">
                <button
                    onClick={() => navigate('/rankings')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
                >
                    <span>전체 랭킹 보기</span>
                    <RiArrowRightLine size={20} />
                </button>
            </div>
        </div>
    );
};

export default HallOfFame;
