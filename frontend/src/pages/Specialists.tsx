import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpecialists, createSpecialist, deleteSpecialist, updateSpecialist } from '../api';
import { Plus, Trash2, UserPlus, Pencil } from 'lucide-react';

export const Specialists = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', specialty: '', email: '', phone: ''
  });

  const userStr = localStorage.getItem('user');
  const role = userStr ? JSON.parse(userStr).role : 'patient';
  const isAdmin = role === 'admin';

  const { data: specialists, isLoading } = useQuery({ queryKey: ['specialists'], queryFn: getSpecialists });

  const createMutation = useMutation({
    mutationFn: createSpecialist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', specialty: '', email: '', phone: '' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateSpecialist(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSpecialist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
    }
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ firstName: '', lastName: '', specialty: '', email: '', phone: '' });
  };

  const openEdit = (specialist: any) => {
    setEditingId(specialist.id);
    setFormData({
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      specialty: specialist.specialty,
      email: specialist.email,
      phone: specialist.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Specialists</h1>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Specialist
          </button>
        )}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Specialty</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Phone</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">Loading...</td></tr>
              ) : specialists?.map((specialist: any) => (
                <tr key={specialist.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-900">{specialist.firstName} {specialist.lastName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {specialist.specialty}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{specialist.email}</td>
                  <td className="py-3 px-4 text-slate-600">{specialist.phone || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    {isAdmin && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(specialist)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteMutation.mutate(specialist.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {specialists?.length === 0 && !isLoading && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No specialists found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 flex backdrop-blur bg-slate-900/50 items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">{editingId ? 'Edit' : 'Add New'} Specialist</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" className="input-field" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" className="input-field" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                <input required type="text" className="input-field" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                <input type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Specialist'}
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
