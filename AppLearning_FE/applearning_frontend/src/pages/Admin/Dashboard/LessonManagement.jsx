import { Download, Edit2, Eye, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import ComponentCard from '../../../components/common/ComponentCard';
import Input from '../../../components/form/input/InputField';
import TextArea from '../../../components/form/input/TextArea';
import Label from '../../../components/form/Label';
import Select from '../../../components/form/Select';
import Switch from '../../../components/form/switch/Switch';

export default function LessonManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Mock data
  const courseOptions = [
    { value: '', label: 'Tất cả khóa học' },
    { value: '1', label: 'Beginner' },
    { value: '2', label: 'Elementary' },
    { value: '3', label: 'Intermediate' },
    { value: '4', label: 'Advanced' }
  ];

  const unitOptions = [
    { value: '', label: 'Tất cả đơn vị' },
    { value: '1', label: 'Greetings & Basic Words' },
    { value: '2', label: 'Animals' },
    { value: '3', label: 'Food & Drinks' },
    { value: '11', label: 'Musical Instruments & Music' },
    { value: '21', label: 'Technology & Devices' },
    { value: '31', label: 'Politics & Government' }
  ];

  const lessons = [
    { 
      id: 1, 
      name: 'Greetings & Actions', 
      unitId: 1,
      unitName: 'Greetings & Basic Words',
      courseName: 'Beginner',
      orderIndex: 1, 
      experienceReward: 10, 
      unlockRequired: false,
      exerciseCount: 15,
      wordCount: 20,
      completionRate: 85
    },
    { 
      id: 2, 
      name: 'People & Family', 
      unitId: 1,
      unitName: 'Greetings & Basic Words',
      courseName: 'Beginner',
      orderIndex: 2, 
      experienceReward: 10, 
      unlockRequired: true,
      exerciseCount: 12,
      wordCount: 18,
      completionRate: 72
    },
    { 
      id: 3, 
      name: 'Body Parts', 
      unitId: 1,
      unitName: 'Greetings & Basic Words',
      courseName: 'Beginner',
      orderIndex: 3, 
      experienceReward: 10, 
      unlockRequired: true,
      exerciseCount: 18,
      wordCount: 25,
      completionRate: 68
    },
    { 
      id: 6, 
      name: 'Pets & Farm Animals', 
      unitId: 2,
      unitName: 'Animals',
      courseName: 'Beginner',
      orderIndex: 1, 
      experienceReward: 10, 
      unlockRequired: false,
      exerciseCount: 20,
      wordCount: 30,
      completionRate: 90
    },
    { 
      id: 51, 
      name: 'String Instruments', 
      unitId: 11,
      unitName: 'Musical Instruments & Music',
      courseName: 'Elementary',
      orderIndex: 1, 
      experienceReward: 10, 
      unlockRequired: false,
      exerciseCount: 14,
      wordCount: 22,
      completionRate: 65
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    unitId: '',
    orderIndex: '',
    experienceReward: 10,
    unlockRequired: false,
    description: ''
  });

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !selectedCourse || lesson.courseName === courseOptions.find(c => c.value === selectedCourse)?.label;
    const matchesUnit = !selectedUnit || lesson.unitId === parseInt(selectedUnit);
    return matchesSearch && matchesCourse && matchesUnit;
  });

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      unitId: '',
      orderIndex: '',
      experienceReward: 10,
      unlockRequired: false,
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (lesson) => {
    setModalMode('edit');
    setSelectedLesson(lesson);
    setFormData({
      name: lesson.name,
      unitId: lesson.unitId.toString(),
      orderIndex: lesson.orderIndex.toString(),
      experienceReward: lesson.experienceReward,
      unlockRequired: lesson.unlockRequired,
      description: ''
    });
    setShowModal(true);
  };

  const handleDelete = (lessonId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
      console.log('Delete lesson:', lessonId);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.unitId || !formData.orderIndex) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    if (modalMode === 'add') {
      console.log('Add lesson:', formData);
    } else {
      console.log('Update lesson:', selectedLesson.id, formData);
    }
    setShowModal(false);
  };

  const stats = [
    { label: 'Tổng bài học', value: lessons.length, color: 'bg-blue-500' },
    { label: 'Đã xuất bản', value: lessons.filter(l => !l.unlockRequired).length, color: 'bg-green-500' },
    { label: 'Cần mở khóa', value: lessons.filter(l => l.unlockRequired).length, color: 'bg-yellow-500' },
    { label: 'Tỷ lệ hoàn thành TB', value: '76%', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quản lý Bài học</h1>
        <p className="text-gray-600 dark:text-gray-400">Quản lý toàn bộ bài học trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-20`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <ComponentCard title="Bộ lọc & Tìm kiếm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <Label>Tìm kiếm bài học</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Nhập tên bài học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Course Filter */}
            <div>
              <Label>Khóa học</Label>
              <Select
                options={courseOptions}
                placeholder="Chọn khóa học"
                onChange={(value) => setSelectedCourse(value)}
                className="dark:bg-gray-900"
              />
            </div>

            {/* Unit Filter */}
            <div>
              <Label>Đơn vị</Label>
              <Select
                options={unitOptions}
                placeholder="Chọn đơn vị"
                onChange={(value) => setSelectedUnit(value)}
                className="dark:bg-gray-900"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Thêm bài học mới
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2">
              <Download size={18} />
              Xuất Excel
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2">
              <Upload size={18} />
              Nhập Excel
            </button>
          </div>
        </div>
      </ComponentCard>

      {/* Lessons Table */}
      <ComponentCard title={`Danh sách bài học (${filteredLessons.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tên bài học</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đơn vị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thứ tự</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">XP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bài tập</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Từ vựng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hoàn thành</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredLessons.map((lesson, index) => (
                <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{lesson.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{lesson.unitName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {lesson.courseName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{lesson.orderIndex}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                      {lesson.experienceReward} XP
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{lesson.exerciseCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{lesson.wordCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${lesson.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{lesson.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lesson.unlockRequired ? (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                        Cần mở khóa
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                        Công khai
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => console.log('View lesson:', lesson.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị <span className="font-medium">1-{filteredLessons.length}</span> trong tổng số <span className="font-medium">{lessons.length}</span> bài học
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm text-gray-700 dark:text-gray-300">
              Trước
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm text-gray-700 dark:text-gray-300">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm text-gray-700 dark:text-gray-300">
              Sau
            </button>
          </div>
        </div>
      </ComponentCard>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'add' ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}
              </h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <Label>Tên bài học <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập tên bài học"
                />
              </div>

              <div>
                <Label>Đơn vị <span className="text-red-500">*</span></Label>
                <Select
                  options={unitOptions.filter(u => u.value !== '')}
                  placeholder="Chọn đơn vị"
                  onChange={(value) => setFormData({...formData, unitId: value})}
                  className="dark:bg-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Thứ tự <span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({...formData, orderIndex: e.target.value})}
                    placeholder="Nhập thứ tự"
                  />
                </div>

                <div>
                  <Label>XP thưởng</Label>
                  <Input
                    type="number"
                    value={formData.experienceReward}
                    onChange={(e) => setFormData({...formData, experienceReward: parseInt(e.target.value) || 0})}
                    placeholder="Nhập XP"
                  />
                </div>
              </div>

              <div>
                <Label>Mô tả bài học</Label>
                <TextArea
                  value={formData.description}
                  onChange={(value) => setFormData({...formData, description: value})}
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về bài học..."
                />
              </div>

              <div className="pt-2">
                <Switch
                  label="Yêu cầu mở khóa (học viên phải hoàn thành bài trước)"
                  defaultChecked={formData.unlockRequired}
                  onChange={(checked) => setFormData({...formData, unlockRequired: checked})}
                />
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {modalMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}