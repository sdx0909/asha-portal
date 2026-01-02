import React from 'react';
import { Heart, Users, FileText, LogOut, Bell, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ASHADashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const stats = [
    { title: 'Patients Assigned', value: '127', icon: Users },
    { title: 'Visits This Month', value: '89', icon: Activity },
    { title: 'Pending Reports', value: '3', icon: FileText },
    { title: 'Health Score', value: '94%', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ASHA-PORTAL</h1>
                <p className="text-xs text-gray-500">ASHA Worker Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">ASHA Worker</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Good morning, Sunita! 🌅
          </h2>
          <p className="text-gray-600">
            Welcome to your ASHA dashboard. Let's make a difference in your community's health.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="healthcare-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="healthcare-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="font-medium text-gray-900">Visit Mrs. Sharma for diabetes checkup</p>
                <p className="text-sm text-gray-600">10:00 AM - Village: Rampur</p>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="font-medium text-gray-900">Vaccination drive at Anganwadi Center</p>
                <p className="text-sm text-gray-600">2:00 PM - Main Road</p>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="font-medium text-gray-900">Submit weekly health report</p>
                <p className="text-sm text-gray-600">4:00 PM - Online submission</p>
              </div>
            </div>
          </div>

          <div className="healthcare-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Sunita Devi</p>
                  <p className="text-sm text-gray-600">Hypertension - 2 days ago</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Stable</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Ramesh Kumar</p>
                  <p className="text-sm text-gray-600">Diabetes - 1 week ago</p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Attention</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Priya Sharma</p>
                  <p className="text-sm text-gray-600">Pregnancy Care - 3 days ago</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASHADashboard;