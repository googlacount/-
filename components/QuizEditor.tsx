
import { Choice, DifficultyLevel, Question, QuestionType, EducationStage, Semester } from '../types';
import { CHOICE_COLORS, TRANSLATIONS } from '../constants';
import React, { useState } from 'react';

interface QuizEditorProps {
  questions: Question[];
  onUpdate: (questions: Question[]) => void;
  onExportToBank?: (question: Question) => void;
  language: 'en' | 'ar';
  bankQuestionIds?: string[];
}

const QuizEditor: React.FC<QuizEditorProps> = ({ questions, onUpdate, onExportToBank, language, bankQuestionIds = [] }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<string | null>(null);
  const [isChoiceListening, setIsChoiceListening] = useState<{ qId: string, cId: string, field: 'text' | 'matchText' } | null>(null);
  const t = TRANSLATIONS[language];

  const getDefaultChoices = (type: QuestionType): Choice[] => {
    const arDefaults = ['أ', 'ب', 'ج', 'د'];
    const enDefaults = ['A', 'B', 'C', 'D'];
    const letterDefaults = language === 'ar' ? arDefaults : enDefaults;

    switch (type) {
      case QuestionType.TRUE_FALSE:
        return [
          { id: crypto.randomUUID(), text: language === 'ar' ? 'صح' : 'True', isCorrect: true },
          { id: crypto.randomUUID(), text: language === 'ar' ? 'خطأ' : 'False', isCorrect: false },
        ];
      case QuestionType.FILL_IN_THE_BLANK:
        return [{ id: crypto.randomUUID(), text: '', isCorrect: true }];
      case QuestionType.ESSAY:
        return [{ id: crypto.randomUUID(), text: '', isCorrect: true }];
      case QuestionType.MATCHING:
        return [
          { id: crypto.randomUUID(), text: '', matchText: '', isCorrect: true },
          { id: crypto.randomUUID(), text: '', matchText: '', isCorrect: true },
        ];
      case QuestionType.MULTIPLE_CHOICE:
      default:
        return [
          { id: crypto.randomUUID(), text: letterDefaults[0], isCorrect: true },
          { id: crypto.randomUUID(), text: letterDefaults[1], isCorrect: false },
          { id: crypto.randomUUID(), text: letterDefaults[2], isCorrect: false },
          { id: crypto.randomUUID(), text: letterDefaults[3], isCorrect: false },
        ];
    }
  };

  const createNewQuestion = (): Question => {
    return {
      id: crypto.randomUUID(),
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.MEDIUM,
      category: language === 'ar' ? 'عام' : 'General',
      text: '',
      points: 1,
      choices: getDefaultChoices(QuestionType.MULTIPLE_CHOICE),
    };
  };

  const addQuestion = (index?: number) => {
    const newQuestion = createNewQuestion();
    if (typeof index === 'number') {
      const newQuestions = [...questions];
      newQuestions.splice(index + 1, 0, newQuestion);
      onUpdate(newQuestions);
    } else {
      onUpdate([...questions, newQuestion]);
    }
    setEditingId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onUpdate(questions.map(q => {
      if (q.id === id) {
        const updated = { ...q, ...updates };
        if (updates.type && updates.type !== q.type) {
          updated.choices = getDefaultChoices(updates.type);
        }
        return updated;
      }
      return q;
    }));
  };

  const removeQuestion = (id: string) => {
    onUpdate(questions.filter(q => q.id !== id));
  };

  const handleImageUpload = (id: string, file: File | null, choiceId?: string) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (choiceId) {
        const question = questions.find(q => q.id === id);
        if (question) {
          const newChoices = question.choices.map(c => 
            c.id === choiceId ? { ...c, image: base64 } : c
          );
          updateQuestion(id, { choices: newChoices });
        }
      } else {
        updateQuestion(id, { image: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const startVoiceInput = (id: string, choiceId?: string, field: 'text' | 'matchText' = 'text') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(language === 'ar' ? 'متصفحك لا يدعم التعرف على الصوت' : 'Your browser does not support Speech Recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      if (choiceId) {
        setIsChoiceListening({ qId: id, cId: choiceId, field });
      } else {
        setIsListening(id);
      }
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const question = questions.find(q => q.id === id);
      if (question) {
        if (choiceId) {
          const newChoices = question.choices.map(c => {
            if (c.id === choiceId) {
              const currentVal = (field === 'matchText' ? c.matchText : c.text) || '';
              return { ...c, [field]: (currentVal + ' ' + transcript).trim() };
            }
            return c;
          });
          updateQuestion(id, { choices: newChoices });
        } else {
          updateQuestion(id, { text: (question.text + ' ' + transcript).trim() });
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(null);
      setIsChoiceListening(null);
    };

    recognition.onend = () => {
      setIsListening(null);
      setIsChoiceListening(null);
    };

    recognition.start();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{t.questions} ({questions.length})</h2>
        <button
          onClick={() => addQuestion()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <i className="fas fa-plus"></i> {t.addQuestion}
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isInBank = bankQuestionIds.includes(q.id);
          
          return (
            <React.Fragment key={q.id}>
              <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${editingId === q.id ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:shadow-md'}`}>
                <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50" onClick={() => setEditingId(editingId === q.id ? null : q.id)}>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 line-clamp-1">{q.text || (language === 'ar' ? 'سؤال جديد...' : 'New question...')}</div>
                    <div className="text-[10px] text-slate-500 flex gap-2 mt-1">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">{t.questionTypes[q.type]}</span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded font-bold">{q.points} {t.points}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${q.difficulty === DifficultyLevel.EASY ? 'bg-emerald-50 text-emerald-600' : q.difficulty === DifficultyLevel.HIGH ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                        {t.difficultyLevels[q.difficulty]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onExportToBank?.(q); }} 
                        title={t.export} 
                        className={`p-2 transition-colors ${isInBank ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-600'}`}
                      >
                        <i className="fas fa-database"></i>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
                        <i className="fas fa-trash"></i>
                      </button>
                      <i className={`fas fa-chevron-${editingId === q.id ? 'up' : 'down'} text-slate-400 w-5 text-center`}></i>
                  </div>
                </div>

                {editingId === q.id && (
                  <div className="p-6 border-t bg-slate-50/50 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.builder}</label>
                        <div className="relative">
                          <textarea
                            className="w-full border rounded-lg p-3 text-black focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] text-sm pr-10 bg-white"
                            value={q.text}
                            onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                          />
                          <button
                            onClick={() => startVoiceInput(q.id)}
                            className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isListening === q.id ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                          >
                            <i className={`fas ${isListening === q.id ? 'fa-stop' : 'fa-microphone'}`}></i>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.type}</label>
                            <select
                              className="w-full border rounded-lg p-2 text-xs text-black outline-none bg-white font-bold h-10 shadow-sm"
                              value={q.type}
                              onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                            >
                              {Object.values(QuestionType).map(type => (
                                <option key={type} value={type}>{t.questionTypes[type]}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.difficulty}</label>
                            <select
                              className="w-full border rounded-lg p-2 text-xs text-black outline-none bg-white font-bold h-10 shadow-sm"
                              value={q.difficulty}
                              onChange={(e) => updateQuestion(q.id, { difficulty: e.target.value as DifficultyLevel })}
                            >
                              {Object.values(DifficultyLevel).map(level => (
                                <option key={level} value={level}>{t.difficultyLevels[level]}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.points}</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="0.5"
                              className="flex-1 accent-indigo-600"
                              value={q.points}
                              onChange={(e) => updateQuestion(q.id, { points: parseFloat(e.target.value) || 0 })}
                            />
                            <input
                              type="number"
                              className="w-16 border rounded-lg p-2 text-center text-sm font-black bg-white shadow-sm"
                              value={q.points}
                              onChange={(e) => updateQuestion(q.id, { points: parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">{t.image}</label>
                        {q.image && (
                          <div className="relative group mb-4">
                            <img src={q.image} className="w-full h-40 object-contain rounded-lg border bg-white" alt="Question" />
                            <button onClick={() => updateQuestion(q.id, { image: undefined })} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        )}
                        <label className="w-full flex flex-col items-center justify-center h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white hover:border-indigo-300 transition-all bg-white/50">
                          <i className="fas fa-cloud-upload-alt text-2xl text-slate-400"></i>
                          <label className="text-[10px] text-slate-500 mt-1 cursor-pointer">{t.upload}</label>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload(q.id, e.target.files[0])} />
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">{t.answers}</label>
                        <div className="space-y-3">
                          {q.choices.map((choice, cIdx) => {
                            const isCurrentlyListeningText = isChoiceListening?.qId === q.id && isChoiceListening?.cId === choice.id && isChoiceListening?.field === 'text';
                            const isColoredBg = q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.TRUE_FALSE;
                            const bgHex = isColoredBg ? CHOICE_COLORS[cIdx % 4] : '#ffffff';
                            const txtColor = isColoredBg ? (cIdx === 3 ? '#000000' : '#ffffff') : '#000000';
                            const iconColorClass = isColoredBg ? (cIdx === 3 ? 'text-black/60 hover:text-black' : 'text-white/70 hover:text-white') : 'text-slate-400 hover:text-indigo-600';

                            return (
                              <div key={choice.id} className="space-y-1">
                                <div className="flex items-center gap-2 group">
                                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: bgHex || '#ccc' }}></div>
                                  <div className="flex-1 space-y-2">
                                    <div className="relative">
                                      <input
                                        type="text"
                                        placeholder={q.type === QuestionType.MATCHING ? t.matchingLeft : (q.type === QuestionType.ESSAY ? t.questionTypes[QuestionType.ESSAY] : t.answers)}
                                        className="w-full border rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none pl-16 pr-2 py-2 font-bold shadow-sm"
                                        style={{ backgroundColor: bgHex, color: txtColor }}
                                        value={choice.text}
                                        onChange={(e) => {
                                          const newChoices = [...q.choices];
                                          newChoices[cIdx] = { ...choice, text: e.target.value };
                                          updateQuestion(q.id, { choices: newChoices });
                                        }}
                                      />
                                      <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1">
                                        <button
                                          onClick={() => startVoiceInput(q.id, choice.id, 'text')}
                                          className={`p-1 rounded transition-all ${isCurrentlyListeningText ? 'text-red-500 animate-pulse' : iconColorClass}`}
                                        >
                                          <i className="fas fa-microphone text-[10px]"></i>
                                        </button>
                                        <label className={`cursor-pointer p-1 ${iconColorClass}`}>
                                          <i className="fas fa-image text-xs"></i>
                                          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload(q.id, e.target.files[0], choice.id)} />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  {(q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.TRUE_FALSE) && (
                                    <button
                                      onClick={() => {
                                        const newChoices = q.choices.map((c, i) => ({ ...c, isCorrect: i === cIdx }));
                                        updateQuestion(q.id, { choices: newChoices });
                                      }}
                                      className={`p-1.5 rounded-lg transition-all ${choice.isCorrect ? 'bg-green-100 text-green-600 scale-110 shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-green-50'}`}
                                    >
                                      <i className="fas fa-check text-[10px]"></i>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* "Add below this question" button icon */}
              <div className="flex justify-center -my-2 opacity-0 hover:opacity-100 transition-opacity z-10 relative">
                 <button 
                  onClick={() => addQuestion(idx)}
                  className="bg-indigo-500 text-white w-8 h-8 rounded-full shadow-lg border-2 border-white hover:scale-125 transition-transform flex items-center justify-center"
                  title={language === 'ar' ? 'إضافة سؤال هنا' : 'Add question here'}
                 >
                   <i className="fas fa-plus text-xs"></i>
                 </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Large add button at the very bottom */}
      <button
        onClick={() => addQuestion()}
        className="w-full py-8 border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex flex-col items-center gap-3 mt-4 group"
      >
        <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
          <i className="fas fa-plus text-2xl"></i>
        </div>
        <span className="font-bold text-sm">{t.addQuestion}</span>
      </button>
    </div>
  );
};

export default QuizEditor;
