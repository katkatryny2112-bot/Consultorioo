import { useQuery } from '@tanstack/react-query';
import { getPatients, getSpecialists, getAppointments } from '../api';
import { Users, UserPlus, CalendarDays, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { data: patients } = useQuery({ queryKey: ['patients'], queryFn: getPatients });
  const { data: specialists } = useQuery({ queryKey: ['specialists'], queryFn: getSpecialists });
  const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: getAppointments });

  const stats = [
    { name: 'Total Patients', value: patients?.length || 0, icon: Users, color: 'bg-blue-500' },
    { name: 'Specialists', value: specialists?.length || 0, icon: UserPlus, color: 'bg-emerald-500' },
    { name: 'Appointments', value: appointments?.length || 0, icon: CalendarDays, color: 'bg-violet-500' },
    { name: 'Growth', value: '+12%', icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.color} p-4 rounded-lg text-white shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Patient</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Specialist</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments?.slice(0, 5).map((apt: any) => (
                <tr key={apt.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-600">{new Date(apt.appointmentDate).toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{apt.patient.firstName}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{apt.specialist.firstName}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))}
              {(!appointments || appointments.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No recent appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
