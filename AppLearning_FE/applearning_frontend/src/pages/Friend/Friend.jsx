import React, { useState } from "react";
import { UserPlus, Users, Crown, TrendingUp } from "lucide-react";

export default function Friend() {
    const [tab, setTab] = useState("following");

    const sampleFriends = [
        { name: "Johnny Doe", xp: 84323, avatar: "https://i.pravatar.cc/100?img=12", rank: 1 },
        { name: "Doe—rives", xp: 12227, rank: 2 },
        { name: "Don", xp: 4045, rank: 3 },
        { name: "Elly", xp: 627 },
        { name: "sam", xp: 421 },
        { name: "Lidiya", xp: 30 },
        { name: "Jane Doe", xp: 12 },
        { name: "Jane Doe", xp: 0 },
    ];

    const getAvatarColor = (name) => {
        const followingColors = [
            "from-purple-500 to-pink-500",
            "from-blue-500 to-cyan-500",
            "from-green-500 to-emerald-500",
            "from-orange-500 to-red-500",
            "from-indigo-500 to-purple-500",
            "from-pink-500 to-rose-500"
        ];

        const followerColors = [
            "from-rose-500 to-pink-500",
            "from-red-500 to-orange-500",
            "from-fuchsia-500 to-purple-500",
            "from-violet-500 to-indigo-500",
            "from-pink-600 to-rose-400",
            "from-purple-600 to-rose-500"
        ];

        const colors = tab === "followers" ? followerColors : followingColors;
        const index = name.charCodeAt(0) % colors.length;

        return colors[index];
    };


    const formatXP = (xp) => {
        if (xp >= 1000) {
            return (xp / 1000).toFixed(1) + "k";
        }
        return xp.toString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 sm:px-8 pb-24">
            <div className="max-w-4xl mx-auto pt-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            All Friends
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            <Users size={16} />
                            {sampleFriends.length} connections
                        </p>
                    </div>

                    {/* ADD FRIEND BUTTON */}
                    <button
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105 transition-all duration-300"
                    >
                        <UserPlus size={20} />
                        Add Friend
                    </button>
                </div>

                {/* TAB BAR */}
                <div className="bg-white rounded-3xl p-2 mb-8 shadow-lg shadow-slate-200/50 border border-slate-100">
                    <div className="flex gap-2">
                        {/* FOLLOWING TAB */}
                        <button
                            onClick={() => setTab("following")}
                            className={`flex-1 py-3 px-6 font-semibold rounded-2xl transition-all duration-300 ${tab === "following"
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            FOLLOWING
                        </button>

                        {/* FOLLOWERS TAB */}
                        <button
                            onClick={() => setTab("followers")}
                            className={`flex-1 py-3 px-6 font-semibold rounded-2xl transition-all duration-300 ${tab === "followers"
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            FOLLOWERS
                        </button>
                    </div>
                </div>

                {/* FRIEND LIST */}
                <div className="space-y-3">
                    {sampleFriends.map((user, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl p-5 shadow-md shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-300/50 hover:scale-[1.02] hover:border-blue-200 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">


                                {/* AVATAR */}
                                {user.avatar ? (
                                    <div className="relative">
                                        <img
                                            src={user.avatar}
                                            className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white shadow-md"
                                            alt=""
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                                    </div>
                                ) : (
                                    <div
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br ${getAvatarColor(user.name)} shadow-md ring-4 ring-white`}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* NAME & XP */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-800 text-lg truncate">{user.name}</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <TrendingUp size={14} className="text-blue-500" />
                                        <span className="font-semibold text-blue-600">{formatXP(user.xp)}</span>
                                        <span className="text-gray-400">XP</span>
                                    </div>
                                </div>

                                {/* ACTION BUTTON */}
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30">
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}