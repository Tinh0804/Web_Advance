import { Award, BookOpen, Clock, Star, Target, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import Chart from 'react-apexcharts';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');

  // Thống kê tổng quan
  const stats = [
    { label: 'Tổng học viên', value: '2,456', change: '+12.5%', positive: true, icon: Users },
    { label: 'Khóa học hoạt động', value: '24', change: '+2', positive: true, icon: BookOpen },
    { label: 'Bài học đã xuất bản', value: '156', change: '+18', positive: true, icon: Zap },
    { label: 'Tỉ lệ hoàn thành', value: '68.5%', change: '+5.2%', positive: true, icon: Target },
  ];

  // Hiệu suất khóa học
  const coursePerformance = [
    { name: 'English to Vietnamese - Beginner', students: 456, completion: 85, rating: 4.8, units: 10, lessons: 50 },
    { name: 'English to Vietnamese - Elementary', students: 234, completion: 72, rating: 4.6, units: 10, lessons: 50 },
    { name: 'English to Vietnamese - Intermediate', students: 189, completion: 68, rating: 4.5, units: 10, lessons: 50 },
    { name: 'English to Vietnamese - Advanced', students: 98, completion: 45, rating: 4.7, units: 10, lessons: 50 },
  ];

  // Hoạt động học viên theo ngày
  const userActivity = [
    { day: 'T2', active: 1850, new: 45, completed: 234 },
    { day: 'T3', active: 1920, new: 52, completed: 267 },
    { day: 'T4', active: 1780, new: 38, completed: 189 },
    { day: 'T5', active: 2100, new: 67, completed: 312 },
    { day: 'T6', active: 1650, new: 41, completed: 198 },
    { day: 'T7', active: 980, new: 28, completed: 145 },
    { day: 'CN', active: 890, new: 19, completed: 132 },
  ];

  // Thành tích phổ biến
  const topAchievements = [
    { name: 'Tuần lễ bất bại', earned: 892, type: 'streak' },
    { name: '10 bài học đầu tiên', earned: 1456, type: 'lessons' },
    { name: 'Hoàn hảo lần đầu', earned: 734, type: 'perfect' },
    { name: 'Học giả sơ cấp', earned: 567, type: 'experience' },
  ];

  // Thống kê ngôn ngữ - CÓ THÊM FLAG
  const languageStats = [
    { lang: 'English', learners: 2145, fromLang: 'Vietnamese', flag: 'en.png' },
    { lang: 'Japanese', learners: 234, fromLang: 'Vietnamese', flag: 'ja.png' },
    { lang: 'Korean', learners: 189, fromLang: 'Vietnamese', flag: 'ko.png' },
    { lang: 'French', learners: 98, fromLang: 'Vietnamese', flag: 'fr.png' },
  ];

  // Retention và Engagement
  const retentionData = {
    daily: 68,
    weekly: 52,
    monthly: 41,
    avgSessionTime: '18 phút',
    avgLessonsPerDay: 3.4
  };

  // User Activity Chart
  const userActivityChartOptions = {
    colors: ["#465fff", "#22c55e", "#f59e0b"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: { text: undefined },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: '#6B7280'
      }
    },
    grid: {
      yaxis: { lines: { show: true } },
      borderColor: '#e5e7eb'
    },
    fill: { opacity: 1 },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} người`,
      },
    },
  };

  const userActivitySeries = [
    {
      name: "Học viên active",
      data: userActivity.map(d => d.active)
    },
    {
      name: "Học viên mới",
      data: userActivity.map(d => d.new)
    },
    {
      name: "Bài học hoàn thành",
      data: userActivity.map(d => d.completed)
    }
  ];

  // Course Performance Line Chart
  const coursePerformanceChartOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      labels: {
        colors: '#6B7280'
      }
    },
    colors: ["#465FFF", "#22c55e", "#f59e0b", "#ec4899"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 300,
      type: "line",
      toolbar: { show: false },
      background: 'transparent'
    },
    stroke: {
      curve: "smooth",
      width: [3, 3, 3, 3],
    },
    markers: {
      size: 5,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      borderColor: '#e5e7eb'
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: 'dark',
      enabled: true,
    },
    xaxis: {
      categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val) => `${val}%`
      },
      title: { text: "" },
      min: 0,
      max: 100
    },
  };

  const coursePerformanceSeries = [
    {
      name: "Beginner",
      data: [75, 78, 80, 82, 83, 85]
    },
    {
      name: "Elementary",
      data: [65, 67, 68, 70, 71, 72]
    },
    {
      name: "Intermediate",
      data: [60, 62, 64, 65, 67, 68]
    },
    {
      name: "Advanced",
      data: [35, 38, 40, 42, 44, 45]
    }
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Phân tích toàn diện về hiệu suất và hoạt động học tập</p>
        
        {/* Time Range Filter */}
        <div className="mt-4 flex gap-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {range === 'day' ? 'Ngày' : range === 'week' ? 'Tuần' : range === 'month' ? 'Tháng' : 'Năm'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  stat.positive ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Retention & Engagement */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Retention & Engagement
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Daily Active</span>
                <span className="font-semibold text-gray-900 dark:text-white">{retentionData.daily}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${retentionData.daily}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Weekly Active</span>
                <span className="font-semibold text-gray-900 dark:text-white">{retentionData.weekly}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${retentionData.weekly}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Monthly Active</span>
                <span className="font-semibold text-gray-900 dark:text-white">{retentionData.monthly}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${retentionData.monthly}%` }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Avg. Session Time</span>
                <span className="font-semibold text-gray-900 dark:text-white">{retentionData.avgSessionTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg. Lessons/Day</span>
                <span className="font-semibold text-gray-900 dark:text-white">{retentionData.avgLessonsPerDay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Thành tích phổ biến
          </h2>
          <div className="space-y-3">
            {topAchievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{achievement.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.earned} học viên đạt được</p>
                </div>
                <div className="text-2xl">
                  {achievement.type === 'streak' ? '🔥' : achievement.type === 'lessons' ? '📚' : achievement.type === 'perfect' ? '⭐' : '💎'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution - SỬ DỤNG FLAG IMAGES */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Phân bố ngôn ngữ học</h2>
          <div className="space-y-3">
            {languageStats.map((lang, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden  flex items-center justify-center bg-white dark:bg-gray-700 flex-shrink-0">
                    <img 
                      src={`/images/flags/${lang.flag}`} 
                      alt={`${lang.lang} flag`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback nếu không load được ảnh
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="text-sm font-bold text-gray-600 dark:text-gray-300">${lang.lang.substring(0, 2).toUpperCase()}</span>`;
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{lang.lang}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">từ {lang.fromLang}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{lang.learners}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Activity Chart - Using ApexCharts Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hoạt động học viên trong tuần</h2>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Chart 
              options={userActivityChartOptions} 
              series={userActivitySeries} 
              type="bar" 
              height={280} 
            />
          </div>
        </div>
      </div>

      {/* Course Performance Trend - Using ApexCharts Line */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Xu hướng hoàn thành khóa học theo tháng</h2>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Chart 
              options={coursePerformanceChartOptions} 
              series={coursePerformanceSeries} 
              type="line" 
              height={300} 
            />
          </div>
        </div>
      </div>

      {/* Course Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hiệu suất khóa học chi tiết</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Tên khóa học</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Học viên</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Units</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Lessons</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Hoàn thành</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {coursePerformance.map((course, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{course.name}</td>
                  <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">{course.students}</td>
                  <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">{course.units}</td>
                  <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">{course.lessons}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.completion}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{course.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}