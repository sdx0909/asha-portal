import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  FileText, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Plus,
  BarChart3,
  Shield,
  Calendar,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const stats = [
    {
      title: 'Total ASHA Workers',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Users
    },
    {
      title: 'Active Cases',
      value: '3,891',
      change: '+8%',
      changeType: 'positive',
      icon: Activity
    },
    {
      title: 'Reports Generated',
      value: '156',
      change: '+23%',
      changeType: 'positive',
      icon: FileText
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: '0%',
      changeType: 'neutral',
      icon: Shield
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Sunita Dixit',
      action: 'Updated patient record',
      time: '2 minutes ago',
      type: 'update'
    },
    {
      id: 2,
      user: 'Priya Sharma',
      action: 'Generated monthly report',
      time: '15 minutes ago',
      type: 'report'
    },
    {
      id: 3,
      user: 'Anita Patel',
      action: 'Registered new patient',
      time: '1 hour ago',
      type: 'create'
    },
    {
      id: 4,
      user: 'Meera Singh',
      action: 'Completed health survey',
      time: '2 hours ago',
      type: 'survey'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ASHA-PORTAL</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients, reports, users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, Administrator
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your healthcare management system today.
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
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="healthcare-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-md">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'update' ? 'bg-blue-500' :
                      activity.type === 'report' ? 'bg-green-500' :
                      activity.type === 'create' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user} {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="healthcare-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 text-primary-600 mr-3" />
                    <span className="text-sm font-medium">Add New ASHA Worker</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 text-primary-600 mr-3" />
                    <span className="text-sm font-medium">Generate Report</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 text-primary-600 mr-3" />
                    <span className="text-sm font-medium">System Settings</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 text-primary-600 mr-3" />
                    <span className="text-sm font-medium">Export Data</span>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="healthcare-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Operational
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup Status</span>
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Up to date
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Sync</span>
                  <span className="text-sm text-gray-500">2 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;