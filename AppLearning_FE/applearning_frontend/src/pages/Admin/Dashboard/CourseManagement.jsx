import { Award, BookOpen, Edit, Eye, Filter, MoreVertical, Plus, Search, Target, Trash2, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Dropdown Component (từ code của bạn)
const Dropdown = ({ isOpen, onClose, children, className = "" }) => {
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-40 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  );
};

// DropdownItem Component
const DropdownItem = ({ onClick, className = "", icon: Icon, children, variant = "default" }) => {
  const variantStyles = {
    default: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
    danger: "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
    primary: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition-colors ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

// InputField Component
const InputField = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon: Icon,
  className = "" 
}) => {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className}`}
      />
    </div>
  );
};

// Select Component
const SelectField = ({ 
  value, 
  onChange, 
  options, 
  icon: Icon,
  className = "" 
}) => {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />}
      <select
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{label}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
};

// Badge Component
const Badge = ({ children, variant = "default" }) => {
  const variants = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    elementary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    published: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    draft: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
};

// Table Components (từ code của bạn)
const Table = ({ children, className = "" }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

const TableHeader = ({ children, className = "" }) => {
  return <thead className={className}>{children}</thead>;
};

const TableBody = ({ children, className = "" }) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableRow = ({ children, className = "" }) => {
  return <tr className={className}>{children}</tr>;
};

const TableCell = ({ children, isHeader = false, className = "" }) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={className}>{children}</CellTag>;
};

// CourseTable Component - Sử dụng Table components
const CourseTable = ({ courses }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);

  return (
    <Table>
      <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
        <TableRow>
          <TableCell isHeader className="text-left py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">
            ID
          </TableCell>
          <TableCell isHeader className="text-left py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">
            Tên khóa học
          </TableCell>
          <TableCell isHeader className="text-center py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">
            Ngôn ngữ
          </TableCell>
          <TableCell isHeader className="text-center py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">
            Mức độ
          </TableCell>
          <TableCell isHeader className="text-center py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">
            Học viên
          </TableCell>
          <TableCell isHeader className="text-center py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">
            Units/Lessons
          </TableCell>
          <TableCell isHeader className="text-center py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">
            Trạng thái
          </TableCell>
          <TableCell isHeader className="text-center py-3 px-6 font-semibold text-gray-700 dark:text-gray-300">
            Hành động
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course, idx) => (
          <TableRow
            key={course.id}
            className={`${
              idx % 2 === 0 
                ? 'bg-white dark:bg-gray-800' 
                : 'bg-gray-50 dark:bg-gray-700/30'
            } hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`}
          >
            <TableCell className="py-4 px-6 text-gray-900 dark:text-white font-medium">
              {course.id}
            </TableCell>
            <TableCell className="py-4 px-6">
              <div className="font-medium text-gray-900 dark:text-white">{course.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Rating: {course.avgRating}⭐</div>
            </TableCell>
            <TableCell className="py-4 px-6 text-center">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {course.fromLanguage} → {course.toLanguage}
              </div>
            </TableCell>
            <TableCell className="py-4 px-6 text-center">
              <Badge variant={course.level.toLowerCase()}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="py-4 px-6 text-center font-semibold text-gray-900 dark:text-white">
              {course.students}
            </TableCell>
            <TableCell className="py-4 px-6 text-center text-gray-700 dark:text-gray-300">
              {course.units} / {course.lessons}
            </TableCell>
            <TableCell className="py-4 px-6 text-center">
              <Badge variant={course.status.toLowerCase()}>
                {course.status}
              </Badge>
            </TableCell>
            <TableCell className="py-4 px-6">
              <div className="flex items-center justify-center gap-2 relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === course.id ? null : course.id)}
                  className="dropdown-toggle p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                <Dropdown 
                  isOpen={dropdownOpen === course.id} 
                  onClose={() => setDropdownOpen(null)}
                >
                  <DropdownItem icon={Eye} variant="primary" onClick={() => console.log('View', course.id)}>
                    Xem chi tiết
                  </DropdownItem>
                  <DropdownItem icon={Edit} onClick={() => console.log('Edit', course.id)}>
                    Chỉnh sửa
                  </DropdownItem>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <DropdownItem icon={Trash2} variant="danger" onClick={() => console.log('Delete', course.id)}>
                    Xóa khóa học
                  </DropdownItem>
                </Dropdown>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// CourseCard Component
const CourseCard = ({ course, onViewUnits }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{course.name}</h3>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span>{course.fromLanguage}</span>
              <span>→</span>
              <span>{course.toLanguage}</span>
            </div>
          </div>
          
          {/* Dropdown Actions */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="dropdown-toggle p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            <Dropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)}>
              <DropdownItem icon={Eye} variant="primary" onClick={() => console.log('View', course.id)}>
                Xem chi tiết
              </DropdownItem>
              <DropdownItem icon={Edit} onClick={() => console.log('Edit', course.id)}>
                Chỉnh sửa
              </DropdownItem>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <DropdownItem icon={Trash2} variant="danger" onClick={() => console.log('Delete', course.id)}>
                Xóa khóa học
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={course.level.toLowerCase()}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </Badge>
          <Badge variant={course.status.toLowerCase()}>
            {course.status}
          </Badge>
        </div>
      </div>

      {/* Course Stats */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.students}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Học viên</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.units}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Units</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.lessons}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.avgRating}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Tỉ lệ hoàn thành</span>
            <span className="font-semibold text-gray-900 dark:text-white">{course.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${course.completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* View Units Button */}
        <button
          onClick={() => onViewUnits(course.id)}
          className="w-full mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium text-sm"
        >
          Xem Units ({course.units})
        </button>

        {/* Created Date */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Ngày tạo: {new Date(course.createdDate).toLocaleDateString('vi-VN')}
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function CourseManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const stats = [
    { label: 'Tổng khóa học', value: '4', icon: BookOpen, color: 'blue' },
    { label: 'Tổng Units', value: '40', icon: Target, color: 'green' },
    { label: 'Tổng Lessons', value: '200', icon: Award, color: 'purple' },
    { label: 'Tổng học viên', value: '2,456', icon: Users, color: 'orange' },
  ];

  const courses = [
    {
      id: 1,
      name: 'English to Vietnamese - Beginner',
      fromLanguage: 'English',
      toLanguage: 'Vietnamese',
      level: 'beginner',
      students: 456,
      units: 10,
      lessons: 50,
      completionRate: 85,
      status: 'Published',
      createdDate: '2024-01-15',
      avgRating: 4.8
    },
    {
      id: 2,
      name: 'English to Vietnamese - Elementary',
      fromLanguage: 'English',
      toLanguage: 'Vietnamese',
      level: 'elementary',
      students: 234,
      units: 10,
      lessons: 50,
      completionRate: 72,
      status: 'Published',
      createdDate: '2024-01-20',
      avgRating: 4.6
    },
    {
      id: 3,
      name: 'English to Vietnamese - Intermediate',
      fromLanguage: 'English',
      toLanguage: 'Vietnamese',
      level: 'intermediate',
      students: 189,
      units: 10,
      lessons: 50,
      completionRate: 68,
      status: 'Published',
      createdDate: '2024-02-01',
      avgRating: 4.5
    },
    {
      id: 4,
      name: 'English to Vietnamese - Advanced',
      fromLanguage: 'English',
      toLanguage: 'Vietnamese',
      level: 'advanced',
      students: 98,
      units: 10,
      lessons: 50,
      completionRate: 45,
      status: 'Draft',
      createdDate: '2024-02-15',
      avgRating: 4.7
    },
  ];

  const levelOptions = [
    { value: 'all', label: 'Tất cả mức độ' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'elementary', label: 'Elementary' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const languageOptions = [
    { value: 'all', label: 'Tất cả ngôn ngữ' },
    { value: 'English', label: 'English' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Korean', label: 'Korean' },
    { value: 'French', label: 'French' }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    const matchesLanguage = filterLanguage === 'all' || course.fromLanguage === filterLanguage;
    return matchesSearch && matchesLevel && matchesLanguage;
  });

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quản lý Khóa học</h1>
          <p className="text-gray-600 dark:text-gray-400">Quản lý tất cả khóa học, units và lessons</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Tạo khóa học mới
        </button>
      </div>

      {/* Stats Cards - Sử dụng StatCard component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Filters - Sử dụng InputField và SelectField components */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
          
          <SelectField
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            options={levelOptions}
            icon={Filter}
          />
          
          <SelectField
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            options={languageOptions}
          />
        </div>
      </div>

      {/* Courses Grid - Sử dụng CourseCard component */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onViewUnits={(id) => setSelectedCourse(selectedCourse === id ? null : id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Không tìm thấy khóa học
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thử thay đổi bộ lọc hoặc tạo khóa học mới
          </p>
        </div>
      )}

      {/* Detailed Table View - Sử dụng Table components */}
      {filteredCourses.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết khóa học</h2>
          </div>
          <div className="overflow-x-auto">
            <CourseTable courses={filteredCourses} />
          </div>
        </div>
      )}
    </div>
  );
}