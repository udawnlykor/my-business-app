import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiLogoutBoxLine, RiAdminLine, RiShieldStarLine } from 'react-icons/ri';

const Header = ({ user, onLogout }) => {
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin_mode') === 'true');
    const navigate = useNavigate();



    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div>
                        <h1 className="text-3xl font-black text-blue-600">
                            연애는 유재은
                        </h1>
                    </div>
                </Link>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* User Info */}
                    <Link
                        to={`/profile/${user.id}`}
                        className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.name[0]}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {user.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">활동중인 멤버</p>
                        </div>
                    </Link>

                    {/* Admin Toggle */}
                    {isAdmin && (
                        <Link to="/admin/members" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition-all">
                            <RiShieldStarLine size={14} />
                            <span>멤버 관리</span>
                        </Link>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onLogout}
                            className="p-3 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                            title="로그아웃"
                        >
                            <RiLogoutBoxLine size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
