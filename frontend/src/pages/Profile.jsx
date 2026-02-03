import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi, submissionApi } from '../api';
import SubmissionFeed from '../components/SubmissionFeed';
import SubmissionModal from '../components/SubmissionModal';
import { RiArrowLeftLine, RiUserLine, RiLineChartLine, RiEditLine, RiCloseLine } from 'react-icons/ri';

const Profile = ({ currentUser }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [updating, setUpdating] = useState(false);

    const [activeTab, setActiveTab] = useState('all');

    // Props for SubmissionModal
    const [submissionModalType, setSubmissionModalType] = useState(null);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const [uRes, sRes] = await Promise.all([
                userApi.getById(id),
                submissionApi.getAll('all')
            ]);
            setUser(uRes.data);
            setSelectedGender(uRes.data.gender);
            // Filter submissions for this user only
            setSubmissions(sRes.data.filter(s => s.user_id == id));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateGender = async () => {
        setUpdating(true);
        try {
            await userApi.updateGender(id, selectedGender);
            await loadProfile();
            setShowEditModal(false);
        } catch (err) {
            alert('성별 수정에 실패했습니다.');
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-slate-400">프로필을 불러오는 중...</div>;
    if (!user) return <div className="text-center py-20 font-bold text-red-500">사용자를 찾을 수 없습니다.</div>;

    const isOwnProfile = currentUser.id == id;

    const tabs = [
        { title: '전체', value: 'all', count: submissions.length },
        { title: '가계부', value: 'account_book', count: submissions.filter(s => s.type === 'account_book').length },
        { title: '저널링', value: 'journal', count: submissions.filter(s => s.type === 'journal').length },
        { title: '콘텐츠', value: 'content', count: submissions.filter(s => s.type === 'content').length },
    ];

    const filteredSubmissions = activeTab === 'all'
        ? submissions
        : submissions.filter(s => s.type === activeTab);

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
                <RiArrowLeftLine />
                대시보드로 돌아가기
            </Link>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-8">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-black ${user.gender === 'Male' ? 'bg-blue-500 shadow-lg shadow-blue-100' : 'bg-pink-500 shadow-lg shadow-pink-100'
                    }`}>
                    {user.name[0]}
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                        <h1 className="text-4xl font-black text-slate-800">{user.name}</h1>
                        <div className="flex items-center gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${user.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                                }`}>
                                {user.gender === 'Male' ? 'MEMBER (M)' : 'MEMBER (F)'}
                            </span>
                            {isOwnProfile && (
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="성별 수정"
                                >
                                    <RiEditLine size={16} className="text-slate-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                            <RiUserLine />
                            <span>{new Date(user.created_at).toLocaleDateString()} 가입</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold">
                            <RiLineChartLine />
                            <span>총 {submissions.length}회 활동</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl px-10 py-6 text-center min-w-[180px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL POINTS</p>
                    <p className="text-4xl font-black">{user.total_points}P</p>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                    <h2 className="text-2xl font-black text-slate-800">{user.name} 님의 활동</h2>

                    {/* Tabs */}
                    <div className="flex bg-white p-2 rounded-2xl border-2 border-slate-100 overflow-x-auto scrollbar-hide shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`
                                    px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                                    ${activeTab === tab.value
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }
                                `}
                            >
                                {tab.title}
                                <span className="ml-2 text-xs opacity-70">({tab.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                <SubmissionFeed
                    submissions={filteredSubmissions}
                    currentUserId={currentUser.id}
                    onRefresh={loadProfile}
                    onEdit={(submission) => {
                        setEditData(submission);
                        setSubmissionModalType(submission.type);
                    }}
                />
            </div>

            {/* Gender Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        {/* Header */}
                        <div className="relative p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black">성별 수정</h2>
                                    <p className="text-sm text-white/80 font-medium">올바른 성별을 선택하세요</p>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                                >
                                    <RiCloseLine size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="space-y-3">
                                <button
                                    onClick={() => setSelectedGender('Male')}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-between ${selectedGender === 'Male'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-200 hover:border-blue-300 text-slate-700'
                                        }`}
                                >
                                    <span>남성 (Male)</span>
                                    {selectedGender === 'Male' && <span className="text-2xl">✓</span>}
                                </button>
                                <button
                                    onClick={() => setSelectedGender('Female')}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-between ${selectedGender === 'Female'
                                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                                        : 'border-slate-200 hover:border-pink-300 text-slate-700'
                                        }`}
                                >
                                    <span>여성 (Female)</span>
                                    {selectedGender === 'Female' && <span className="text-2xl">✓</span>}
                                </button>
                            </div>

                            <button
                                onClick={handleUpdateGender}
                                disabled={updating || selectedGender === user.gender}
                                className="w-full mt-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? '수정 중...' : '수정하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Edit Modal */}
            {submissionModalType && (
                <SubmissionModal
                    type={submissionModalType}
                    userId={currentUser.id}
                    onClose={() => {
                        setSubmissionModalType(null);
                        setEditData(null);
                    }}
                    onSuccess={loadProfile}
                    editData={editData}
                />
            )}
        </div>
    );
};

export default Profile;
