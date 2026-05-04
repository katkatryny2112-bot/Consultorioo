import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, UserPlus, CalendarDays, LogOut, Activity } from 'lucide-react';

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'patient';

  const allNavItems = [
    { name: 'Dashboard', path: '/', icon: Activity, roles: ['admin', 'specialist', 'patient'] },
    { name: 'Patients', path: '/patients', icon: Users, roles: ['admin', 'specialist'] },
    { name: 'Specialists', path: '/specialists', icon: UserPlus, roles: ['admin'] },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays, roles: ['admin', 'specialist', 'patient'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-primary-600">
            <Activity className="w-6 h-6" />
            <span className="text-xl font-bold">Consultorio</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shadow-sm z-10">
          <h1 className="text-xl font-semibold text-slate-800">
            {navItems.find(i => location.pathname === i.path || (i.path !== '/' && location.pathname.startsWith(i.path)))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 capitalize">{role}</span>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase">
              {user?.email?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
