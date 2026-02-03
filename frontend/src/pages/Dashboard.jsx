import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HallOfFame from '../components/HallOfFame';
import SubmissionButtons from '../components/SubmissionButtons';
import SubmissionFeed from '../components/SubmissionFeed';
import SubmissionModal from '../components/SubmissionModal';
import { userApi, submissionApi } from '../api';
import { RiFileList3Line, RiGroupLine, RiSparklingLine } from 'react-icons/ri';

const Dashboard = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [modalType, setModalType] = useState(null);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [uRes, sRes] = await Promise.all([
                userApi.getAll(),
                submissionApi.getAll(activeTab)
            ]);
            setUsers(uRes.data);
            setSubmissions(sRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { title: '전체', value: 'all', count: submissions.length },
        { title: '가계부', value: 'account_book' },
        { title: '저널링', value: 'journal' },
        { title: '콘텐츠', value: 'content' },
    ];

    const currentUserData = users.find(u => u.id == user.id);

    return (
        <div className="max-w-7xl mx-auto py-8">
            {/* Hero Stats Card */}
            <div className="mb-12 relative overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[32px] p-10 text-white shadow-2xl shadow-blue-200">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <RiSparklingLine size={20} className="text-amber-300" />
                                <span className="text-sm font-bold text-blue-100">환영합니다!</span>
                            </div>
                            <h1 className="text-4xl font-black mb-2">{user.name} 님</h1>
                            <p className="text-blue-100 font-medium text-lg">
                                오늘도 성장을 향해 한 걸음 더 나아가볼까요?
                            </p>
                        </div>

                        <div className="bg-white/20 backdrop-blur-xl px-10 py-6 rounded-3xl border-2 border-white/30 text-center min-w-[200px]">
                            <p className="text-xs font-black uppercase tracking-widest text-blue-100 mb-2">나의 총 포인트</p>
                            <p className="text-5xl font-black mb-1">{currentUserData?.total_points || 0}</p>
                            <p className="text-sm font-bold text-blue-100">POINTS</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hall of Fame */}
            <HallOfFame users={users} />

            {/* Submission Section Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-800 mb-2">활동 인증하기</h2>
                <p className="text-slate-500 font-medium">매일 꾸준히 인증하고 포인트를 획득하세요!</p>
            </div>

            {/* Submission Buttons */}
            <SubmissionButtons onOpenModal={setModalType} />

            {/* Feed Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                            <RiFileList3Line size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">활동 피드</h2>
                            <p className="text-sm text-slate-500 font-medium">모든 멤버의 인증 내역</p>
                        </div>
                    </div>

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
                                {tab.count !== undefined && activeTab === tab.value && (
                                    <span className="ml-2 text-xs opacity-70">({tab.count})</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-400 font-medium">데이터를 불러오는 중...</p>
                    </div>
                ) : (
                    <SubmissionFeed
                        submissions={submissions}
                        currentUserId={user.id}
                        onRefresh={loadData}
                        onEdit={(submission) => {
                            setEditData(submission);
                            setModalType(submission.type);
                        }}
                    />
                )}
            </div>

            {/* Member Directory Preview */}
            <div className="mt-20 border-t-2 border-slate-100 pt-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white">
                        <RiGroupLine size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">함께 달리는 멤버</h2>
                        <p className="text-sm text-slate-500 font-medium">총 {users.length}명의 멤버가 활동 중입니다</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {users.map(u => (
                        <Link
                            to={`/profile/${u.id}`}
                            key={u.id}
                            className="bg-white p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 transition-all group card-hover cursor-pointer"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3
                  ${u.gender === 'Male' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}
                `}>
                                    {u.name[0]}
                                </div>
                                <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">
                                    {u.name}
                                </p>
                                <p className="text-xs text-slate-400 font-bold">{u.total_points}P</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {modalType && (
                <SubmissionModal
                    type={modalType}
                    userId={user.id}
                    onClose={() => {
                        setModalType(null);
                        setEditData(null);
                    }}
                    onSuccess={loadData}
                    editData={editData}
                />
            )}
        </div>
    );
};

export default Dashboard;
