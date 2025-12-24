
import { QuizData, QuestionType } from '../types';
import { TRANSLATIONS } from '../constants';

export function generateQuizHtml(data: QuizData): string {
  const { questions, settings } = data;
  const lang = settings.language || 'ar';
  const t = (TRANSLATIONS as any)[lang];
  
  // Safe JSON injection
  const jsonStr = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  const copyrightAlign = settings.copyrightPosition || 'center';

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
            font-family: "Tajawal", "Tahoma", Arial, sans-serif;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            margin: 0;
            padding: 0;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow-x: hidden;
            ${settings.preventScreenshot ? 'user-select: none; -webkit-user-select: none;' : ''}
        }
        .quiz-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 20px 0;
        }
        .quiz-container {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            padding: 25px;
            width: 95%;
            max-width: 650px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            transition: filter 0.3s;
        }
        
        /* Digital Timer Styling */
        .digital-timer {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.5rem;
            background: #111;
            color: #00ff00;
            padding: 8px 15px;
            border-radius: 10px;
            border: 2px solid #333;
            box-shadow: inset 0 0 10px #000, 0 0 15px rgba(0, 255, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 120px;
            justify-content: center;
        }
        .timer-warning {
            color: #ff3333;
            border-color: #ff3333;
            box-shadow: 0 0 15px rgba(255, 51, 51, 0.4);
            animation: timerPulse 1s infinite alternate;
        }
        @keyframes timerPulse {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0.7; transform: scale(1.05); }
        }

        input[type="text"] {
            padding: 12px;
            width: 85%;
            border-radius: 12px;
            border: none;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
            color: #000000 !important;
            outline: none;
            background: #ffffff;
        }
        button {
            padding: 12px 20px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
            margin: 5px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .start-btn { background: #27ae60; color: #fff; }
        .start-btn:hover { background: #2ecc71; transform: scale(1.05); }
        .nav-btn { background: #2980b9; color: #fff; }
        .end-btn { background: #e67e22; color: #fff; }
        .exit-btn { background: #ef4444; color: #fff; }
        
        .modal-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            display: none;
            align-items: center; justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        }
        .modal-box {
            background: #fff; color: #333;
            width: 90%; max-width: 400px;
            padding: 30px; border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            animation: modalSlide 0.3s ease-out;
        }
        @keyframes modalSlide {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .modal-title { font-weight: bold; font-size: 20px; margin-bottom: 15px; color: #1e293b; }
        .modal-body { font-size: 16px; margin-bottom: 25px; line-height: 1.6; color: #475569; }
        .modal-footer { display: flex; justify-content: center; gap: 10px; }
        .modal-btn { min-width: 100px; }
        .modal-ok { background: #2563eb; color: #fff; }
        .modal-cancel { background: #f1f5f9; color: #64748b; }

        .progress-container {
            width: 100%;
            background: #ef4444; 
            border-radius: 20px;
            height: 24px;
            margin-bottom: 20px;
            overflow: hidden;
            position: relative;
        }
        .progress-bar {
            height: 100%;
            width: 0%;
            background: #15803d; 
            border-radius: 20px;
            transition: width 0.5s ease-in-out;
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
        }
        .question-text {
            font-size: 22px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .answers-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 20px;
        }
        @media(min-width: 500px){
            .answers-grid { grid-template-columns: 1fr 1fr; }
        }
        .answer-btn {
            padding: 15px;
            border: none;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            color: #fff;
            transition: 0.3s;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .choice-0 { background: #e74c3c; }
        .choice-1 { background: #3498db; }
        .choice-2 { background: #2ecc71; }
        .choice-3 { background: #f1c40f; color: #000 !important; }
        
        .selected {
            background: #9b59b6 !important;
            box-shadow: 0 0 20px 5px rgba(155, 89, 182, 0.9);
            color: #fff !important;
            transform: scale(1.02);
        }

        .side-column {
            position: absolute;
            top: 25px;
            right: -50px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        @media(max-width: 800px) {
            .side-column { display: none; }
        }
        .q-indicator {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center; justify-content: center;
            font-size: 12px; font-weight: bold;
            cursor: pointer; transition: 0.2s;
        }
        .q-answered { background: #27ae60; color: #fff; }
        .q-unanswered { background: #e74c3c; color: #fff; }
        .q-current { outline: 2px solid #fff; transform: scale(1.1); }

        textarea {
          color: #000000 !important;
          width: 100%; border-radius: 12px;
          padding: 15px; font-size: 16px;
          outline: none; background: #fff;
        }

        .copyright-section {
            width: 95%; max-width: 650px;
            margin-top: 15px; padding: 10px;
            display: flex; align-items: center; gap: 10px;
            opacity: 0.8; font-size: 14px;
            justify-content: ${copyrightAlign === 'left' ? 'flex-start' : copyrightAlign === 'right' ? 'flex-end' : 'center'};
        }
        .copyright-section img { max-height: 30px; border-radius: 4px; }
        
        .branding-status {
            position: absolute; bottom: 10px; left: 10px;
            font-size: 10px; opacity: 0.7;
            display: flex; align-items: center; gap: 5px;
        }
        .branding-status img { max-height: 20px; border-radius: 2px; }

        .feedback-box {
            margin-top: 15px; padding: 15px;
            border-radius: 15px; background: rgba(255, 255, 255, 0.1);
            font-weight: bold; font-size: 18px;
            animation: bounceIn 0.8s;
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
    </style>
</head>
<body>
    <div id="customModal" class="modal-overlay">
        <div class="modal-box">
            <div id="modalTitle" class="modal-title"></div>
            <div id="modalBody" class="modal-body"></div>
            <div class="modal-footer">
                <button id="modalOk" class="modal-btn modal-ok"></button>
                <button id="modalCancel" class="modal-btn modal-cancel"></button>
            </div>
        </div>
    </div>

    <div class="quiz-wrapper" id="mainWrapper">
        <div id="app" class="quiz-container"></div>
        
        ${settings.designerName || settings.designerLogo ? `
        <div class="copyright-section">
            ${settings.designerLogo ? `<img src="${settings.designerLogo}" alt="Logo">` : ''}
            ${settings.designerName ? `<span>${settings.designerName}</span>` : ''}
        </div>` : ''}
    </div>

    <script>
        window.quizData = ${jsonStr};
        window.langStrings = ${JSON.stringify(t)};
        
        // Audio Logic
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playTick() {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.value = 1000;
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
        
        function playWhistle() {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
            osc.start();
            osc.stop(audioCtx.currentTime + 1);
        }

        function safeBtoa(str) {
            return btoa(unescape(encodeURIComponent(str)));
        }
        
        const quizId = 'quiz_attempts_' + safeBtoa(window.quizData.settings.title).substring(0, 32);
        const savedAttempts = parseInt(localStorage.getItem(quizId) || '0');
        
        window.currentStep = window.quizData.settings.skipNameEntry ? 'welcome' : 'start';
        
        // Scheduling logic
        if (window.quizData.settings.schedulingEnabled) {
            const now = new Date();
            if (window.quizData.settings.startTime) {
                const start = new Date(window.quizData.settings.startTime);
                if (now < start) window.currentStep = 'not_yet';
            }
            if (window.quizData.settings.endTime) {
                const end = new Date(window.quizData.settings.endTime);
                if (now > end) window.currentStep = 'expired';
            }
        }

        if (window.quizData.settings.maxAttempts > 0 && savedAttempts >= window.quizData.settings.maxAttempts) {
            window.currentStep = 'blocked';
        }

        window.studentName = '';
        window.currentIdx = 0;
        window.userAnswers = {};
        window.timer = null;
        window.timeLeft = window.quizData.settings.timerSeconds;

        const app = document.getElementById('app');

        function showModal(title, body, onConfirm) {
            const modal = document.getElementById('customModal');
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalBody').innerText = body;
            const okBtn = document.getElementById('modalOk');
            const cancelBtn = document.getElementById('modalCancel');
            
            // Localized button text
            okBtn.innerText = window.langStrings.yes || 'Yes';
            cancelBtn.innerText = window.langStrings.cancel || 'Cancel';
            
            modal.style.display = 'flex';
            const close = () => { modal.style.display = 'none'; };
            okBtn.onclick = () => { close(); if(onConfirm) onConfirm(); };
            cancelBtn.onclick = () => { close(); };
        }

        // Security Features
        if (window.quizData.settings.preventSplitScreen) {
            window.addEventListener('blur', () => {
                if (window.currentStep === 'quiz') {
                    showModal(window.langStrings.securityWarning, window.langStrings.focusLostMsg);
                }
            });
        }

        if (window.quizData.settings.preventScreenshot) {
            window.addEventListener('blur', () => {
                document.getElementById('mainWrapper').style.filter = 'blur(20px)';
            });
            window.addEventListener('focus', () => {
                document.getElementById('mainWrapper').style.filter = 'none';
            });
        }

        if (window.quizData.settings.offlineMode) {
            function checkConnectivity() {
                if (navigator.onLine) {
                    window.currentStep = 'offline_blocked';
                    render();
                } else if (window.currentStep === 'offline_blocked') {
                    window.currentStep = window.quizData.settings.skipNameEntry ? 'welcome' : 'start';
                    render();
                }
            }
            window.addEventListener('online', checkConnectivity);
            window.addEventListener('offline', checkConnectivity);
            if (navigator.onLine) window.currentStep = 'offline_blocked';
        }

        function render() {
            if (window.currentStep === 'blocked') renderBlocked();
            else if (window.currentStep === 'offline_blocked') renderOfflineBlocked();
            else if (window.currentStep === 'not_yet') renderNotYet();
            else if (window.currentStep === 'expired') renderExpired();
            else if (window.currentStep === 'start') renderStart();
            else if (window.currentStep === 'welcome') renderWelcome();
            else if (window.currentStep === 'quiz') renderQuiz();
            else if (window.currentStep === 'summary') renderSummary();
            else if (window.currentStep === 'result') renderResult();
            else if (window.currentStep === 'exit') renderExit();
        }

        function renderNotYet() {
            app.innerHTML = '<div class="py-12"><i class="fas fa-clock text-6xl mb-6 text-white/50"></i><h2 class="text-2xl font-bold px-4">' + window.langStrings.notYetAvailable + '</h2></div>';
        }

        function renderExpired() {
            app.innerHTML = '<div class="py-12"><i class="fas fa-history text-6xl mb-6 text-white/50"></i><h2 class="text-2xl font-bold px-4">' + window.langStrings.expired + '</h2></div>';
        }

        function renderBlocked() {
            app.innerHTML = '<div class="py-12"><i class="fas fa-lock text-6xl mb-6 text-white/50"></i><h2 class="text-2xl font-bold px-4">' + window.langStrings.attemptsReached + '</h2></div>';
        }

        function renderOfflineBlocked() {
            app.innerHTML = '<div class="py-12"><i class="fas fa-wifi text-6xl mb-6 text-white/50"></i><h2 class="text-2xl font-bold px-4">' + window.langStrings.offlineWarning + '</h2></div>';
        }

        function renderStart() {
            app.innerHTML = '<h2 class="text-2xl font-bold mb-6">' + window.langStrings.enterName + '</h2>' +
                '<input type="text" id="nameInput" placeholder="' + window.langStrings.studentName + '">' +
                '<br>' +
                '<button class="start-btn text-xl px-10" onclick="startQuiz()">' + window.langStrings.enterTest + '</button>';
        }

        function renderWelcome() {
            app.innerHTML = '<div class="py-10">' +
                '<h1 class="text-3xl font-bold mb-4">' + window.quizData.settings.title + '</h1>' +
                '<p class="text-lg opacity-90 mb-8">' + window.quizData.settings.welcomeMessage + '</p>' +
                '<button class="start-btn text-xl px-12" onclick="startQuiz()">' + window.langStrings.enterTest + '</button>' +
                '</div>';
            
            if (window.quizData.settings.messageDuration > 0) {
                setTimeout(() => { if(window.currentStep === 'welcome') startQuiz(); }, window.quizData.settings.messageDuration * 1000);
            }
        }

        window.startQuiz = function() {
            if (!window.quizData.settings.skipNameEntry) {
                const input = document.getElementById('nameInput');
                const name = input ? input.value.trim() : "";
                if (!name) { alert(window.langStrings.enterName); return; }
                window.studentName = name;
            } else {
                window.studentName = "Guest";
            }
            window.currentStep = 'quiz';
            if (window.quizData.settings.timerEnabled) startTimer();
            render();
        };

        function startTimer() {
            window.timer = setInterval(() => {
                window.timeLeft--;
                
                // Sound logic
                if (window.timeLeft <= 60 && window.timeLeft > 0) {
                    playTick();
                }

                if (window.timeLeft <= 0) { 
                    clearInterval(window.timer); 
                    playWhistle();
                    setTimeout(finishTest, 1000); 
                }

                const el = document.getElementById('timerDisplay');
                if (el) {
                    const m = Math.floor(window.timeLeft / 60);
                    const s = window.timeLeft % 60;
                    el.innerText = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
                    
                    if (window.timeLeft < 300) {
                        el.parentElement.classList.add('timer-warning');
                    } else {
                        el.parentElement.classList.remove('timer-warning');
                    }
                }
            }, 1000);
        }

        function renderQuiz() {
            const q = window.quizData.questions[window.currentIdx];
            const progress = Math.round(((window.currentIdx + 1) / window.quizData.questions.length) * 100);
            const questionCounterText = (window.currentIdx + 1) + ' / ' + window.quizData.questions.length;
            const isRtl = window.quizData.settings.language === 'ar';
            
            const prevIcon = isRtl ? 'fa-chevron-right' : 'fa-chevron-left';
            const nextIcon = isRtl ? 'fa-chevron-left' : 'fa-chevron-right';

            let answersHtml = '';
            if (q.type === 'Multiple Choice' || q.type === 'True/False') {
                answersHtml = '<div class="answers-grid">';
                q.choices.forEach((c, i) => {
                    const isSelected = window.userAnswers[q.id] === c.id;
                    const choiceClass = 'choice-' + (i % 4);
                    answersHtml += '<button onclick="selectChoice(\\'' + q.id + '\\', \\'' + c.id + '\\')" class="answer-btn ' + choiceClass + ' ' + (isSelected ? 'selected' : '') + '">' +
                        (c.image ? '<img src="' + c.image + '" class="max-h-24 rounded mb-2 mx-auto">' : '') +
                        '<span>' + c.text + '</span>' +
                        '</button>';
                });
                answersHtml += '</div>';
            } else if (q.type === 'Fill in the blank' || q.type === 'Essay') {
                answersHtml = '<textarea oninput="saveText(\\'' + q.id + '\\', this.value)" rows="4">' + (window.userAnswers[q.id] || '') + '</textarea>';
            }

            let sideCol = '';
            if (window.quizData.settings.appearance.showSideColumn) {
                sideCol = '<div class="side-column">';
                window.quizData.questions.forEach((_, i) => {
                    const status = window.userAnswers[window.quizData.questions[i].id] ? 'q-answered' : 'q-unanswered';
                    const active = i === window.currentIdx ? 'q-current' : '';
                    sideCol += '<div onclick="jumpTo(' + i + ')" class="q-indicator ' + status + ' ' + active + '">' + (i+1) + '</div>';
                });
                sideCol += '</div>';
            }

            app.innerHTML = '<div class="progress-container"><div class="progress-bar" id="progressBar" style="width: ' + progress + '%">' + progress + '%</div></div>' +
                sideCol +
                '<div class="flex justify-between items-center mb-4"><span class="text-xs bg-white/20 px-3 py-1 rounded font-bold">' + questionCounterText + '</span>' +
                (window.quizData.settings.timerEnabled ? '<div class="digital-timer"><i class="fas fa-hourglass-half"></i> <span id="timerDisplay">00:00</span></div>' : '') +
                '</div>' +
                '<div class="question-text">' + q.text + '</div>' +
                (q.image ? '<img src="' + q.image + '" class="max-w-full rounded-xl mb-6 mx-auto shadow-lg border-2 border-white/20">' : '') +
                answersHtml +
                '<div class="mt-8 flex justify-between items-center">' +
                '<button class="nav-btn" onclick="prevQ()"><i class="fas ' + prevIcon + ' text-xl"></i> ' + window.langStrings.prev + '</button>' +
                (window.currentIdx === window.quizData.questions.length - 1 ? 
                    '<button class="end-btn scale-110 shadow-lg" onclick="goSummary()">' + window.langStrings.finish + ' <i class="fas fa-check-double text-xl"></i></button>' :
                    '<button class="nav-btn" onclick="nextQ()">' + window.langStrings.next + ' <i class="fas ' + nextIcon + ' text-xl"></i></button>') +
                '</div>';
            
            if (window.quizData.settings.timerEnabled) {
                const el = document.getElementById('timerDisplay');
                const m = Math.floor(window.timeLeft / 60);
                const s = window.timeLeft % 60;
                el.innerText = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
                if (window.timeLeft < 300) el.parentElement.classList.add('timer-warning');
            }
        }

        window.selectChoice = function(qId, cId) { window.userAnswers[qId] = cId; renderQuiz(); };
        window.saveText = function(qId, val) { window.userAnswers[qId] = val; };
        window.nextQ = function() { if(window.currentIdx < window.quizData.questions.length-1) { window.currentIdx++; renderQuiz(); } };
        window.prevQ = function() { if(window.currentIdx > 0) { window.currentIdx--; renderQuiz(); } };
        window.jumpTo = function(idx) { window.currentIdx = idx; renderQuiz(); };
        
        window.goSummary = function() { 
          const unanswered = [];
          window.quizData.questions.forEach((q, i) => { if(!window.userAnswers[q.id]) unanswered.push(i+1); });
          
          let modalTitle = window.langStrings.confirmFinish;
          let modalBody = window.langStrings.confirmFinishMsg;
          
          if (unanswered.length > 0) {
            modalTitle = window.langStrings.warning;
            modalBody = window.langStrings.unansweredAlert + " (" + unanswered.join(", ") + ")";
          }
          
          showModal(modalTitle, modalBody, () => { window.currentStep = 'summary'; render(); });
        };

        window.finishTest = async function() { 
            if(window.timer) clearInterval(window.timer); 
            if (window.quizData.settings.maxAttempts > 0) {
                const current = parseInt(localStorage.getItem(quizId) || '0');
                localStorage.setItem(quizId, (current + 1).toString());
            }
            
            let score = 0;
            window.quizData.questions.forEach(q => {
                if(q.type === 'Multiple Choice' || q.type === 'True/False') {
                    const correct = q.choices.find(c => c.isCorrect);
                    if(correct && window.userAnswers[q.id] === correct.id) score += q.points;
                } else if(q.type === 'Fill in the blank') {
                    if((window.userAnswers[q.id]||'').trim().toLowerCase() === (q.choices[0]?.text||'').trim().toLowerCase()) score += q.points;
                }
            });
            const total = window.quizData.questions.reduce((s, q) => s + q.points, 0);

            if (window.quizData.settings.cloudConfig.syncGrades && (window.quizData.settings.cloudConfig.cloudUrl || window.quizData.settings.cloudConfig.firebaseConfig)) {
                try {
                    const payload = {
                        student: window.studentName,
                        score: score, total: total,
                        quiz: window.quizData.settings.title,
                        timestamp: new Date().toISOString(),
                        answers: window.userAnswers
                    };
                    if (window.quizData.settings.cloudConfig.cloudUrl) {
                        await fetch(window.quizData.settings.cloudConfig.cloudUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                    }
                } catch (e) { console.error("Cloud Sync Failed", e); }
            }
            window.currentStep = 'result'; render(); 
        };

        function renderSummary() {
            const missing = [];
            window.quizData.questions.forEach((q, i) => { if(!window.userAnswers[q.id]) missing.push(i+1); });
            app.innerHTML = '<h2 class="text-2xl font-bold mb-4">' + window.langStrings.summaryTitle + '</h2>' +
                (missing.length > 0 ? 
                    '<div class="bg-red-600/30 p-4 rounded-xl mb-6"><p class="mb-2 font-bold">' + window.langStrings.unanswered + '</p>' +
                    '<div class="flex flex-wrap justify-center gap-2">' +
                    missing.map(n => '<button onclick="jumpTo(' + (n-1) + '); window.currentStep=\\'quiz\\'; render()" class="w-10 h-10 bg-red-600 rounded-lg">' + n + '</button>').join('') +
                    '</div></div>' : 
                    '<div class="bg-green-600/30 p-6 rounded-xl mb-6"><p class="font-bold">' + window.langStrings.allAnswered + '</p></div>') +
                '<div class="flex justify-center gap-4">' +
                '<button class="nav-btn" onclick="window.currentStep=\\'quiz\\'; render()">' + window.langStrings.back + '</button>' +
                '<button class="start-btn" onclick="finishTest()">' + window.langStrings.finalSub + '</button>' +
                '</div>';
        }

        function renderResult() {
            let score = 0;
            window.quizData.questions.forEach(q => {
                if(q.type === 'Multiple Choice' || q.type === 'True/False') {
                    const correct = q.choices.find(c => c.isCorrect);
                    if(correct && window.userAnswers[q.id] === correct.id) score += q.points;
                } else if(q.type === 'Fill in the blank') {
                    if((window.userAnswers[q.id]||'').trim().toLowerCase() === (q.choices[0]?.text||'').trim().toLowerCase()) score += q.points;
                }
            });
            const total = window.quizData.questions.reduce((s, q) => s + q.points, 0);
            const percent = Math.round((score/total)*100);
            let feedback = ''; let feedbackColor = '';
            if (percent >= 90) { feedback = window.langStrings.feedback.excellent; feedbackColor = '#27ae60'; }
            else if (percent >= 75) { feedback = window.langStrings.feedback.veryGood; feedbackColor = '#2ecc71'; }
            else if (percent >= 60) { feedback = window.langStrings.feedback.good; feedbackColor = '#f1c40f'; }
            else if (percent >= 50) { feedback = window.langStrings.feedback.fair; feedbackColor = '#e67e22'; }
            else { feedback = window.langStrings.feedback.poor; feedbackColor = '#e74c3c'; }
            
            const designerLogo = window.quizData.settings.designerLogo;
            const designerName = window.quizData.settings.designerName;
            const brandingHtml = (designerLogo || designerName) ? 
                '<div class="branding-status">' + 
                (designerLogo ? '<img src="' + designerLogo + '" alt="Logo">' : '') +
                (designerName ? '<span>' + designerName + '</span>' : '') +
                '</div>' : '';

            app.innerHTML = '<h2 class="text-3xl font-bold mb-4">' + window.langStrings.results + '</h2>' +
                '<div class="text-xl mb-6">' + window.studentName + '</div>' +
                '<div class="bg-white/10 py-8 rounded-3xl mb-4 border border-white/20">' +
                '<div class="text-5xl font-black mb-2">' + score + ' / ' + total + '</div>' +
                '<div class="text-xl opacity-70">' + percent + '%</div>' +
                '</div>' +
                '<div class="feedback-box mb-8" style="color:' + feedbackColor + '">' + feedback + '</div>' +
                '<div class="space-y-3">' +
                    '<button class="start-btn whatsapp-btn w-full flex items-center justify-center gap-2" style="background:#27ae60" onclick="sendWA(' + score + ',' + total + ')">' +
                    '<i class="fab fa-whatsapp text-2xl"></i> ' + window.langStrings.sendWhatsApp + '</button>' +
                    '<div class="grid grid-cols-2 gap-3">' +
                        '<button class="nav-btn w-full" onclick="location.reload()">' + window.langStrings.tryAgain + '</button>' +
                        '<button class="exit-btn w-full" onclick="exitQuiz()">' + window.langStrings.exit + '</button>' +
                    '</div>' +
                '</div>' +
                brandingHtml;
        }

        window.sendWA = function(s, t) {
            const msg = (window.quizData.settings.language === 'ar' ? 'الاختبار: ' : 'Quiz: ') + window.quizData.settings.title + '\\n' + (window.quizData.settings.language === 'ar' ? 'الطالب: ' : 'Student: ') + window.studentName + '\\n' + (window.quizData.settings.language === 'ar' ? 'الدرجة: ' : 'Score: ') + s + ' / ' + t;
            const phone = window.quizData.settings.teacherWhatsApp.replace(/\\D/g,'');
            window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
        };

        window.exitQuiz = function() {
            showModal(window.langStrings.confirmExit, window.langStrings.confirmExitMsg, () => { window.currentStep = 'exit'; render(); });
        };

        function renderExit() {
            app.innerHTML = '<div class="py-12"><h2 class="text-2xl font-bold">' + (window.langStrings.exitTip || "شكراً لك.") + '</h2><button class="nav-btn mt-8" onclick="location.reload()">' + (window.quizData.settings.language === 'ar' ? 'العودة للبداية' : 'Back to Start') + '</button></div>';
        }

        render();
    </script>
</body>
</html>
  `;
}
