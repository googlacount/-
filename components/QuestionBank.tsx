
import React, { useState, useMemo } from 'react';
import { Question, EducationStage, Semester, QuestionType, DifficultyLevel } from '../types';
import { TRANSLATIONS, EDUCATION_DATA } from '../constants';

interface QuestionBankProps {
  language: 'en' | 'ar';
  bank: Question[];
  onImport: (question: Question) => void;
  onRemove: (id: string) => void;
}

const QuestionBank: React.FC<QuestionBankProps> = ({ language, bank, onImport, onRemove }) => {
  const t = (TRANSLATIONS as any)[language];
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState<EducationStage | 'all'>('all');
  const [filterGrade, setFilterGrade] = useState<string | 'all'>('all');
  const [filterType, setFilterType] = useState<QuestionType | 'all'>('all');
  const [filterDiff, setFilterDiff] = useState<DifficultyLevel | 'all'>('all');

  const filtered = useMemo(() => {
    return bank.filter(q => {
      const matchSearch = q.text.toLowerCase().includes(search.toLowerCase()) || 
                          (q.subject && q.subject.toLowerCase().includes(search.toLowerCase())) ||
                          (q.branch && q.branch.toLowerCase().includes(search.toLowerCase()));
      const matchStage = filterStage === 'all' || q.stage === filterStage;
      const matchGrade = filterGrade === 'all' || q.grade === filterGrade;
      const matchType = filterType === 'all' || q.type === filterType;
      const matchDiff = filterDiff === 'all' || q.difficulty === filterDiff;
      return matchSearch && matchStage && matchGrade && matchType && matchDiff;
    });
  }, [bank, search, filterStage, filterGrade, filterType, filterDiff]);

  const gradesForFilter = filterStage !== 'all' ? (EDUCATION_DATA as any)[filterStage] : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder={t.search}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select 
              className="px-3 py-2 border rounded-xl text-xs font-bold outline-none bg-slate-50"
              value={filterStage}
              onChange={(e) => {
                setFilterStage(e.target.value as any);
                setFilterGrade('all');
              }}
            >
              <option value="all">{t.stage}: {language === 'ar' ? 'الكل' : 'All'}</option>
              {Object.values(EducationStage).map(s => <option key={s} value={s}>{t.stages[s]}</option>)}
            </select>

            {filterStage !== 'all' && (
              <select 
                className="px-3 py-2 border rounded-xl text-xs font-bold outline-none bg-slate-50 animate-fadeIn"
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
              >
                <option value="all">{t.grade}: {language === 'ar' ? 'الكل' : 'All'}</option>
                {gradesForFilter.map((g: string) => <option key={g} value={g}>{language === 'ar' ? `الصف ${g}` : `Grade ${g}`}</option>)}
              </select>
            )}

            <select 
              className="px-3 py-2 border rounded-xl text-xs font-bold outline-none bg-slate-50"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">{t.type}: {language === 'ar' ? 'الكل' : 'All'}</option>
              {Object.values(QuestionType).map(v => <option key={v} value={v}>{t.questionTypes[v]}</option>)}
            </select>
            <select 
              className="px-3 py-2 border rounded-xl text-xs font-bold outline-none bg-slate-50"
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value as any)}
            >
              <option value="all">{t.difficulty}: {language === 'ar' ? 'الكل' : 'All'}</option>
              {Object.values(DifficultyLevel).map(v => <option key={v} value={v}>{t.difficultyLevels[v]}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <i className="fas fa-database text-2xl"></i>
          </div>
          <p className="text-slate-500 font-medium">{t.emptyBank}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(q => (
            <div key={q.id} className="bg-white border rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow group">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">{t.stages[q.stage!]} - {language === 'ar' ? `الصف ${q.grade}` : `Grade ${q.grade}`}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">{q.subject} {q.branch ? `(${q.branch})` : ''}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{t.questionTypes[q.type]}</span>
                </div>
                <p className="text-slate-800 font-bold line-clamp-2">{q.text}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => onImport(q)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                >
                  <i className="fas fa-file-import"></i> {t.import}
                </button>
                <button 
                  onClick={() => onRemove(q.id)}
                  className="text-slate-400 hover:text-red-500 p-2 text-xs transition-colors text-center"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
