
import React from 'react';
import { SavedQuizEntry, EducationStage, Semester } from '../types';
import { TRANSLATIONS } from '../constants';

interface QuizLibraryProps {
  language: 'en' | 'ar';
  library: SavedQuizEntry[];
  onLoad: (entry: SavedQuizEntry) => void;
  onRemove: (id: string) => void;
}

const QuizLibrary: React.FC<QuizLibraryProps> = ({ language, library, onLoad, onRemove }) => {
  const t = (TRANSLATIONS as any)[language];

  return (
    <div className="space-y-6 animate-fadeIn">
      {library.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <i className="fas fa-folder-open text-2xl"></i>
          </div>
          <p className="text-slate-500 font-medium">{t.emptyLibrary}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {library.map(quiz => {
            const settings = quiz.data.settings;
            const stageText = settings.defaultStage ? t.stages[settings.defaultStage] : '';
            const semesterText = settings.defaultSemester ? t.semesters[settings.defaultSemester] : '';
            
            let gradeLabel = settings.defaultGrade || '';
            if (language === 'ar' && settings.defaultGrade) {
              gradeLabel = settings.defaultStage === EducationStage.PRIMARY ? `الصف ${settings.defaultGrade} الابتدائي` :
                           settings.defaultStage === EducationStage.PREPARATORY ? `الصف ${settings.defaultGrade} الإعدادي` :
                           `الصف ${settings.defaultGrade} الثانوي`;
            } else if (settings.defaultGrade) {
              gradeLabel = `Grade ${settings.defaultGrade}`;
            }

            return (
              <div key={quiz.id} className="bg-white border rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col group border-slate-200">
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase border border-indigo-100">
                        {stageText}
                      </span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase border border-emerald-100">
                        {semesterText}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(quiz.savedAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {settings.title}
                    </h4>
                    <p className="text-xs font-bold text-indigo-500 mt-1">{gradeLabel}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-50 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <i className="fas fa-book-open text-slate-400 w-4 text-center"></i>
                      <span className="text-slate-600 font-medium">
                        {settings.subject} {settings.branch ? `(${settings.branch})` : ''}
                      </span>
                    </div>
                    
                    {(settings.unit || settings.lesson) && (
                      <div className="flex items-center gap-2 text-[11px]">
                        <i className="fas fa-layer-group text-slate-400 w-4 text-center"></i>
                        <span className="text-slate-500 italic">
                          {settings.unit ? `${settings.unit}` : ''} 
                          {settings.unit && settings.lesson ? ' - ' : ''}
                          {settings.lesson ? `${settings.lesson}` : ''}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span><i className="fas fa-question-circle mr-1"></i> {quiz.data.questions.length} {t.questions}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t bg-slate-50/50 flex gap-2">
                  <button 
                    onClick={() => onLoad(quiz)}
                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-2xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-100"
                  >
                    {t.load}
                  </button>
                  <button 
                    onClick={() => onRemove(quiz.id)}
                    className="px-4 py-2 bg-white border border-slate-200 text-red-500 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-colors"
                    title={language === 'ar' ? 'حذف' : 'Delete'}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizLibrary;
