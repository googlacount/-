
import { QuizData, QuestionType } from '../types';
import { TRANSLATIONS } from '../constants';

export function generateQuizHtml(data: QuizData): string {
  const { questions, settings } = data;
  const lang = settings.language || 'ar';
  const t = (TRANSLATIONS as any)[lang];
  const app = settings.appearance;
  const jsonStr = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return `
<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${settings.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&family=Orbitron:wght@500;700&display=swap" rel="stylesheet">
    <style>
        body { 
          font-family: "Tajawal", sans-serif; 
          background-color: ${app.backgroundColor};
          ${app.backgroundImage ? `background-image: url('${app.backgroundImage}'); background-size: cover; background-position: center; background-attachment: fixed;` : ''}
          color: #fff; 
          min-height: 100vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0; 
          overflow-x: hidden;
        }
        .quiz-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 2rem; padding: 2.5rem; width: 90%; max-width: 700px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); text-align: center; position: relative; overflow: hidden; }
        .digital-timer { font-family: 'Orbitron', sans-serif; font-size: 2rem; color: #00ff00; background: #000; padding: 0.5rem 1.5rem; border-radius: 1rem; border: 2px solid #00ff00; box-shadow: 0 0 20px rgba(0,255,0,0.3); }
        .digital-timer.warning { color: #ff3333; border-color: #ff3333; animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0.3; } }
        
        .answer-btn { width: 100%; padding: 1.25rem; border-radius: 1rem; font-weight: bold; transition: all 0.2s; margin-bottom: 1rem; text-align: center; border: 2px solid transparent; color: #fff; cursor: pointer; }
        .choice-0 { background: #e74c3c; } .choice-1 { background: #3498db; }
        .choice-2 { background: #2ecc71; } .choice-3 { background: #f1c40f; color: #000 !important; }
        
        .answer-btn.selected { 
          border-color: #fff; 
          background-color: ${app.selectedColor} !important;
          color: ${app.selectedTextColor} !important;
        }

        /* Review Styles */
        .review-correct { border: 3px solid #10b981 !important; position: relative; }
        .review-correct::after { content: '✅'; position: absolute; top: -10px; right: -10px; font-size: 1.5rem; }
        .review-wrong { border: 3px solid #ef4444 !important; opacity: 0.7; position: relative; }
        .review-wrong::after { content: '❌'; position: absolute; top: -10px; right: -10px; font-size: 1.5rem; }

        /* Animations */
        .anim-fade { animation: fadeIn 0.5s ease-out; }
        .anim-slide { animation: slideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .anim-zoom { animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .anim-flip { animation: flipIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(${lang === 'ar' ? '100px' : '-100px'}); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes flipIn { from { transform: rotateY(90deg); opacity: 0; } to { transform: rotateY(0); opacity: 1; } }

        input[type="text"] { width: 100%; padding: 1rem; border-radius: 0.75rem; background: rgba(255,255,255,0.1); border: 1px solid #444; color: #fff; text-align: center; font-size: 1.25rem; outline: none; }
        .essay-area { width: 100%; background: rgba(255,255,255,0.1); border: 1px solid #444; border-radius: 1rem; padding: 1rem; color: #fff; min-height: 120px; margin-bottom: 1rem; outline: none; display: block; }
        .result-badge { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 2rem; border-radius: 2rem; box-shadow: 0 15px 30px rgba(16, 185, 129, 0.2); }
    </style>
</head>
<body>
    <div id="app" class="quiz-card"></div>
    <script>
        const quizData = ${jsonStr};
        const t = ${JSON.stringify(t)};
        const appSettings = quizData.settings.appearance;
        let currentStep = 'check';
        let studentName = '', currentIdx = 0, userAnswers = {}, timeLeft = quizData.settings.timerSeconds, timerInt;
        let lastRenderedIdx = -1, lastRenderedStep = '';
        let isReviewMode = false;

        // Attempts logic
        const STORAGE_KEY = 'quiz_attempts_' + quizData.settings.title.replace(/\\s/g, '_');
        let attemptsCount = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;

        function render() {
            const app = document.getElementById('app');
            const isNavigating = currentIdx !== lastRenderedIdx || currentStep !== lastRenderedStep;
            app.className = 'quiz-card';
            
            if(isNavigating && appSettings.transitionEffect !== 'none' && currentStep !== 'check') {
                void app.offsetWidth;
                app.classList.add('anim-' + appSettings.transitionEffect);
            }
            
            lastRenderedIdx = currentIdx;
            lastRenderedStep = currentStep;

            if(currentStep === 'check') currentStep = 'start';

            if(currentStep === 'start') {
                app.innerHTML = '<h2 class="text-2xl font-bold mb-6">' + t.enterName + '</h2><input type="text" id="nameIn" placeholder="' + t.studentName + '"><button onclick="startQ()" class="mt-8 bg-emerald-600 w-full py-4 rounded-xl font-bold text-xl hover:bg-emerald-500 transition-all">' + t.enterTest + '</button>';
            } else if(currentStep === 'quiz') {
                const q = quizData.questions[currentIdx];
                let contentHTML = '';

                if (q.type === 'Essay') {
                   const saved = userAnswers[q.id] || { text: '', image: null };
                   contentHTML = '<textarea class="essay-area" '+(isReviewMode?'disabled':'')+' placeholder="' + (t.language === 'ar' ? 'اكتب إجابتك هنا...' : 'Write your answer here...') + '" oninput="saveEssay(\\''+q.id+'\\', this.value)">' + saved.text + '</textarea>' +
                   '<div class="flex flex-col items-center justify-center mt-2">' +
                     (!isReviewMode ? '<label class="upload-btn cursor-pointer bg-blue-600 p-3 rounded-xl mb-4 font-bold inline-block"><i class="fas fa-camera"></i> ' + (t.language === 'ar' ? 'إرفاق صورة' : 'Attach Image') + '<input type="file" accept="image/*" hidden onchange="saveImg(\\''+q.id+'\\', this)"></label>' : '') +
                     (saved.image ? '<img src="'+saved.image+'" class="max-h-40 rounded-xl border-2 border-white/20">' : '') +
                   '</div>';
                } else {
                   contentHTML = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' + q.choices.map((c,i)=> {
                     const isSelected = userAnswers[q.id]===c.id;
                     const isCorrect = c.isCorrect;
                     let reviewClass = '';
                     if(isReviewMode) {
                        if(isCorrect) reviewClass = 'review-correct';
                        else if(isSelected && !isCorrect) reviewClass = 'review-wrong';
                     }
                     return '<button '+(isReviewMode?'disabled':'')+' onclick="selChoice(\\''+q.id+'\\',\\''+c.id+'\\')" class="answer-btn choice-'+(i%4)+' '+(isSelected?'selected ':'') + reviewClass +'">'+(c.image?'<img src="'+c.image+'" class="h-20 mx-auto mb-2">':'')+'<span>'+c.text+'</span></button>';
                   }).join('') + '</div>';
                }

                app.innerHTML = '<div class="flex justify-between items-center mb-8"><span class="bg-white/10 px-4 py-1 rounded-full text-xs">' + (currentIdx+1) + ' / ' + quizData.questions.length + '</span>' + (quizData.settings.timerEnabled && !isReviewMode ? '<div id="timer" class="digital-timer">00:00</div>' : '') + '</div>' + 
                (isReviewMode ? '<div class="text-xs bg-amber-500/20 text-amber-400 p-2 rounded-lg mb-4">وضع المراجعة - الإجابات الصحيحة محددة</div>' : '') +
                '<h3 class="text-xl font-bold mb-6">' + q.text + '</h3>' + (q.image ? '<img src="'+q.image+'" class="max-w-full rounded-xl mb-6 mx-auto">' : '') + 
                contentHTML + 
                '<div class="flex justify-between mt-8 gap-4"><button class="bg-white/10 px-8 py-3 rounded-xl" onclick="prev()">'+t.prev+'</button>' + 
                (currentIdx===quizData.questions.length-1 ? 
                    (isReviewMode ? '<button class="flex-1 bg-emerald-600 rounded-xl font-bold" onclick="currentStep=\\'result\\';render()">العودة للنتيجة</button>' : '<button class="flex-1 bg-emerald-600 rounded-xl font-bold" onclick="finish()">'+t.finish+'</button>') 
                    : '<button class="flex-1 bg-indigo-600 rounded-xl font-bold" onclick="next()">'+t.next+'</button>') + '</div>';
                
                if(quizData.settings.timerEnabled && !isReviewMode) updateTimerUI();
            } else if(currentStep === 'result') {
                let s = 0; quizData.questions.forEach(q=> { 
                  if(q.type === 'Essay') return; 
                  const c = q.choices.find(x=>x.isCorrect); 
                  if(c && userAnswers[q.id]===c.id) s+=q.points; 
                });
                const tot = quizData.questions.reduce((a,b)=>a+b.points, 0);
                const maxAttempts = quizData.settings.maxAttempts || 0;
                const exhausted = maxAttempts > 0 && attemptsCount >= maxAttempts;

                app.innerHTML = '<div class="result-badge mb-6"><h2 class="text-2xl font-bold mb-2">' + t.results + '</h2><div class="text-6xl font-black mb-2">' + s + ' / ' + tot + '</div><p class="opacity-90">' + studentName + '</p></div>' +
                '<div class="grid grid-cols-1 gap-3">' +
                   (exhausted ? 
                    '<button disabled class="bg-slate-700 text-slate-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2"><i class="fas fa-lock"></i> لقد استنفدت المحاولات</button>' : 
                    '<button onclick="retry()" class="bg-indigo-600 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all"><i class="fas fa-redo ml-2"></i> إعادة المحاولة ('+(maxAttempts > 0 ? (maxAttempts-attemptsCount) + ' متبقية' : 'مفتوح')+')</button>') +
                   '<button onclick="isReviewMode=true;currentIdx=0;currentStep=\\'quiz\\';render()" class="bg-white/10 py-4 rounded-xl font-bold hover:bg-white/20"><i class="fas fa-eye ml-2"></i> مراجعة الإجابات</button>' +
                   '<button onclick="sendWA('+s+','+tot+')" class="bg-emerald-600 py-4 rounded-xl font-bold hover:bg-emerald-500"><i class="fab fa-whatsapp ml-2"></i> إرسال النتيجة للمعلم</button>' +
                   '<button onclick="downloadReport('+s+','+tot+')" class="bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-500"><i class="fas fa-download ml-2"></i> تحميل تقرير الإجابات</button>' +
                '</div>';
            }
        }

        window.retry = () => { currentIdx = 0; currentStep = 'quiz'; isReviewMode = false; timeLeft = quizData.settings.timerSeconds; render(); };

        window.startQ = () => { studentName = document.getElementById('nameIn').value.trim() || 'Guest'; currentStep = 'quiz'; if(quizData.settings.timerEnabled) timerInt = setInterval(()=>{ if(isReviewMode) return; timeLeft--; updateTimerUI(); if(timeLeft<=0){ clearInterval(timerInt); finish(); } },1000); render(); };
        
        window.finish = () => { 
            clearInterval(timerInt); 
            attemptsCount++;
            localStorage.setItem(STORAGE_KEY, attemptsCount);
            currentStep = 'result'; 
            render(); 
        };

        window.downloadReport = (s, tot) => {
            let report = "تقرير اختبار: " + quizData.settings.title + "\\n";
            report += "الطالب: " + studentName + "\\n";
            report += "النتيجة: " + s + " / " + tot + "\\n\\n";
            quizData.questions.forEach((q, i) => {
                const ans = userAnswers[q.id];
                const choice = q.choices.find(c => c.id === (q.type==='Essay'?ans?.text:ans));
                report += (i+1) + ". " + q.text + "\\n";
                report += "الإجابة: " + (q.type==='Essay' ? (userAnswers[q.id]?.text || "بدون") : (choice ? choice.text : "لم يجب")) + "\\n\\n";
            });
            const blob = new Blob([report], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = studentName + "_نتيجة.txt"; a.click();
        };

        window.updateTimerUI = () => {
            const el = document.getElementById('timer'); if(!el) return;
            const m = Math.floor(timeLeft/60), s = timeLeft%60;
            el.innerText = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
            if(timeLeft <= 300) el.classList.add('warning');
        };

        window.selChoice = (qid, cid) => { userAnswers[qid] = cid; render(); };
        window.saveEssay = (qid, txt) => { userAnswers[qid] = { ...(userAnswers[qid]||{}), text: txt }; };
        window.saveImg = (qid, input) => { if (input.files[0]) { const reader = new FileReader(); reader.onload = (e) => { userAnswers[qid] = { ...(userAnswers[qid]||{}), image: e.target.result }; render(); }; reader.readAsDataURL(input.files[0]); } };
        window.next = () => { currentIdx++; render(); };
        window.prev = () => { currentIdx--; render(); };
        
        window.sendWA = (s, tot) => { 
            let details = '';
            quizData.questions.forEach((q, i) => {
                let ansDisplay = '';
                let icon = '';
                if (q.type === 'Essay') {
                    const ansObj = userAnswers[q.id] || { text: '', image: null };
                    ansDisplay = (ansObj.text || 'لا يوجد نص') + (ansObj.image ? ' [🖼️ صورة]' : '');
                    icon = '📝';
                } else {
                    const ansId = userAnswers[q.id];
                    const choice = q.choices.find(c => c.id === ansId);
                    ansDisplay = choice ? choice.text : 'لم يجب';
                    icon = (choice && choice.isCorrect) ? '✅' : '❌';
                }
                details += '\\n' + (i+1) + ') ' + q.text.substring(0,25) + '.. 👉 ' + ansDisplay + ' ' + icon;
            });
            const msg = quizData.settings.title + '\\n👤 ' + studentName + '\\n🏆 ' + s + '/' + tot + '\\n----------------' + details;
            window.open('https://wa.me/'+quizData.settings.teacherWhatsApp.replace(/\\D/g,'')+'?text='+encodeURIComponent(msg)); 
        };
        render();
    </script>
</body>
</html>`;
}
