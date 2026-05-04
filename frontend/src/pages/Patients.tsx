import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, createPatient, deletePatient, updatePatient } from '../api';
import { Plus, Trash2, User, Pencil } from 'lucide-react';

export const Patients = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: ''
  });

  const userStr = localStorage.getItem('user');
  const role = userStr ? JSON.parse(userStr).role : 'patient';
  const isAdminOrSpec = role === 'admin' || role === 'specialist';

  const { data: patients, isLoading } = useQuery({ queryKey: ['patients'], queryFn: getPatients });

  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updatePatient(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' });
  };

  const openEdit = (patient: any) => {
    setEditingId(patient.id);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone || '',
      dateOfBirth: patient.dateOfBirth || ''
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
        <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
        {isAdminOrSpec && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Patient
          </button>
        )}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Phone</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600">DOB</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">Loading...</td></tr>
              ) : patients?.map((patient: any) => (
                <tr key={patient.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-900">{patient.firstName} {patient.lastName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{patient.email}</td>
                  <td className="py-3 px-4 text-slate-600">{patient.phone || '-'}</td>
                  <td className="py-3 px-4 text-slate-600">{patient.dateOfBirth || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    {isAdminOrSpec && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(patient)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteMutation.mutate(patient.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {patients?.length === 0 && !isLoading && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">No patients found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 flex bg-slate-900/20 items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">{editingId ? 'Edit' : 'Add New'} Patient</h2>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                <input type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth (Optional)</label>
                <input type="date" className="input-field" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Patient'}
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
