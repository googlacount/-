import React from 'react';
import { QuizSettings, CloudConfig } from '../types';
import { TRANSLATIONS } from '../constants';

interface CloudSettingsProps {
  settings: QuizSettings;
  onUpdate: (settings: QuizSettings) => void;
}

const CloudSettings: React.FC<CloudSettingsProps> = ({ settings, onUpdate }) => {
  const t = (TRANSLATIONS as any)[settings.language || 'ar'];

  const updateCloud = (updates: Partial<CloudConfig>) => {
    onUpdate({
      ...settings,
      cloudConfig: { ...settings.cloudConfig, ...updates }
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center shadow-sm">
            <i className="fas fa-cloud"></i>
          </div>
          {t.cloudTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                <i className="fas fa-file-code text-orange-500"></i> {t.firebaseLabel}
              </label>
              <textarea
                placeholder="Paste Firebase Config JSON or Project ID"
                className="w-full border rounded-xl p-3 text-sm font-mono focus:ring-2 focus:ring-sky-500 outline-none min-h-[120px] bg-slate-50"
                value={settings.cloudConfig.firebaseConfig}
                onChange={(e) => updateCloud({ firebaseConfig: e.target.value })}
              />
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                  <i className="fas fa-link text-blue-500"></i> {t.cloudUrlLabel}
                </label>
                <input
                  type="text"
                  placeholder="https://api.yourcloud.com/v1"
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-slate-50 font-bold"
                  value={settings.cloudConfig.cloudUrl}
                  onChange={(e) => updateCloud({ cloudUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                  <i className="fas fa-folder-open text-amber-500"></i> {t.folderNameLabel}
                </label>
                <input
                  type="text"
                  placeholder={settings.language === 'ar' ? 'اسم المجلد (مثلاً: اختبارات_أكتوبر)' : 'Folder Name (e.g. October_Quizzes)'}
                  className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50 font-bold"
                  value={settings.cloudConfig.folderName}
                  onChange={(e) => updateCloud({ folderName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.syncOptions}</label>
             <div className="space-y-2">
                {[
                  { key: 'syncGrades', label: t.syncGradesLabel, icon: 'fa-user-graduate', color: 'text-emerald-500' },
                  { key: 'syncTests', label: t.syncTestsLabel, icon: 'fa-file-invoice', color: 'text-indigo-500' },
                  { key: 'syncBank', label: t.syncBankLabel, icon: 'fa-database', color: 'text-amber-500' }
                ].map((option) => (
                  <div key={option.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center border shadow-xs ${option.color}`}>
                        <i className={`fas ${option.icon}`}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{option.label}</span>
                    </div>
                    <button
                      onClick={() => updateCloud({ [option.key]: !(settings.cloudConfig as any)[option.key] })}
                      className={`w-12 h-6 rounded-full transition-all relative ${ (settings.cloudConfig as any)[option.key] ? 'bg-sky-500' : 'bg-slate-300' }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ (settings.cloudConfig as any)[option.key] ? 'left-7' : 'left-1' }`}></div>
                    </button>
                  </div>
                ))}
             </div>

             <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100 flex gap-3">
                <i className="fas fa-info-circle text-sky-500 mt-1"></i>
                <p className="text-xs text-sky-700 leading-relaxed">
                  {settings.language === 'ar' 
                    ? 'سيتم استخدام هذه الإعدادات لتخزين درجات الطلاب وحفظ ملفات الاختبار تلقائياً في المجلد المحدد إذا تم توفير رابط API أو إعدادات Firebase.' 
                    : 'These settings will be used to automatically store student results and quiz files in the specified folder if a Cloud API or Firebase config is provided.'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudSettings;
