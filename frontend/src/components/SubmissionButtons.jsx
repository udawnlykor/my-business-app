import React from 'react';
import { RiWallet3Line, RiBookOpenLine, RiMovieLine, RiFireLine } from 'react-icons/ri';

const SubmissionButtons = ({ onOpenModal }) => {
    const buttons = [
        {
            type: 'account_book',
            label: '가계부 인증',
            icon: RiWallet3Line,
            gradient: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-500',
            description: '오늘의 지출을 기록하세요'
        },
        {
            type: 'journal',
            label: '저널링 제출',
            icon: RiBookOpenLine,
            gradient: 'from-orange-500 to-red-500',
            iconBg: 'bg-orange-500',
            description: '오늘 하루를 돌아보세요'
        },
        {
            type: 'content',
            label: '콘텐츠 발행',
            icon: RiMovieLine,
            gradient: 'from-purple-500 to-pink-500',
            iconBg: 'bg-purple-500',
            description: '내가 발행한 콘텐츠를 공유하세요'
        },
    ];

    return (
        <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {buttons.map((btn, index) => (
                    <button
                        key={btn.type}
                        onClick={() => onOpenModal(btn.type)}
                        className={`
              group relative bg-white rounded-3xl p-8 
              border-2 border-slate-100 hover:border-transparent
              card-hover overflow-hidden text-left
            `}
                    >
                        {/* Gradient Overlay on Hover */}
                        <div className={`
              absolute inset-0 bg-gradient-to-br ${btn.gradient} opacity-0 
              group-hover:opacity-100 transition-opacity duration-300
            `}></div>

                        {/* Content */}
                        <div className="relative z-10 flex items-center gap-6">
                            {/* Icon */}
                            <div className={`
                w-16 h-16 rounded-2xl ${btn.iconBg} 
                flex items-center justify-center text-white
                group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300
                shadow-lg
              `}>
                                <btn.icon size={32} />
                            </div>

                            {/* Text */}
                            <div className="flex-1">

                                <h3 className="text-xl font-black text-slate-800 group-hover:text-white transition-colors mb-1 whitespace-nowrap">
                                    {btn.label}
                                </h3>
                                <p className="text-sm text-slate-400 group-hover:text-white/80 transition-colors">
                                    {btn.description}
                                </p>
                            </div>

                            {/* Points Badge */}
                            <div className="
                px-4 py-2 rounded-full bg-amber-100 text-amber-700 
                font-black text-sm
                group-hover:bg-white/20 group-hover:text-white transition-colors
              ">
                                +5P
                            </div>
                        </div>


                    </button>
                ))}
            </div>
        </div>
    );
};

export default SubmissionButtons;
