
import React, { useState } from 'react';
import { QuizSettings, EducationStage, Semester } from '../types';
import { TRANSLATIONS, EDUCATION_DATA, SUBJECTS_LIST, MATH_BRANCHES, UNIT_LABELS } from '../constants';

interface SettingsMenuProps {
  settings: QuizSettings;
  onUpdate: (settings: QuizSettings) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdate }) => {
  const lang = settings.language || 'ar';
  const t = (TRANSLATIONS as any)[lang];

  const [customSubjectMode, setCustomSubjectMode] = useState(!SUBJECTS_LIST.includes(settings.subject));
  const [customBranchMode, setCustomBranchMode] = useState(settings.branch !== '' && !MATH_BRANCHES.includes(settings.branch));

  const parseISO = (iso?: string) => {
    const d = iso ? new Date(iso) : new Date();
    let h = d.getHours();
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return {
      date: d.toISOString().split('T')[0],
      hour: h,
      minute: d.getMinutes(),
      period
    };
  };

  const [startDetails, setStartDetails] = useState(parseISO(settings.startTime));

  const updateSettings = (updates: Partial<QuizSettings>) => {
    onUpdate({ ...settings, ...updates });
  };

  const handleStageChange = (stage: EducationStage) => {
    const grades = (EDUCATION_DATA as any)[stage];
    updateSettings({ defaultStage: stage, defaultGrade: grades[0] });
  };

  const handleSchedulingChange = (field: string, value: any) => {
    const details = { ...startDetails, [field]: value };
    setStartDetails(details);

    let h = parseInt(details.hour as any);
    if (details.period === 'PM' && h < 12) h += 12;
    if (details.period === 'AM' && h === 12) h = 0;
    
    const iso = `${details.date}T${String(h).padStart(2, '0')}:${String(details.minute).padStart(2, '0')}:00`;
    updateSettings({ startTime: iso });
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpdate({ 
          ...settings, 
          appearance: { ...settings.appearance, backgroundImage: ev.target?.result as string } 
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const currentGrades = (EDUCATION_DATA as any)[settings.defaultStage || EducationStage.PRIMARY] || [];
  const minutes = Math.floor(settings.timerSeconds / 60);
  const seconds = settings.timerSeconds % 60;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-8 animate-fadeIn pb-24">
      
      {/* 1. Academic Classification */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
          <i className="fas fa-graduation-cap text-indigo-500"></i> {lang === 'ar' ? 'تصنيف الاختبار' : 'Academic Classification'}
        </h3>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.stage}</label>
              <select className="w-full border rounded-xl p-3 font-bold bg-white" value={settings.defaultStage} onChange={(e) => handleStageChange(e.target.value as EducationStage)}>
                {Object.values(EducationStage).map(s => <option key={s} value={s}>{t.stages[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.grade}</label>
              <select className="w-full border rounded-xl p-3 font-bold bg-white" value={settings.defaultGrade} onChange={(e) => updateSettings({ defaultGrade: e.target.value })}>
                {currentGrades.map((g: string) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.semester}</label>
              <select className="w-full border rounded-xl p-3 font-bold bg-white" value={settings.defaultSemester} onChange={(e) => updateSettings({ defaultSemester: e.target.value as Semester })}>
                {Object.values(Semester).map(s => <option key={s} value={s}>{t.semesters[s]}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.subject}</label>
              <select className="w-full border rounded-xl p-3 font-bold bg-white" value={customSubjectMode ? 'custom' : settings.subject} onChange={(e) => {
                if(e.target.value === 'custom') { setCustomSubjectMode(true); updateSettings({ subject: '' }); }
                else { setCustomSubjectMode(false); updateSettings({ subject: e.target.value }); }
              }}>
                {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="custom">أخرى...</option>
              </select>
              {customSubjectMode && <input type="text" className="w-full border rounded-xl p-3 mt-2 font-bold" value={settings.subject} onChange={(e) => updateSettings({ subject: e.target.value })} placeholder="اسم المادة..." />}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.lesson}</label>
              <input type="text" className="w-full border rounded-xl p-3 font-bold bg-white" value={settings.lesson} onChange={(e) => updateSettings({ lesson: e.target.value })} placeholder="اسم الدرس..." />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Timer & Scheduling */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
          <i className="fas fa-clock text-rose-500"></i> {lang === 'ar' ? 'الوقت والجدولة' : 'Time & Scheduling'}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center"><label className="text-sm font-bold">{t.timer}</label><input type="checkbox" checked={settings.timerEnabled} onChange={(e) => updateSettings({ timerEnabled: e.target.checked })} /></div>
              <div className="flex gap-2">
                <input type="number" disabled={!settings.timerEnabled} className="w-full border rounded-lg p-3 text-center font-black text-xl" value={minutes} onChange={(e) => updateSettings({ timerSeconds: (parseInt(e.target.value) || 0) * 60 + seconds })} />
                <span className="font-bold">:</span>
                <input type="number" disabled={!settings.timerEnabled} className="w-full border rounded-lg p-3 text-center font-black text-xl" value={seconds} onChange={(e) => updateSettings({ timerSeconds: minutes * 60 + (parseInt(e.target.value) || 0) })} />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center"><label className="text-sm font-bold">جدولة الاختبار</label><input type="checkbox" checked={settings.schedulingEnabled} onChange={(e) => updateSettings({ schedulingEnabled: e.target.checked })} /></div>
              {settings.schedulingEnabled && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <input type="date" className="flex-1 border rounded-lg p-2 font-bold" value={startDetails.date} onChange={(e) => handleSchedulingChange('date', e.target.value)} />
                    <select className="border rounded-lg p-2 font-bold" value={startDetails.hour} onChange={(e) => handleSchedulingChange('hour', e.target.value)}>{Array.from({length:12}, (_,i)=>i+1).map(h=><option key={h} value={h}>{h}</option>)}</select>
                    <select className="border rounded-lg p-2 font-bold" value={startDetails.period} onChange={(e) => handleSchedulingChange('period', e.target.value)}><option value="AM">ص</option><option value="PM">م</option></select>
                  </div>
                  <textarea className="w-full border rounded-lg p-2 text-sm" placeholder="رسالة الجدولة..." value={settings.schedulingMessage} onChange={(e) => updateSettings({ schedulingMessage: e.target.value })} />
                </div>
              )}
            </div>
        </div>
      </div>

       {/* 3. Appearance & Effects */}
       <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
          <i className="fas fa-paint-brush text-purple-500"></i> {t.appearance}
        </h3>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
          {/* Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.bgColor}</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  className="w-12 h-12 rounded-lg cursor-pointer border-0" 
                  value={settings.appearance.backgroundColor} 
                  onChange={(e) => updateSettings({ appearance: { ...settings.appearance, backgroundColor: e.target.value } })} 
                />
                <span className="text-xs font-mono">{settings.appearance.backgroundColor}</span>
              </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.bgImage}</label>
               <div className="relative">
                 {settings.appearance.backgroundImage && (
                   <img src={settings.appearance.backgroundImage} className="w-full h-20 object-cover rounded-lg mb-2 border" />
                 )}
                 <input type="file" accept="image/*" onChange={handleBgImageUpload} className="text-xs w-full" />
                 {settings.appearance.backgroundImage && (
                    <button onClick={() => updateSettings({ appearance: { ...settings.appearance, backgroundImage: undefined } })} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                 )}
               </div>
            </div>
          </div>

          {/* Selection Styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.selColor}</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  className="w-10 h-10 rounded-lg cursor-pointer border-0" 
                  value={settings.appearance.selectedColor} 
                  onChange={(e) => updateSettings({ appearance: { ...settings.appearance, selectedColor: e.target.value } })} 
                />
                 <input 
                  type="color" 
                  className="w-10 h-10 rounded-lg cursor-pointer border-0" 
                  title={t.selTextColor}
                  value={settings.appearance.selectedTextColor} 
                  onChange={(e) => updateSettings({ appearance: { ...settings.appearance, selectedTextColor: e.target.value } })} 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.clickEffect}</label>
              <select 
                className="w-full border rounded-lg p-2 font-bold bg-white"
                value={settings.appearance.clickEffect}
                onChange={(e) => updateSettings({ appearance: { ...settings.appearance, clickEffect: e.target.value as any } })}
              >
                {['none', 'scale', 'glow', 'shake', 'pulse'].map(e => (
                  <option key={e} value={e}>{t.effects[e] || e}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Transitions */}
          <div className="border-t pt-4">
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.transEffect}</label>
              <select 
                className="w-full border rounded-lg p-2 font-bold bg-white"
                value={settings.appearance.transitionEffect}
                onChange={(e) => updateSettings({ appearance: { ...settings.appearance, transitionEffect: e.target.value as any } })}
              >
                {['none', 'fade', 'slide', 'zoom', 'flip'].map(e => (
                  <option key={e} value={e}>{t.effects[e] || e}</option>
                ))}
              </select>
          </div>
        </div>
       </div>

    </div>
  );
};

export default SettingsMenu;
