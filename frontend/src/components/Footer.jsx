import React, { useState } from 'react';
import { RiAdminLine, RiShieldStarLine } from 'react-icons/ri';

const Footer = () => {
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin_mode') === 'true');

    const toggleAdmin = () => {
        if (isAdmin) {
            localStorage.removeItem('admin_mode');
            setIsAdmin(false);
            window.location.reload();
        } else {
            const pass = prompt('관리자 비밀번호를 입력하세요');
            if (pass === 'admin1234') {
                localStorage.setItem('admin_mode', 'true');
                setIsAdmin(true);
                window.location.reload();
            } else {
                alert('비밀번호가 틀렸습니다.');
            }
        }
    };

    return (
        <footer className="py-8 border-t border-slate-200 mt-auto bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">


                <button
                    onClick={toggleAdmin}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all
                        ${isAdmin
                            ? 'bg-amber-100/50 text-amber-600 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                        }
                    `}
                >
                    {isAdmin ? <RiShieldStarLine size={14} /> : <RiAdminLine size={14} />}
                    <span>{isAdmin ? '관리자 모드 실행 중' : '관리자 로그인'}</span>
                </button>
            </div>
        </footer>
    );
};

export default Footer;
