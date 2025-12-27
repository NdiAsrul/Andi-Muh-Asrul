
import React, { useState, useEffect } from 'react';
import { User, UserRole, Announcement, LogbookEntry, Seminar } from '../types';
import { syncToSheets, fetchSheetsData } from '../services/appscript';
import Swal from 'sweetalert2';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'faculty' | 'logbook' | 'seminars' | 'agenda' | 'announcements' | 'settings'>('overview');

  const [students, setStudents] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [logbooks, setLogbooks] = useState<any[]>([]);
  const [seminarSchedules, setSeminarSchedules] = useState<Seminar[]>([]);
  const [agendas, setAgendas] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delete Modal State (for general items)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [typeToDelete, setTypeToDelete] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const s = await fetchSheetsData('student');
    const f = await fetchSheetsData('faculty');
    const l = await fetchSheetsData('logbook');
    const sem = await fetchSheetsData('seminar');
    const a = await fetchSheetsData('agenda');
    const ann = await fetchSheetsData('announcement');
    
    setStudents(s);
    setFaculty(f);
    setLogbooks(l);
    setSeminarSchedules(sem);
    setAgendas(a);
    setAnnouncements(ann);
  };

  // Reactive Pre-fill Logic for Seminars
  useEffect(() => {
    if (activeTab === 'seminars' && editingItem && editingItem.nim) {
      const nim = editingItem.nim;
      
      // 1. Auto-fill Name from Students database if it's empty
      if (!editingItem.studentName) {
        const studentRecord = students.find(s => s.nim === nim);
        if (studentRecord) {
          setEditingItem((prev: any) => ({
            ...prev,
            studentName: studentRecord.name
          }));
          // Clear name error if it was auto-filled
          setErrors(prev => {
             const next = { ...prev };
             delete next.studentName;
             return next;
          });
        }
      }

      // 2. Pre-fill scheduling info if a same-type scheduled seminar exists
      if (editingItem.type) {
        const isSchedulingFieldsEmpty = !editingItem.date && !editingItem.time && !editingItem.room;
        
        if (isSchedulingFieldsEmpty) {
          const existingMatch = seminarSchedules.find(s => 
            s.nim === nim && 
            s.type === editingItem.type && 
            s.status === 'Scheduled' &&
            s.id !== editingItem.id
          );

          if (existingMatch) {
            setEditingItem((prev: any) => ({
              ...prev,
              date: existingMatch.date,
              time: existingMatch.time,
              room: existingMatch.room,
              ketua: existingMatch.ketua,
              penguji1: existingMatch.penguji1,
              penguji2: existingMatch.penguji2 || ''
            }));
            // Clear scheduling errors if auto-filled
            setErrors(prev => {
                const next = { ...prev };
                delete next.date;
                delete next.time;
                delete next.room;
                delete next.ketua;
                delete next.penguji1;
                return next;
            });
          }
        }
      }
    }
  }, [editingItem?.nim, editingItem?.type, activeTab, students, seminarSchedules]);

  // Real-time Field Validation Handler
  const validateField = (name: string, value: any, itemState: any = editingItem) => {
    let errorMsg = '';
    
    if (activeTab === 'seminars') {
      if (name === 'nim' && !value) errorMsg = 'NIM wajib diisi';
      if (name === 'studentName' && !value) errorMsg = 'Nama wajib diisi';
      if (name === 'title' && !value) errorMsg = 'Judul wajib diisi';
      
      // Only require scheduling details if status is 'Scheduled' or 'Finished'
      const isScheduled = itemState.status === 'Scheduled' || itemState.status === 'Finished';
      if (isScheduled) {
        if (name === 'date') {
          if (!value) {
            errorMsg = 'Tanggal wajib';
          } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(value);
            if (selectedDate < today) {
              errorMsg = 'Tanggal tidak boleh di masa lalu';
            }
          }
        }
        if (name === 'time' && !value) errorMsg = 'Waktu wajib';
        if (name === 'room' && !value) errorMsg = 'Ruangan wajib';
        if (name === 'ketua' && !value) errorMsg = 'Ketua wajib';
        if (name === 'penguji1' && !value) errorMsg = 'Penguji wajib';
      }
    } else if (activeTab === 'announcements') {
      if (name === 'title' && !value) errorMsg = 'Judul wajib diisi';
      if (name === 'date' && !value) errorMsg = 'Tanggal wajib diisi';
      if (name === 'content' && !value) errorMsg = 'Isi pengumuman wajib diisi';
    }

    setErrors(prev => {
      const next = { ...prev };
      if (errorMsg) next[name] = errorMsg;
      else delete next[name];
      return next;
    });
    
    return !errorMsg;
  };

  const validateForm = () => {
    const requiredFields: string[] = [];
    if (activeTab === 'seminars') {
      requiredFields.push('nim', 'studentName', 'title');
      if (editingItem.status === 'Scheduled' || editingItem.status === 'Finished') {
        requiredFields.push('date', 'time', 'room', 'ketua', 'penguji1');
      }
    } else if (activeTab === 'announcements') {
      requiredFields.push('title', 'date', 'content');
    }

    let isValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field, editingItem[field])) {
        isValid = false;
      }
    });

    // Check for Scheduling Conflicts if basic validation passed
    if (isValid && activeTab === 'seminars' && (editingItem.status === 'Scheduled' || editingItem.status === 'Finished')) {
      const conflict = seminarSchedules.find(s => 
        s.id !== editingItem.id && 
        s.status === 'Scheduled' && 
        s.date === editingItem.date && 
        s.time === editingItem.time && 
        s.room === editingItem.room
      );

      if (conflict) {
        Swal.fire({
          title: 'Konflik Jadwal Terdeteksi',
          text: `Ruangan ${editingItem.room} pada pukul ${editingItem.time} WIB sudah digunakan oleh ${conflict.studentName} untuk Seminar ${conflict.type}. Silakan pilih waktu atau ruangan lain.`,
          icon: 'warning',
          confirmButtonColor: '#0F2C59',
          customClass: {
            popup: 'rounded-3xl'
          }
        });
        setErrors(prev => ({
          ...prev, 
          room: 'Konflik ruangan', 
          time: 'Konflik waktu'
        }));
        return false;
      }
    }

    return isValid;
  };

  const handleAction = async (type: string, action: 'create' | 'update' | 'delete', data: any) => {
    const typeSingular = type.endsWith('s') ? type.slice(0, -1) : type;
    const res = await syncToSheets({
      action,
      type: typeSingular as any,
      data,
      timestamp: new Date().toISOString()
    });

    if (res.success) {
      await loadAllData();
      setEditModalOpen(false);
      setDeleteModalOpen(false);
      setErrors({});
    }
    return res;
  };

  const requestDelete = (type: string, item: any) => {
    setItemToDelete(item);
    setTypeToDelete(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteAnnouncement = (ann: any) => {
    Swal.fire({
      title: 'Hapus Pengumuman?',
      text: `Anda akan menghapus pengumuman "${ann.title}". Tindakan ini tidak dapat dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0F2C59',
      cancelButtonColor: '#C5A059',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] py-3 px-6',
        cancelButton: 'rounded-xl font-bold uppercase tracking-widest text-[10px] py-3 px-6'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await handleAction('announcements', 'delete', ann.id);
        if (res.success) {
          Swal.fire({
            title: 'Terhapus!',
            text: 'Pengumuman telah berhasil dihapus.',
            icon: 'success',
            confirmButtonColor: '#0F2C59'
          });
        }
      }
    });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const idKey = typeToDelete === 'students' ? 'nim' : 'id';
    const dataToDelete = itemToDelete[idKey] || itemToDelete;
    await handleAction(typeToDelete, 'delete', dataToDelete);
    setIsDeleting(false);
    setItemToDelete(null);
  };

  const openForm = (item: any = null) => {
    setErrors({});
    if (item) {
      let newItem = { ...item };
      
      if (activeTab === 'seminars' && newItem.status === 'Pending Scheduling') {
        newItem.status = 'Scheduled';
      }

      setEditingItem(newItem);
      setIsAdding(false);
    } else {
      setIsAdding(true);
      const defaults: any = {
        students: { nim: '', name: '', year: '2025', status: 'Aktif' },
        faculty: { id: `f${Date.now()}`, name: '', email: '', spec: '', guidance: 0 },
        logbook: { id: `l${Date.now()}`, student: '', date: new Date().toISOString().split('T')[0], topic: '', status: 'Pending' },
        seminars: { id: `s${Date.now()}`, studentName: '', nim: '', type: 'Proposal', title: '', date: '', time: '', room: '', ketua: '', penguji1: '', penguji2: '', pembimbing1: '', pembimbing2: '', status: 'Scheduled' },
        agenda: { id: `a${Date.now()}`, event: '', date: '', time: '', room: '', category: 'General' },
        announcements: { id: `${Date.now()}`, title: '', content: '', date: new Date().toISOString().split('T')[0] }
      };
      setEditingItem(defaults[activeTab]);
    }
    setEditModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      'Proposal': 'bg-blue-100 text-blue-600',
      'Hasil': 'bg-orange-100 text-orange-600',
      'Sidang': 'bg-purple-100 text-purple-600',
      'Pending Scheduling': 'bg-yellow-100 text-yellow-600',
      'Scheduled': 'bg-green-100 text-green-600',
      'Finished': 'bg-slate-100 text-slate-600',
      'Canceled': 'bg-red-100 text-red-600'
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
  };

  const handleInputChange = (field: string, value: any) => {
    const updatedItem = { ...editingItem, [field]: value };
    setEditingItem(updatedItem);
    validateField(field, value, updatedItem);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <aside className="lg:w-64 flex-shrink-0 space-y-2">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0F2C59] flex items-center justify-center text-white font-bold text-lg shadow-inner">A</div>
          <div>
            <p className="text-xs font-black text-[#0F2C59] leading-none uppercase">Admin Gizi</p>
            <p className="text-[9px] text-slate-400 mt-1 font-bold tracking-widest uppercase">Portal Akademik</p>
          </div>
        </div>
        <nav className="space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'students', label: 'Mahasiswa', icon: '👥' },
            { id: 'faculty', label: 'Dosen', icon: '👨‍🏫' },
            { id: 'seminars', label: 'Jadwal Seminar', icon: '📅' },
            { id: 'logbook', label: 'Logbook TA', icon: '📖' },
            { id: 'announcements', label: 'Pengumuman', icon: '📣' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === item.id ? 'bg-[#0F2C59] text-white shadow-lg' : 'text-slate-500 hover:bg-white'
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-grow space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xl font-bold text-[#0F2C59]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
              <p className="text-xs text-slate-400 font-medium">Manajemen data operasional program studi</p>
            </div>
            {['students', 'faculty', 'seminars', 'announcements'].includes(activeTab) && (
              <button 
                onClick={() => openForm()} 
                className="bg-[#C5A059] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-gold/20 active:scale-95 transition-all"
              >
                + Tambah Baru
              </button>
            )}
          </div>

          <div className="p-6">
            {activeTab === 'seminars' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                    <tr><th className="px-4 py-4">Mahasiswa</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Jadwal & Penguji</th><th className="px-4 py-4 text-center">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {seminarSchedules.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-5">
                          <p className="font-bold text-[#0F2C59]">{s.studentName}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black">{s.nim} • {s.type}</p>
                        </td>
                        <td className="px-4 py-5">
                          <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${getStatusBadge(s.status)}`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-5 text-xs">
                          {s.status === 'Scheduled' || s.status === 'Finished' ? (
                            <div className="space-y-1">
                              <p className="font-bold text-slate-700">{s.date} • {s.time} WIB ({s.room})</p>
                              <p className="text-[9px] text-slate-400 font-black uppercase">Penguji 1: {s.penguji1 || '-'}</p>
                              {s.penguji2 && <p className="text-[9px] text-slate-400 font-black uppercase">Penguji 2: {s.penguji2}</p>}
                            </div>
                          ) : (
                            <p className="text-slate-400 italic">
                              {s.status === 'Pending Scheduling' ? 'Belum dijadwalkan' : 'Dibatalkan'}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-5 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => openForm(s)} 
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                                s.status === 'Scheduled' || s.status === 'Finished' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-[#C5A059] text-white hover:bg-[#b38f4d]'
                              }`}
                            >
                              {s.status === 'Scheduled' || s.status === 'Finished' ? '✏️ Edit' : '📅 Jadwalkan'}
                            </button>
                            <button onClick={() => requestDelete('seminars', s)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {seminarSchedules.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-slate-400 italic">Tidak ada antrean pendaftaran seminar.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'students' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                    <tr><th className="px-4 py-4">NIM</th><th className="px-4 py-4">Nama</th><th className="px-4 py-4">Status TA</th><th className="px-4 py-4 text-center">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map(s => (
                      <tr key={s.nim} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4 font-bold text-[#0F2C59]">{s.nim}</td>
                        <td className="px-4 py-4 font-bold">{s.name}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-600`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openForm(s)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl">✏️</button>
                            <button onClick={() => requestDelete('students', s)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="grid grid-cols-1 gap-4">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 flex justify-between items-start group hover:bg-white hover:shadow-lg transition-all">
                    <div>
                      <h4 className="font-bold text-[#0F2C59]">{ann.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">{ann.date}</p>
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">{ann.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openForm(ann)}
                        className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteAnnouncement(ann)} 
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Hapus Pengumuman"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="p-20 text-center text-slate-400 italic">Belum ada pengumuman yang diterbitkan.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GENERAL DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteModalOpen(false)}></div>
          <div className="bg-white w-full max-sm rounded-[2rem] overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-[#0F2C59] mb-2">Konfirmasi Hapus</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                Apakah Anda yakin ingin menghapus data <span className="font-bold text-red-600">"{itemToDelete.name || itemToDelete.studentName || itemToDelete.title || itemToDelete.event || 'item ini'}"</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-900/20 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Menghapus...' : 'Ya, Hapus Selamanya'}
                </button>
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setEditModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="bg-[#0F2C59] p-6 text-white flex justify-between items-center">
              <div>
                <h4 className="text-xl font-bold">
                  {activeTab === 'announcements' ? (isAdding ? 'Buat Pengumuman' : 'Edit Pengumuman') :
                   (editingItem.status === 'Pending Scheduling' ? 'Konfigurasi Jadwal' : 'Edit Data')}
                </h4>
                <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">{editingItem.studentName || editingItem.title || 'Baru'}</p>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">✕</button>
            </div>
            <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {activeTab === 'seminars' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`text-[10px] font-black uppercase mb-2 block tracking-widest flex items-center gap-1 transition-colors ${errors.nim ? 'text-red-500' : 'text-slate-400'}`}>
                        NIM Mahasiswa <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        className={`w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 font-bold transition-all ${errors.nim ? 'border-red-500 bg-red-50/30 ring-red-100' : 'border-slate-200'}`}
                        value={editingItem.nim}
                        onChange={(e) => handleInputChange('nim', e.target.value)}
                        placeholder="0106522xxx"
                      />
                      {errors.nim && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">{errors.nim}</p>}
                    </div>
                    <div>
                      <label className={`text-[10px] font-black uppercase mb-2 block tracking-widest flex items-center gap-1 transition-colors ${errors.studentName ? 'text-red-500' : 'text-slate-400'}`}>
                        Nama Mahasiswa <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        className={`w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 font-bold transition-all ${errors.studentName ? 'border-red-500 bg-red-50/30 ring-red-100' : 'border-slate-200'}`}
                        value={editingItem.studentName}
                        onChange={(e) => handleInputChange('studentName', e.target.value)}
                        placeholder="Nama Lengkap..."
                      />
                      {errors.studentName && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">{errors.studentName}</p>}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="flex-grow w-full">
                      <p className={`text-[10px] font-black uppercase mb-2 flex items-center gap-1 transition-colors ${errors.title ? 'text-red-500' : 'text-slate-400'}`}>
                        Judul Penelitian <span className="text-red-500">*</span>
                      </p>
                      <textarea 
                        className={`w-full p-3 border rounded-xl bg-white text-sm font-bold text-[#0F2C59] outline-none focus:ring-2 focus:ring-[#0F2C59]/10 italic transition-all ${errors.title ? 'border-red-500 bg-red-50/30 ring-red-100' : 'border-slate-100'}`}
                        rows={2}
                        value={editingItem.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Input judul penelitian..."
                      ></textarea>
                      {errors.title && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">{errors.title}</p>}
                    </div>
                    <div className="w-full md:w-48 shrink-0">
                      <label className="text-[10px] font-black text-[#C5A059] uppercase mb-2 block tracking-widest">Status Seminar</label>
                      <select 
                        className={`w-full p-2.5 rounded-xl text-[10px] font-black uppercase border-2 transition-all outline-none ${
                          editingItem.status === 'Scheduled' ? 'border-green-200 bg-green-50 text-green-700 focus:ring-green-100' :
                          editingItem.status === 'Finished' ? 'border-slate-200 bg-slate-50 text-slate-700 focus:ring-slate-100' :
                          editingItem.status === 'Canceled' ? 'border-red-200 bg-red-50 text-red-700 focus:ring-red-100' :
                          'border-yellow-200 bg-yellow-50 text-yellow-700 focus:ring-yellow-100'
                        }`}
                        value={editingItem.status}
                        onChange={(e) => {
                          const updated = { ...editingItem, status: e.target.value };
                          setEditingItem(updated);
                          // Re-validate all required scheduling fields when status changes
                          ['date', 'time', 'room', 'ketua', 'penguji1'].forEach(f => validateField(f, updated[f], updated));
                        }}
                      >
                        <option value="Pending Scheduling">Pending Scheduling</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Finished">Finished</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Jenis Seminar</label>
                      <select 
                        className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 font-bold"
                        value={editingItem.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                      >
                        <option value="Proposal">Proposal</option>
                        <option value="Hasil">Hasil</option>
                        <option value="Sidang">Sidang</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div>
                        <label className={`text-[10px] font-black uppercase mb-1 block flex items-center gap-1 transition-colors ${errors.time ? 'text-red-500' : 'text-slate-400'}`}>
                          Waktu <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          className={`w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 transition-all ${errors.time ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`} 
                          value={editingItem.time} 
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          placeholder="09:00" 
                        />
                        {errors.time && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase animate-in fade-in">{errors.time}</p>}
                      </div>
                      <div>
                        <label className={`text-[10px] font-black uppercase mb-1 block flex items-center gap-1 transition-colors ${errors.room ? 'text-red-500' : 'text-slate-400'}`}>
                          Ruangan <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          className={`w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 transition-all ${errors.room ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`} 
                          value={editingItem.room} 
                          onChange={(e) => handleInputChange('room', e.target.value)}
                          placeholder="R.301" 
                        />
                        {errors.room && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase animate-in fade-in">{errors.room}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`text-[10px] font-black uppercase mb-1 block flex items-center gap-1 transition-colors ${errors.date ? 'text-red-500' : 'text-slate-400'}`}>
                      Tanggal Seminar <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className={`w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 transition-all ${errors.date ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`} 
                      value={editingItem.date} 
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                    {errors.date && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">{errors.date}</p>}
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-[#C5A059] uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                      Komponen Penguji
                    </h5>
                    <div>
                      <label className={`text-[10px] font-black uppercase mb-1 block flex items-center gap-1 transition-colors ${errors.ketua ? 'text-red-500' : 'text-slate-400'}`}>
                        Ketua Sidang <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        className={`w-full p-3 border rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0F2C59]/10 transition-all ${errors.ketua ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`} 
                        value={editingItem.ketua} 
                        onChange={(e) => handleInputChange('ketua', e.target.value)}
                        placeholder="Nama Dosen..." 
                      />
                      {errors.ketua && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter">{errors.ketua}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-[10px] font-black uppercase mb-1 block flex items-center gap-1 transition-colors ${errors.penguji1 ? 'text-red-500' : 'text-slate-400'}`}>
                          Penguji 1 (Wajib) <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          className={`w-full p-3 border rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0F2C59]/10 transition-all ${errors.penguji1 ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`} 
                          value={editingItem.penguji1} 
                          onChange={(e) => handleInputChange('penguji1', e.target.value)}
                          placeholder="Nama Dosen..." 
                        />
                        {errors.penguji1 && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter">{errors.penguji1}</p>}
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-widest">Penguji 2 (Opsional)</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0F2C59]/10" 
                          value={editingItem.penguji2} 
                          onChange={(e) => handleInputChange('penguji2', e.target.value)}
                          placeholder="Nama Dosen..." 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div>
                    <label className={`text-[10px] font-black uppercase mb-2 block tracking-widest flex items-center gap-1 ${errors.title ? 'text-red-500' : 'text-slate-400'}`}>
                      Judul Pengumuman <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`w-full p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 font-bold transition-all ${errors.title ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
                      value={editingItem.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Contoh: Jadwal Libur Semester Ganjil"
                    />
                    {errors.title && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter">{errors.title}</p>}
                  </div>
                  <div>
                    <label className={`text-[10px] font-black uppercase mb-2 block tracking-widest flex items-center gap-1 ${errors.date ? 'text-red-500' : 'text-slate-400'}`}>
                      Tanggal Terbit <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className={`w-full p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 transition-all ${errors.date ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
                      value={editingItem.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={`text-[10px] font-black uppercase mb-2 block tracking-widest flex items-center gap-1 ${errors.content ? 'text-red-500' : 'text-slate-400'}`}>
                      Konten / Isi Pengumuman <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      className={`w-full p-4 border rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-[#0F2C59]/10 text-sm leading-relaxed transition-all ${errors.content ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
                      rows={6}
                      value={editingItem.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Tuliskan isi pengumuman secara detail di sini..."
                    ></textarea>
                    {errors.content && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter">{errors.content}</p>}
                  </div>
                </div>
              )}
              
              {!['seminars', 'announcements'].includes(activeTab) && (
                <div className="p-12 text-center">
                   <p className="text-slate-400 italic">Gunakan form standar untuk manajemen {activeTab}.</p>
                </div>
              )}

              <div className="flex gap-4 pt-6 sticky bottom-0 bg-white">
                <button onClick={() => setEditModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200 transition-all">Batal</button>
                <button 
                  onClick={() => {
                    if (validateForm()) {
                      handleAction(activeTab, isAdding ? 'create' : 'update', editingItem);
                    } else {
                      // Note: Conflict alert is already shown inside validateForm if applicable
                    }
                  }} 
                  className="flex-1 py-3 bg-[#0F2C59] text-white rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-blue-900/10 hover:bg-[#1a4282] active:scale-95 transition-all"
                >
                  Konfirmasi & Simpan Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
