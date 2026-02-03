import React, { useState } from 'react';
import { RiCloseLine, RiUploadCloud2Line, RiCheckLine } from 'react-icons/ri';
import { submissionApi, API_BASE_URL } from '../api';

const SubmissionModal = ({ type, userId, onClose, onSuccess, editData = null }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [formData, setFormData] = useState(() => {
        if (editData) {
            let contentData = {};
            try { contentData = JSON.parse(editData.content); } catch (e) { }
            return {
                date: editData.date || new Date().toISOString().split('T')[0],
                amount: contentData.amount || '',
                link: contentData.link || '',
                text: contentData.text || '',
            };
        }
        return {
            date: new Date().toISOString().split('T')[0],
            amount: '',
            link: '',
            text: '',
        };
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(() => {
        if (editData) {
            try {
                const contentData = JSON.parse(editData.content);
                if (contentData.image_url) {
                    return `${API_BASE_URL}${contentData.image_url}`;
                }
            } catch (e) { }
        }
        return null;
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            setFile(droppedFile);
            setPreview(URL.createObjectURL(droppedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const submitData = new FormData();
        if (!editData) {
            submitData.append('type', type);
        }
        submitData.append('user_id', userId);
        submitData.append('date_str', formData.date);

        let content = {};
        if (type === 'account_book') {
            content = { amount: formData.amount };
        } else if (type === 'journal') {
            content = { link: formData.link, text: formData.text };
        } else if (type === 'content') {
            content = { link: formData.link };
        }

        submitData.append('content', JSON.stringify(content));
        if (file) {
            submitData.append('file', file);
        }

        try {
            if (editData) {
                const isAdmin = localStorage.getItem('admin_mode') === 'true';
                const adminPass = isAdmin ? 'admin1234' : '';
                await submissionApi.update(editData.id, submitData, adminPass);
            } else {
                await submissionApi.create(submitData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || (editData ? '수정에 실패했습니다.' : '제출에 실패했습니다. (1일 1회 제한 확인)'));
        } finally {
            setLoading(false);
        }
    };

    const getTypeConfig = () => {
        const configs = {
            account_book: { title: '가계부 인증', emoji: '💰', gradient: 'from-emerald-500 to-teal-600' },
            journal: { title: '저널링 제출', emoji: '📝', gradient: 'from-orange-500 to-red-500' },
            content: { title: '콘텐츠 공유', emoji: '🎬', gradient: 'from-purple-500 to-pink-500' },
        };
        return configs[type] || configs.content;
    };

    const config = getTypeConfig();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                {/* Header */}
                <div className={`relative p-8 bg-gradient-to-br ${config.gradient} text-white overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                                {config.emoji}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black">{config.title}</h2>
                                <p className="text-sm text-white/80 font-medium">+5 포인트 획득</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <RiCloseLine size={28} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Date */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">날짜</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white"
                            required
                        />
                    </div>

                    {/* Account Book Fields */}
                    {type === 'account_book' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">지출 금액</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="금액을 입력하세요"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full p-4 pr-12 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white"
                                    required
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">원</span>
                            </div>
                        </div>
                    )}

                    {/* Link Fields */}
                    {(type === 'journal' || type === 'content') && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                링크 {type === 'journal' ? '(Notion, 블로그 등)' : '(YouTube, 릴스 등)'}
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-medium bg-slate-50 focus:bg-white"
                                required
                            />
                        </div>
                    )}

                    {/* File Upload */}
                    {(type === 'account_book' || type === 'journal') && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">사진/증빙 자료</label>
                            <div
                                className={`relative border-2 border-dashed rounded-3xl p-6 transition-all group ${isDragging
                                    ? 'border-blue-500 bg-blue-100'
                                    : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                                    }`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {preview ? (
                                    <div className="relative">
                                        <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                                        <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                                            <RiCheckLine size={20} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 group-hover:text-blue-500 transition-colors">
                                        <RiUploadCloud2Line size={48} className="mb-3" />
                                        <p className="font-bold">{isDragging ? '여기에 드롭하세요' : '클릭 또는 드래그하여 이미지 업로드'}</p>
                                        <p className="text-xs mt-1">JPG, PNG 파일 지원</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-100">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`
              w-full p-5 bg-gradient-to-r ${config.gradient} text-white rounded-2xl 
              font-black text-lg hover:shadow-2xl transition-all 
              disabled:opacity-50 active:scale-[0.98]
              flex items-center justify-center gap-2
            `}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>{editData ? '수정 중...' : '제출 중...'}</span>
                            </>
                        ) : (
                            <>
                                <RiCheckLine size={24} />
                                <span>{editData ? '수정하기' : '인증하기'}</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmissionModal;
