// ============= FILE: src/services/leaderboardService.js =============

import axiosInstance from './axiosConfig';

const leaderboardService = {

    getLeaderboard: async () => {
        try {
            const response = await axiosInstance.get('/api/Profile');

            if (response.data.status && response.data.data) {

                const processedData = response.data.data
                    .map(user => ({
                        ...user,

                        // Không tự tạo avatar — để FE xử lý fallback
                        avatar: user.avatar ?? null,

                        displayName: user.fullName || 'Người dùng',

                        totalExperience: user.totalExperience ?? 0,
                        currentStreak: user.currentStreak ?? 0,
                        longestStreak: user.longestStreak ?? 0,
                    }))
                    .sort((a, b) => b.totalExperience - a.totalExperience)
                    .map((user, index) => ({
                        ...user,
                        rank: index + 1
                    }));

                return processedData;
            } else {
                console.error('API error:', response.data.message);
                return [];
            }

        } catch (error) {
            console.error('Lỗi khi lấy leaderboard:', error);
            throw error;
        }
    },

    getFallbackAvatar: (name) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    }
};

export default leaderboardService;
