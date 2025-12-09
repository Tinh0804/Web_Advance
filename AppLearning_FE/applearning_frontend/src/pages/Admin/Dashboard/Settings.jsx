import { useState } from 'react';
import ComponentCard from '../../../components/common/ComponentCard';
import PageMeta from '../../../components/common/PageMeta';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Language Learning Hub',
    siteUrl: 'https://languagelearning.example.com',
    adminEmail: 'admin@example.com',
    supportEmail: 'support@example.com',
    timeZone: 'Asia/Ho_Chi_Minh',
    language: 'Vietnamese',
    maintenanceMode: false,
    userRegistration: true,
    requireEmailVerification: true,
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <>
      <PageMeta title="Settings | TailAdmin" description="System settings" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <h1 className="text-title-sm font-bold text-gray-800 dark:text-white/90">Cài đặt Hệ thống</h1>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <ComponentCard title="Cài đặt chung">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white/90 mb-2">
                  Tên trang web
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-white/5 text-gray-800 dark:text-white/90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white/90 mb-2">
                  Email Admin
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-white/5 text-gray-800 dark:text-white/90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white/90 mb-2">
                  Múi giờ
                </label>
                <select
                  value={settings.timeZone}
                  onChange={(e) => handleChange('timeZone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-white/5 text-gray-800 dark:text-white/90"
                >
                  <option>Asia/Ho_Chi_Minh</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </ComponentCard>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <ComponentCard title="Tính năng">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="font-medium text-gray-800 dark:text-white/90">Chế độ bảo trì</h4>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="font-medium text-gray-800 dark:text-white/90">Đăng ký người dùng</h4>
                <input
                  type="checkbox"
                  checked={settings.userRegistration}
                  onChange={(e) => handleChange('userRegistration', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </ComponentCard>
        </div>

        <div className="col-span-12">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </>
  );
}