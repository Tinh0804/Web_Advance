// ============= FILE: src/pages/Leaderboards.jsx =============

import { useState, useEffect } from 'react';
import leaderboardService from '../../services/leaderboardService';
import defaultAvatar from '../../assets/icons/avtdefault.png';

const Leaderboards = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId] = useState('8d8366a6-fd0d-4cba-a00d-7b8ba962c048');

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            setError(null);
            const leaderboardData = await leaderboardService.getLeaderboard();
            setUsers(leaderboardData);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Avatar fallback logic - xử lý tất cả trường hợp không có avatar
    const getAvatar = (avatar) => {
        if (!avatar ||
            avatar.trim() === "" ||
            avatar === "null" ||
            avatar === "undefined") {
            return defaultAvatar;
        }
        return avatar;
    };

    const getRankBadge = (rank) => {
        if (rank === 1) {
            return (
                <div className="w-14 h-14">
                    <svg viewBox="0 0 64 64" fill="none">
                        {/* Ribbon */}
                        <path d="M22 4 L32 2 L42 4 L42 22 L32 28 L22 22 Z"
                            fill="url(#gold-ribbon)" stroke="#D4AF37" strokeWidth="0.5" />

                        {/* Medal outer circle */}
                        <circle cx="32" cy="40" r="20" fill="url(#gold-outer)"
                            stroke="#B8860B" strokeWidth="1" />

                        {/* Medal inner circle */}
                        <circle cx="32" cy="40" r="17" fill="url(#gold-inner)" />

                        {/* Shine effect */}
                        <circle cx="28" cy="36" r="6" fill="#FFF" opacity="0.2" />

                        {/* Number */}
                        <text x="32" y="47" textAnchor="middle" fill="#FFF"
                            fontSize="20" fontWeight="bold" fontFamily="Arial">1</text>

                        <defs>
                            <linearGradient id="gold-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="100%" stopColor="#FFA500" />
                            </linearGradient>
                            <linearGradient id="gold-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="50%" stopColor="#FFC700" />
                                <stop offset="100%" stopColor="#DAA520" />
                            </linearGradient>
                            <linearGradient id="gold-inner" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFED4E" />
                                <stop offset="100%" stopColor="#FFB90F" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            );
        }

        if (rank === 2) {
            return (
                <div className="w-14 h-14">
                    <svg viewBox="0 0 64 64" fill="none">
                        {/* Ribbon */}
                        <path d="M22 4 L32 2 L42 4 L42 22 L32 28 L22 22 Z"
                            fill="url(#silver-ribbon)" stroke="#A8A8A8" strokeWidth="0.5" />

                        {/* Medal outer circle */}
                        <circle cx="32" cy="40" r="20" fill="url(#silver-outer)"
                            stroke="#999" strokeWidth="1" />

                        {/* Medal inner circle */}
                        <circle cx="32" cy="40" r="17" fill="url(#silver-inner)" />

                        {/* Shine effect */}
                        <circle cx="28" cy="36" r="6" fill="#FFF" opacity="0.3" />

                        {/* Number */}
                        <text x="32" y="47" textAnchor="middle" fill="#FFF"
                            fontSize="20" fontWeight="bold" fontFamily="Arial">2</text>

                        <defs>
                            <linearGradient id="silver-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#E0E0E0" />
                                <stop offset="100%" stopColor="#B0B0B0" />
                            </linearGradient>
                            <linearGradient id="silver-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#E8E8E8" />
                                <stop offset="50%" stopColor="#C0C0C0" />
                                <stop offset="100%" stopColor="#A0A0A0" />
                            </linearGradient>
                            <linearGradient id="silver-inner" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#F5F5F5" />
                                <stop offset="100%" stopColor="#C0C0C0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            );
        }

        if (rank === 3) {
            return (
                <div className="w-14 h-14">
                    <svg viewBox="0 0 64 64" fill="none">
                        {/* Ribbon */}
                        <path d="M22 4 L32 2 L42 4 L42 22 L32 28 L22 22 Z"
                            fill="url(#bronze-ribbon)" stroke="#8B4513" strokeWidth="0.5" />

                        {/* Medal outer circle */}
                        <circle cx="32" cy="40" r="20" fill="url(#bronze-outer)"
                            stroke="#8B4513" strokeWidth="1" />

                        {/* Medal inner circle */}
                        <circle cx="32" cy="40" r="17" fill="url(#bronze-inner)" />

                        {/* Shine effect */}
                        <circle cx="28" cy="36" r="6" fill="#FFF" opacity="0.2" />

                        {/* Number */}
                        <text x="32" y="47" textAnchor="middle" fill="#FFF"
                            fontSize="20" fontWeight="bold" fontFamily="Arial">3</text>

                        <defs>
                            <linearGradient id="bronze-ribbon" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#CD7F32" />
                                <stop offset="100%" stopColor="#A0522D" />
                            </linearGradient>
                            <linearGradient id="bronze-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#CD7F32" />
                                <stop offset="50%" stopColor="#B87333" />
                                <stop offset="100%" stopColor="#8B4513" />
                            </linearGradient>
                            <linearGradient id="bronze-inner" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#E89A5C" />
                                <stop offset="100%" stopColor="#C87533" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            );
        }

        // 4+
        return (
            <div className="w-14 h-14 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">{rank}</span>
            </div>
        );
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Đang tải bảng xếp hạng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white p-6">
                <div className="text-center max-w-md">
                    <div className="mb-4 text-red-500 text-6xl">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Không thể tải dữ liệu</h2>
                    <p className="text-red-500 mb-6 text-sm">{error}</p>

                    <button
                        onClick={loadLeaderboard}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md font-semibold"
                    >
                        🔄 Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600 text-lg font-medium">Chưa có người dùng nào</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto p-6">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Bronze League</h1>
                    <p className="text-gray-600">Top 20 advance to the next league</p>
                    <p className="text-yellow-500 font-semibold mt-1">4 days</p>
                </div>

                {/* LEADERBOARD LIST */}
                <div className="space-y-2">
                    {users.map((user) => {
                        const isCurrent = user.userAccountId === currentUserId;

                        return (
                            <div
                                key={user.userAccountId}
                                className={`flex items-center justify-between p-4 rounded-xl transition-all 
                                ${isCurrent ? 'bg-green-100 border-2 border-green-400' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    {/* Rank Badge */}
                                    <div className="flex items-center justify-center w-12">
                                        {getRankBadge(user.rank)}
                                    </div>

                                    {/* Avatar with fallback */}
                                    <div className="relative">
                                        <img
                                            src={getAvatar(user.avatar)}
                                            alt={user.displayName}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                            onError={(e) => {
                                                // Fallback nếu ảnh load lỗi
                                                e.target.src = defaultAvatar;
                                            }}
                                        />
                                        {/* Online indicator */}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <span className={`font-semibold ${isCurrent ? 'text-green-700' : 'text-gray-800'}`}>
                                            {user.displayName}
                                        </span>
                                        {user.phoneNumber && (
                                            <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                                        )}
                                    </div>
                                </div>

                                {/* XP and Streak */}
                                <div className="text-right">
                                    <span className="text-gray-600 font-semibold">{user.totalExperience} XP</span>
                                    {user.currentStreak > 0 && (
                                        <p className="text-xs text-orange-500">🔥 {user.currentStreak} ngày</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Leaderboards;