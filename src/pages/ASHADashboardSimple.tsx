import React from 'react';

interface User {
  email?: string;
  role?: string;
}

interface ASHADashboardSimpleProps {
  user: User | null;
  onLogout: () => void;
}

const ASHADashboardSimple: React.FC<ASHADashboardSimpleProps> = ({ user, onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const stats = [
    { title: 'Patients Assigned', value: '127', icon: '👥' },
    { title: 'Visits This Month', value: '89', icon: '🏥' },
    { title: 'Pending Reports', value: '3', icon: '📄' },
    { title: 'Health Score', value: '94%', icon: '❤️' }
  ];

  const todayTasks = [
    {
      title: 'Visit Mrs. Sharma for diabetes checkup',
      time: '10:00 AM',
      location: 'Village: Rampur, House No. 45',
      priority: 'high'
    },
    {
      title: 'Vaccination drive at Anganwadi Center',
      time: '2:00 PM',
      location: 'Anganwadi Center, Main Road',
      priority: 'medium'
    },
    {
      title: 'Submit weekly health report',
      time: '4:00 PM',
      location: 'Online submission',
      priority: 'medium'
    }
  ];

  const recentPatients = [
    { name: 'Sunita Devi', condition: 'Hypertension', lastVisit: '2 days ago', status: 'stable' },
    { name: 'Ramesh Kumar', condition: 'Diabetes', lastVisit: '1 week ago', status: 'attention' },
    { name: 'Priya Sharma', condition: 'Pregnancy Care', lastVisit: '3 days ago', status: 'stable' }
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
            <span style={{ fontSize: '24px', marginRight: '10px' }}>❤️</span>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1F2937' }}>
                ASHA-PORTAL
              </h1>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                ASHA Worker Dashboard
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0, color: '#1F2937' }}>
                {user?.email?.split('@')[0] || 'ASHA Worker'}
              </p>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                Accredited Social Health Activist
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
            Good morning, Sunita! 🌅
          </h2>
          <p style={{ color: '#6B7280', margin: 0 }}>
            You have 3 pending tasks today. Let's make a difference in your community's health.
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
                  background: '#FEF2F2',
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
          gridTemplateColumns: '1fr 1fr',
          gap: '30px'
        }}>
          {/* Today's Tasks */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                Today's Schedule
              </h3>
              <button style={{
                background: '#4F46E5',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                ➕ Add Task
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {todayTasks.map((task, index) => (
                <div key={index} style={{
                  padding: '15px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${
                    task.priority === 'high' ? '#EF4444' :
                    task.priority === 'medium' ? '#F59E0B' : '#3B82F6'
                  }`,
                  background: task.priority === 'high' ? '#FEF2F2' :
                    task.priority === 'medium' ? '#FFFBEB' : '#EFF6FF'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937', margin: '0 0 8px 0' }}>
                    {task.title}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#6B7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '5px' }}>🕐</span>
                      {task.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '5px' }}>📍</span>
                      {task.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patients */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 20px 0' }}>
              Recent Patients
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentPatients.map((patient, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#F9FAFB',
                  borderRadius: '6px'
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937', margin: '0 0 4px 0' }}>
                      {patient.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                      {patient.condition} - {patient.lastVisit}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: patient.status === 'stable' ? '#D1FAE5' : '#FEF3C7',
                    color: patient.status === 'stable' ? '#065F46' : '#92400E'
                  }}>
                    {patient.status === 'stable' ? 'Stable' : 'Attention'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASHADashboardSimple;