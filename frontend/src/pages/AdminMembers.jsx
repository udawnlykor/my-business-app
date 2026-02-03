import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../api';
import { RiSearchLine, RiUserLine, RiMenLine, RiWomenLine, RiArrowLeftLine } from 'react-icons/ri';

const AdminMembers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, search, genderFilter]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await userApi.getAll();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let result = users;

        if (search) {
            result = result.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (genderFilter !== 'all') {
            result = result.filter(u => u.gender === genderFilter);
        }

        setFilteredUsers(result);
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/dashboard" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                    <RiArrowLeftLine size={24} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-800">멤버 관리</h1>
                    <p className="text-slate-500 font-medium">등록된 모든 멤버를 확인하고 관리합니다.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="이름으로 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-colors font-medium"
                        />
                    </div>

                    {/* Gender Filter */}
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                        {[
                            { value: 'all', label: '전체', icon: <RiUserLine /> },
                            { value: 'Male', label: '남성', icon: <RiMenLine /> },
                            { value: 'Female', label: '여성', icon: <RiWomenLine /> },
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setGenderFilter(filter.value)}
                                className={`
                                    flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all
                                    ${genderFilter === filter.value
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }
                                `}
                            >
                                {filter.icon}
                                <span>{filter.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block w-10 h-10 border-4 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="px-6 py-4">멤버</th>
                                    <th className="px-6 py-4">성별</th>
                                    <th className="px-6 py-4">총 포인트</th>
                                    <th className="px-6 py-4">가입일</th>
                                    <th className="px-6 py-4 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                                    ${user.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}
                                                `}>
                                                    {user.name[0]}
                                                </div>
                                                <span className="font-bold text-slate-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                px-3 py-1 rounded-full text-xs font-bold
                                                ${user.gender === 'Male'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-pink-50 text-pink-600'
                                                }
                                            `}>
                                                {user.gender === 'Male' ? '남성' : '여성'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-800">{user.total_points}P</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/profile/${user.id}`}
                                                className="text-blue-500 hover:text-blue-700 font-bold text-sm"
                                            >
                                                상세보기
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-slate-400 font-medium">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminMembers;
