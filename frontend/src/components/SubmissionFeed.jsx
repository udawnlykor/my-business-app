import React from 'react';
import { RiDeleteBin7Line, RiExternalLinkLine, RiUserLine, RiCalendarLine, RiTimeLine } from 'react-icons/ri';
import { submissionApi, API_BASE_URL } from '../api';

const SubmissionFeed = ({ submissions, currentUserId, onRefresh, onEdit }) => {
    const isAdmin = localStorage.getItem('admin_mode') === 'true';

    const handleDelete = async (id, ownerId) => {
        if (!window.confirm('정말 삭제하시겠습니까? 포인트가 차감됩니다.')) return;

        try {
            const adminPass = isAdmin ? 'admin1234' : '';
            await submissionApi.delete(id, currentUserId, adminPass);
            onRefresh();
        } catch (err) {
            alert('삭제에 실패했습니다. 본인의 게시물만 삭제할 수 있습니다.');
        }
    };

    const getTypeConfig = (type) => {
        const configs = {
            account_book: {
                label: '가계부',
                gradient: 'from-emerald-500 to-teal-600',
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                icon: '💰'
            },
            journal: {
                label: '저널링',
                gradient: 'from-orange-500 to-red-500',
                bg: 'bg-orange-50',
                text: 'text-orange-700',
                icon: '📝'
            },
            content: {
                label: '콘텐츠',
                gradient: 'from-purple-500 to-pink-500',
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                icon: '🎬'
            },
        };
        return configs[type] || configs.content;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}월 ${day}일`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((sub) => {
                let contentData = {};
                try { contentData = JSON.parse(sub.content); } catch (e) { contentData = { text: sub.content }; }

                const typeConfig = getTypeConfig(sub.type);
                const canDelete = sub.user_id == currentUserId || isAdmin;

                return (
                    <div
                        key={sub.id}
                        className="group bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-200 overflow-hidden card-hover shadow-sm hover:shadow-xl transition-all"
                    >
                        {/* Image */}
                        {contentData.image_url && (
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                                <img
                                    src={`${API_BASE_URL}${contentData.image_url}`}
                                    alt="인증"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1517433447755-d14d79057c70?w=800&auto=format&fit=crop&q=60';
                                    }}
                                />
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${typeConfig.gradient} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{typeConfig.icon}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${typeConfig.bg} ${typeConfig.text}`}>
                                        {typeConfig.label}
                                    </span>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-black">
                                    +5P
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {sub.owner_name?.[0] || '?'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800">{sub.owner_name}</p>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            <RiCalendarLine size={12} />
                                            {formatDate(sub.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <RiTimeLine size={12} />
                                            {new Date(sub.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Details */}
                            <div className="mb-4">
                                {contentData.amount && (
                                    <div className="mb-3">
                                        <p className="text-xs text-slate-500 font-bold mb-1">지출 금액</p>
                                        <p className="text-2xl font-black text-slate-800">
                                            {Number(contentData.amount).toLocaleString()}원
                                        </p>
                                    </div>
                                )}
                                {contentData.text && (
                                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                        {contentData.text}
                                    </p>
                                )}
                                {contentData.link && (
                                    <a
                                        href={contentData.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        <RiExternalLinkLine size={16} />
                                        <span>링크 바로가기</span>
                                    </a>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {canDelete && (
                                <div className="flex gap-2">
                                    {(sub.user_id == currentUserId || isAdmin) && (
                                        <button
                                            onClick={() => onEdit(sub)}
                                            className="flex-1 py-3 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-bold border-2 border-blue-100 hover:border-blue-200"
                                        >
                                            <RiExternalLinkLine size={16} className="rotate-90" />
                                            <span>수정하기</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(sub.id, sub.user_id)}
                                        className="flex-1 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm font-bold border-2 border-red-100 hover:border-red-200"
                                    >
                                        <RiDeleteBin7Line size={16} />
                                        <span>삭제하기</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {submissions.length === 0 && (
                <div className="col-span-full py-20">
                    <div className="text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-slate-400 font-bold text-lg">표시할 게시물이 없습니다</p>
                        <p className="text-slate-300 text-sm mt-2">첫 인증의 주인공이 되어보세요!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionFeed;
