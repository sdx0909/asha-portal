import React from 'react';

interface User {
  email?: string;
  role?: string;
}

interface AdminDashboardSimpleProps {
  user: User | null;
  onLogout: () => void;
}

const AdminDashboardSimple: React.FC<AdminDashboardSimpleProps> = ({ user, onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const stats = [
    { title: 'Total ASHA Workers', value: '1,247', icon: '👥' },
    { title: 'Active Cases', value: '3,891', icon: '📊' },
    { title: 'Reports Generated', value: '156', icon: '📄' },
    { title: 'System Health', value: '99.9%', icon: '🛡️' }
  ];

  const recentActivities = [
    { user: 'Sunita Dixit', action: 'Updated patient record', time: '2 minutes ago' },
    { user: 'Priya Sharma', action: 'Generated monthly report', time: '15 minutes ago' },
    { user: 'Anita Patel', action: 'Registered new patient', time: '1 hour ago' },
    { user: 'Meera Singh', action: 'Completed health survey', time: '2 hours ago' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '0 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>🛡️</span>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1F2937' }}>
                ASHA-PORTAL
              </h1>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                Admin Dashboard
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0, color: '#1F2937' }}>
                {user?.email}
              </p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                Administrator
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '5px'
              }}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 10px 0' }}>
            Welcome back, Administrator
          </h2>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Here's what's happening with your healthcare management system today.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 5px 0' }}>
                    {stat.title}
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  fontSize: '30px',
                  background: '#EEF2FF',
                  padding: '10px',
                  borderRadius: '50%'
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px'
        }}>
          {/* Recent Activities */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                Recent Activities
              </h3>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#4F46E5',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                View all
              </button>
            </div>
            
            <div>
              {recentActivities.map((activity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < recentActivities.length - 1 ? '1px solid #F3F4F6' : 'none'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4F46E5',
                    marginRight: '15px'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937', margin: '0 0 2px 0' }}>
                      {activity.user} {activity.action}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 15px 0' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: '➕', text: 'Add New ASHA Worker' },
                  { icon: '📊', text: 'Generate Report' },
                  { icon: '⚙️', text: 'System Settings' },
                  { icon: '📥', text: 'Export Data' }
                ].map((action, index) => (
                  <button key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    <span style={{ marginRight: '10px', fontSize: '16px' }}>{action.icon}</span>
                    {action.text}
                  </button>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 15px 0' }}>
                System Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Database', status: 'Online', color: '#10B981' },
                  { label: 'API Services', status: 'Operational', color: '#10B981' },
                  { label: 'Backup Status', status: 'Up to date', color: '#10B981' },
                  { label: 'Last Sync', status: '2 min ago', color: '#6B7280' }
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>{item.label}</span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {item.color === '#10B981' && (
                        <span style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: item.color,
                          marginRight: '6px'
                        }}></span>
                      )}
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSimple;