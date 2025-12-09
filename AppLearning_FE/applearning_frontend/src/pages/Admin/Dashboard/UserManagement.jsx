import { Award, Download, Edit2, Eye, Filter, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import ComponentCard from '../../../components/common/ComponentCard';
import PageMeta from '../../../components/common/PageMeta';
import Input from '../../../components/form/input/InputField';
import Select from '../../../components/form/Select';
import Badge from '../../../components/ui/badge/Badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';

// Giả định import Button từ thư viện UI của bạn
import Button from '../../../components/ui/button/Button';

// Mock data based on database structure (giữ nguyên)
const generateMockUsers = () => {
  const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Minh C', 'Phạm Hoàng D', 'Hoàng Thị E', 'Vũ Văn F', 'Đặng Thị G', 'Bùi Minh H'];
  const subscriptions = ['free', 'premium'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    userId: i + 1,
    fullName: names[i % names.length] + ` ${i + 1}`,
    phoneNumber: `0${Math.floor(Math.random() * 900000000 + 100000000)}`,
    dateOfBirth: new Date(1990 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    nativeLanguage: ['Vietnamese', 'English', 'Japanese'][Math.floor(Math.random() * 3)],
    totalExperience: Math.floor(Math.random() * 50000),
    currentStreak: Math.floor(Math.random() * 100),
    longestStreak: Math.floor(Math.random() * 365),
    hearts: Math.floor(Math.random() * 10),
    subscriptionType: subscriptions[Math.floor(Math.random() * 2)],
    coursesEnrolled: Math.floor(Math.random() * 5) + 1,
    lessonsCompleted: Math.floor(Math.random() * 100),
    achievements: Math.floor(Math.random() * 20),
    avatar: `/images/user/user-${(i % 8) + 17}.jpg`
  }));
};

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  };
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default function UserManagement() {
  const [users] = useState(generateMockUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phoneNumber.includes(searchTerm);
    const matchesSubscription = filterSubscription === 'all' || user.subscriptionType === filterSubscription;
    const matchesLanguage = filterLanguage === 'all' || user.nativeLanguage === filterLanguage;
    return matchesSearch && matchesSubscription && matchesLanguage;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = {
    total: users.length,
    premium: users.filter(u => u.subscriptionType === 'premium').length,
    active: users.filter(u => u.currentStreak > 0).length,
    avgExperience: Math.round(users.reduce((sum, u) => sum + u.totalExperience, 0) / users.length)
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.userId));
    }
  };

  const subscriptionOptions = [
    { value: 'all', label: 'Tất cả gói' },
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' }
  ];

  const languageOptions = [
    { value: 'all', label: 'Tất cả ngôn ngữ' },
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'English', label: 'English' },
    { value: 'Japanese', label: 'Japanese' }
  ];

  return (
    <>
      <PageMeta title="User Management | Language Learning" description="Quản lý người dùng trong hệ thống" />
      
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Header */}
        <div className="col-span-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-title-xl font-bold text-gray-800 dark:text-white/90">Quản lý Người dùng</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý và theo dõi người dùng trong hệ thống</p>
            </div>
            
            {/* THAY THẾ NÚT "THÊM NGƯỜI DÙNG" BẰNG COMPONENT BUTTON */}
            <Button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
              <Plus className="w-5 h-5" />
              Thêm người dùng
            </Button>
            
          </div>
        </div>

        {/* Statistics (Giữ nguyên) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard 
            title="Tổng người dùng" 
            value={stats.total.toLocaleString()} 
            subtitle="Tổng người dùng đăng ký"
            icon={Users}
            color="blue"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard 
            title="Premium Users" 
            value={stats.premium.toLocaleString()} 
            subtitle={`${Math.round(stats.premium/stats.total*100)}% tổng số`}
            icon={Award}
            color="purple"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard 
            title="Active Today" 
            value={stats.active.toLocaleString()} 
            subtitle="Học hôm nay"
            icon={Filter}
            color="green"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard 
            title="Avg Experience" 
            value={stats.avgExperience.toLocaleString()} 
            subtitle="XP trung bình"
            icon={Download}
            color="orange"
          />
        </div>

        {/* Filters (Giữ nguyên) */}
        <div className="col-span-12">
          <ComponentCard title="Bộ lọc tìm kiếm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <Select
                options={subscriptionOptions}
                value={filterSubscription}
                onChange={(value) => setFilterSubscription(value)}
                placeholder="Chọn gói"
              />
              <Select
                options={languageOptions}
                value={filterLanguage}
                onChange={(value) => setFilterLanguage(value)}
                placeholder="Chọn ngôn ngữ"
              />
            </div>
          </ComponentCard>
        </div>

        {/* Table (Giữ nguyên) */}
        <div className="col-span-12">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                          onChange={toggleAllUsers}
                          className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Người dùng
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Liên hệ
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Gói
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Tiến độ
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Streak
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.userId)}
                            onChange={() => toggleUserSelection(user.userId)}
                            className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                        </TableCell>
                        
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {user.fullName.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {user.fullName}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                {user.nativeLanguage}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="px-5 py-4 text-start">
                          <div className="text-theme-sm text-gray-800 dark:text-white/90">{user.phoneNumber}</div>
                          <div className="text-theme-xs text-gray-500 dark:text-gray-400">DoB: {user.dateOfBirth}</div>
                        </TableCell>
                        
                        <TableCell className="px-5 py-4 text-start">
                          <Badge color={user.subscriptionType === 'premium' ? 'error' : 'info'} size="sm">
                            {user.subscriptionType.toUpperCase()}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="px-5 py-4 text-start">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-theme-xs">
                              <span className="text-gray-500 dark:text-gray-400">XP</span>
                              <span className="font-medium text-gray-800 dark:text-white/90">{user.totalExperience.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-theme-xs">
                              <span className="text-gray-500 dark:text-gray-400">Lessons</span>
                              <span className="font-medium text-gray-800 dark:text-white/90">{user.lessonsCompleted}</span>
                            </div>
                            <div className="flex items-center justify-between text-theme-xs">
                              <span className="text-gray-500 dark:text-gray-400">Courses</span>
                              <span className="font-medium text-gray-800 dark:text-white/90">{user.coursesEnrolled}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="px-5 py-4 text-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🔥</span>
                              <span className="font-semibold text-orange-600 dark:text-orange-400">{user.currentStreak}</span>
                            </div>
                            <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                              Max: {user.longestStreak}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Xem chi tiết">
                              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Chỉnh sửa">
                              <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05] flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)} trong {filteredUsers.length} người dùng
                {selectedUsers.length > 0 && ` (${selectedUsers.length} đã chọn)`}
              </div>
              <div className="flex items-center gap-2">
                {/* THAY THẾ NÚT "TRƯỚC" BẰNG COMPONENT BUTTON */}
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Trước
                </Button>
                
                {/* THAY THẾ CÁC NÚT SỐ TRANG BẰNG COMPONENT BUTTON */}
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-brand-600 text-white'
                          : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {/* THAY THẾ NÚT "SAU" BẰNG COMPONENT BUTTON */}
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}