// Btns
const buttons = document.querySelector('.buttons');
const settings = document.getElementById('stopw-settings');
const startBtn = document.getElementById('stopw-start');

// History
const historyBTN = document.getElementById('history');
const markTime = document.querySelector('.marked-times');

// Errors
const alertBox = document.querySelector('.alert-box');

// Times
const ms = document.getElementById('milliseconds');
const sec = document.getElementById('seconds');
const min = document.getElementById('minutes');

let startTime;
let resetAcc = false;
let timerStarted = false;
let arrowAdded = false;
let markClick = false;
let animationFrame;
let elapsed = 0;
let pClassNo = 0;

const stopWatch = {
    start() {
        startTime = performance.now() - elapsed;
        startBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        timerStarted = true;
        resetAcc = true;
        animationFrame = requestAnimationFrame(stopWatch.updateHTML);
    },
    
    stop() {
        if (!timerStarted) {
            errorUpdates('Start Required');
            return;
        }
        
        timerStarted = false;
        resetAcc = true;
        cancelAnimationFrame(animationFrame);
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        elapsed = performance.now() - startTime;
    },
    
    reset() {
        stopWatch.stop();
        resetAcc = false;
        elapsed = 0;
        ms.textContent = '00';
        sec.textContent = '00';
        min.textContent = '00';
    },
    
    mark() {
        if (!timerStarted) {
            errorUpdates('Start Required');
            return;
        }
        
        markClick = true;
        
        if (pClassNo !== 0) {
            const prevEl = document.querySelector(`.pClassNo${pClassNo - 1}`);
            if (prevEl) prevEl.classList.remove(`pClassNo${pClassNo - 1}`);
        }
        
        const markEl = document.createElement('p');
        markEl.classList.add(`pClassNo${pClassNo}`);
        markEl.textContent = `${min.textContent}:${sec.textContent}:${ms.textContent}`;
        markTime.appendChild(markEl);
        pClassNo += 1;
        
        if (!arrowAdded) {
            historyBTN.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
            arrowAdded = true;
        }
        
        markTime.scrollTo({ top: markTime.scrollHeight, behavior: 'smooth' });
    },
    
    settingsOpen() {
        if (!settings.classList.contains('open')) {
            settings.classList.add('open');
            setTimeout(() => {
                settings.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            }, 400);
        } else {
            settings.classList.remove('open');
            setTimeout(() => {
                settings.innerHTML = '<i class="fa-solid fa-gears"></i>';
            }, 300);
        }
    },
    
    updateHTML() {
        let now = performance.now() - startTime;
        let milliseconds = Math.floor((now % 1000) / 10);
        let seconds = Math.floor((now / 1000) % 60);
        let minutes = Math.floor(now / 60000);
        
        ms.textContent = String(milliseconds).padStart(2, '0');
        sec.textContent = String(seconds).padStart(2, '0');
        min.textContent = String(minutes).padStart(2, '0');
        
        animationFrame = requestAnimationFrame(stopWatch.updateHTML);
    }
};

buttons.addEventListener('click', (e) => {
    let button = e.target.closest('.button');
    if (!button) return;
    
    switch (button.id) {
        case 'stopw-restart':
            if (!resetAcc) {
                errorUpdates('Start Required');
                return;
            }
            stopWatch.reset();
            break;
        case 'stopw-start':
            if (!timerStarted) {
                stopWatch.start();
            } else {
                stopWatch.stop();
            }
            break;
        case 'stopw-mark':
            stopWatch.mark();
            break;
        case 'stopw-settings':
            stopWatch.settingsOpen();
            break;
    }
});

historyBTN.addEventListener('click', () => {
    if (!markClick) return;
    if (arrowAdded) {
        markTime.classList.add('open');
        historyBTN.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
        historyBTN.classList.add('open');
        arrowAdded = false;
    } else {
        markTime.classList.remove('open');
        historyBTN.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
        historyBTN.classList.remove('open');
        arrowAdded = true;
    }
});

function errorUpdates(text = 'Error', color = '#B80000') {
    alertBox.innerHTML = `
        <div class="error-alert">
            <p style='color: ${color}'>${text}</p>
        </div>
    `;
    
    setTimeout(() => {
    let error = document.querySelector('.error-alert');
    error.style.transform = 'translateX(50vw)';
}, 2000);
}