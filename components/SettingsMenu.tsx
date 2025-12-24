
import React, { useState } from 'react';
import { QuizSettings, QuizAppearance, EducationStage, Semester } from '../types';
import { TRANSLATIONS, EDUCATION_DATA, SUBJECTS_LIST, MATH_BRANCHES, UNIT_LABELS } from '../constants';

interface SettingsMenuProps {
  settings: QuizSettings;
  onUpdate: (settings: QuizSettings) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdate }) => {
  const t = (TRANSLATIONS as any)[settings.language || 'ar'];
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [showCustomBranch, setShowCustomBranch] = useState(false);

  const updateSettings = (updates: Partial<QuizSettings>) => {
    onUpdate({ ...settings, ...updates });
  };

  const minutes = Math.floor(settings.timerSeconds / 60);
  const seconds = settings.timerSeconds % 60;

  const handleDurationChange = (m: number, s: number) => {
    updateSettings({ timerSeconds: m * 60 + s });
  };

  const currentGrades = (EDUCATION_DATA as any)[settings.defaultStage || EducationStage.PRIMARY] || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-8 animate-fadeIn">
      {/* 1. Primary Classification - Selection happens once for the whole quiz */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b pb-2">
          <i className="fas fa-graduation-cap text-indigo-500"></i> {settings.language === 'ar' ? 'تصنيف الاختبار' : 'Quiz Classification'}
        </h3>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* المرحلة - اختر مرة واحدة */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.stage}</label>
              <select
                className="w-full border-2 border-white rounded-xl p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                value={settings.defaultStage}
                onChange={(e) => updateSettings({ defaultStage: e.target.value as EducationStage, defaultGrade: '1' })}
              >
                {Object.values(EducationStage).map(s => <option key={s} value={s}>{t.stages[s]}</option>)}
              </select>
            </div>

            {/* الصف - اختر مرة واحدة */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.grade}</label>
              <select
                className="w-full border-2 border-white rounded-xl p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                value={settings.defaultGrade}
                onChange={(e) => updateSettings({ defaultGrade: e.target.value })}
              >
                {currentGrades.map((g: string) => (
                  <option key={g} value={g}>
                    {settings.language === 'ar' ? (
                      settings.defaultStage === EducationStage.PRIMARY ? `الصف ${g} الابتدائي` :
                      settings.defaultStage === EducationStage.PREPARATORY ? `الصف ${g} الإعدادي` :
                      `الصف ${g} الثانوي`
                    ) : `Grade ${g}`}
                  </option>
                ))}
              </select>
            </div>

            {/* الفصل الدراسي - اختر مرة واحدة */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.semester}</label>
              <select
                className="w-full border-2 border-white rounded-xl p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                value={settings.defaultSemester}
                onChange={(e) => updateSettings({ defaultSemester: e.target.value as Semester })}
              >
                {Object.values(Semester).map(s => <option key={s} value={s}>{t.semesters[s]}</option>)}
              </select>
            </div>
        </div>
      </div>

      {/* 2. Basic Quiz Info */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b pb-2">
          <i className="fas fa-info-circle text-indigo-500"></i> {settings.language === 'ar' ? 'معلومات المادة والدرس' : 'Subject & Lesson Info'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.title}</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.subject}</label>
            <div className="flex gap-2">
              <select
                className="flex-1 border rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={showCustomSubject ? 'أخرى' : settings.subject}
                onChange={(e) => {
                  if (e.target.value === 'أخرى') {
                    setShowCustomSubject(true);
                    updateSettings({ subject: '' });
                  } else {
                    setShowCustomSubject(false);
                    updateSettings({ subject: e.target.value });
                  }
                }}
              >
                {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {showCustomSubject && (
                <input
                  type="text"
                  placeholder={t.addOther}
                  className="flex-1 border rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white animate-slideInRight"
                  value={settings.subject}
                  onChange={(e) => updateSettings({ subject: e.target.value })}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.branch}</label>
            <div className="flex gap-2">
              {settings.subject === 'رياضيات' ? (
                <select
                  className="flex-1 border rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={showCustomBranch ? 'أخرى' : settings.branch}
                  onChange={(e) => {
                    if (e.target.value === 'أخرى') {
                      setShowCustomBranch(true);
                      updateSettings({ branch: '' });
                    } else {
                      setShowCustomBranch(false);
                      updateSettings({ branch: e.target.value });
                    }
                  }}
                >
                  <option value="">-- {settings.language === 'ar' ? 'بدون فرع' : 'No branch'} --</option>
                  {MATH_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={t.branch}
                  className="flex-1 border rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={settings.branch}
                  onChange={(e) => updateSettings({ branch: e.target.value })}
                />
              )}
              {showCustomBranch && settings.subject === 'رياضيات' && (
                <input
                  type="text"
                  placeholder={t.addOther}
                  className="flex-1 border rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white animate-slideInRight"
                  value={settings.branch}
                  onChange={(e) => updateSettings({ branch: e.target.value })}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.unitLabel}</label>
                <select className="w-full border rounded-lg p-3 text-black font-bold outline-none bg-white">
                    {UNIT_LABELS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.unit}</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 text-black font-bold outline-none bg-white"
                  value={settings.unit}
                  onChange={(e) => updateSettings({ unit: e.target.value })}
                />
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.lesson}</label>
            <input
              type="text"
              placeholder={settings.language === 'ar' ? 'اكتب اسم الدرس هنا...' : 'Write lesson name...'}
              className="w-full border rounded-lg p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={settings.lesson}
              onChange={(e) => updateSettings({ lesson: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 3. Communication & Timer */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b pb-2">
          <i className="fas fa-clock text-indigo-500"></i> {settings.language === 'ar' ? 'التواصل والوقت' : 'Comm & Time'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl border space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase">{t.whatsapp}</label>
              <div className="flex items-center gap-2">
                  <i className="fab fa-whatsapp text-2xl text-emerald-500"></i>
                  <input
                    type="text"
                    placeholder="+201234567890"
                    className="w-full border rounded-lg p-2.5 text-black font-bold focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
                    value={settings.teacherWhatsApp}
                    onChange={(e) => updateSettings({ teacherWhatsApp: e.target.value })}
                  />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase">{t.timer}</label>
              <div className="flex items-center gap-2 bg-slate-50 border rounded-lg p-2">
                 <input
                  type="checkbox"
                  className="w-6 h-6 accent-indigo-600"
                  checked={settings.timerEnabled}
                  onChange={(e) => updateSettings({ timerEnabled: e.target.checked })}
                />
                <div className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <input
                          type="number"
                          disabled={!settings.timerEnabled}
                          className="w-full border-none p-1 text-center font-black text-xl bg-transparent outline-none disabled:text-slate-300"
                          value={minutes}
                          onChange={(e) => handleDurationChange(parseInt(e.target.value) || 0, seconds)}
                      />
                      <span className="text-[10px] text-slate-400 font-bold">{t.timerMinutes}</span>
                    </div>
                    <span className="font-bold">:</span>
                    <div className="flex flex-col items-center flex-1">
                      <input
                          type="number"
                          disabled={!settings.timerEnabled}
                          max="59"
                          className="w-full border-none p-1 text-center font-black text-xl bg-transparent outline-none disabled:text-slate-300"
                          value={seconds}
                          onChange={(e) => handleDurationChange(minutes, parseInt(e.target.value) || 0)}
                      />
                      <span className="text-[10px] text-slate-400 font-bold">{t.timerSeconds}</span>
                    </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* 4. Settings Toggles */}
      <div className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
             <input
              type="checkbox"
              className="w-6 h-6 accent-indigo-600 cursor-pointer"
              checked={settings.skipNameEntry}
              onChange={(e) => updateSettings({ skipNameEntry: e.target.checked })}
            />
            <div>
                <label className="block text-sm font-bold text-slate-800 uppercase leading-none">{t.skipName}</label>
                <p className="text-[10px] text-slate-500 mt-1">{t.guestDesc}</p>
            </div>
          </div>

          {settings.skipNameEntry && (
            <div className="space-y-3 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-fadeIn">
                <label className="block text-xs font-bold text-indigo-800 uppercase">{t.welcome}</label>
                <input
                    type="text"
                    className="w-full border rounded-xl p-3 text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                    value={settings.welcomeMessage}
                    onChange={(e) => updateSettings({ welcomeMessage: e.target.value })}
                />
                <div className="flex items-center gap-3">
                    <span className="text-sm text-indigo-800 font-bold">{t.autoClose}:</span>
                    <input 
                        type="number" 
                        className="w-24 border rounded-lg p-2 text-center text-black font-black bg-white" 
                        value={settings.messageDuration}
                        onChange={(e) => updateSettings({ messageDuration: parseInt(e.target.value) || 0 })}
                    />
                    <span className="text-xs text-indigo-600 font-bold">{t.timerSeconds}</span>
                </div>
            </div>
          )}
      </div>

      {/* Security Section */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b pb-2">
          <i className="fas fa-shield-alt text-red-500"></i> {t.security}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { key: 'preventSplitScreen', icon: 'fa-columns', label: t.noSplitScreen },
               { key: 'preventScreenshot', icon: 'fa-camera-retro', label: t.noScreenshot },
               { key: 'offlineMode', icon: 'fa-plane-slash', label: t.offlineOnly }
             ].map(sec => (
                <button
                    key={sec.key}
                    onClick={() => updateSettings({ [sec.key]: !(settings as any)[sec.key] })}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${(settings as any)[sec.key] ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                >
                    <i className={`fas ${sec.icon} text-2xl`}></i>
                    <span className="text-[10px] font-bold text-center leading-tight">{sec.label}</span>
                </button>
             ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
