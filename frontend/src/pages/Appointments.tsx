import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, createAppointment, deleteAppointment, updateAppointment, getPatients, getSpecialists } from '../api';
import { Plus, Trash2, CalendarDays, Pencil } from 'lucide-react';

export const Appointments = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patientId: '', specialistId: '', appointmentDate: '', notes: ''
  });

  const userStr = localStorage.getItem('user');
  const role = userStr ? JSON.parse(userStr).role : 'patient';
  const isAdminOrSpec = role === 'admin' || role === 'specialist';

  const { data: appointments, isLoading } = useQuery({ queryKey: ['appointments'], queryFn: getAppointments });
  const { data: patients } = useQuery({ queryKey: ['patients'], queryFn: getPatients });
  const { data: specialists } = useQuery({ queryKey: ['specialists'], queryFn: getSpecialists });

  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsModalOpen(false);
      setFormData({ patientId: '', specialistId: '', appointmentDate: '', notes: '' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateAppointment(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ patientId: '', specialistId: '', appointmentDate: '', notes: '' });
  };

  const openEdit = (appointment: any) => {
    setEditingId(appointment.id);
    
    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const date = new Date(appointment.appointmentDate);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);

    setFormData({
      patientId: appointment.patientId || (appointment.patient?.id) || '',
      specialistId: appointment.specialistId || (appointment.specialist?.id) || '',
      appointmentDate: localISOTime,
      notes: appointment.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      patientId: parseInt(formData.patientId),
      specialistId: parseInt(formData.specialistId)
    };

    if (editingId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const getPatientName = (id: number) => {
    const patient = patients?.find((p: any) => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : `Patient #${id}`;
  };

  const getSpecialistName = (id: number) => {
    const spec = specialists?.find((s: any) => s.id === id);
    return spec ? `${spec.firstName} ${spec.lastName}` : `Specialist #${id}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Book Appointment
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Date & Time</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Patient</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Specialist</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Notes</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">Loading...</td></tr>
              ) : appointments?.map((appointment: any) => (
                <tr key={appointment.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-900">
                        {new Date(appointment.appointmentDate).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{appointment.patient?.firstName ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : getPatientName(appointment.patientId)}</td>
                  <td className="py-3 px-4 text-slate-600">{appointment.specialist?.firstName ? `${appointment.specialist.firstName} ${appointment.specialist.lastName}` : getSpecialistName(appointment.specialistId)}</td>
                  <td className="py-3 px-4 text-slate-500 text-sm max-w-xs truncate">{appointment.notes || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    {isAdminOrSpec && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(appointment)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteMutation.mutate(appointment.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {appointments?.length === 0 && !isLoading && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No appointments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 flex backdrop-blur bg-slate-900/50 items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">{editingId ? 'Edit' : 'Book'} Appointment</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
                <select required className="input-field" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                  <option value="">Select Patient</option>
                  {patients?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialist</label>
                <select required className="input-field" value={formData.specialistId} onChange={e => setFormData({...formData, specialistId: e.target.value})}>
                  <option value="">Select Specialist</option>
                  {specialists?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.specialty})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input required type="datetime-local" className="input-field" value={formData.appointmentDate} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea className="input-field" rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Booking...' : (editingId ? 'Save Changes' : 'Book Appointment')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
