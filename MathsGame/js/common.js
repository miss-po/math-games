/* js/common.js - 共用音效與語音引擎 */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);

  if (type === 'success') {
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start(); osc.stop(audioCtx.currentTime + 0.2);
  } else if (type === 'fail') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    osc.start(); osc.stop(audioCtx.currentTime + 0.25);
  } else if (type === 'complete') {
    [523, 659, 783, 1046].forEach((freq, idx) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); o.connect(audioCtx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.1 + 0.3);
      o.start(audioCtx.currentTime + idx * 0.1);
      o.stop(audioCtx.currentTime + idx * 0.1 + 0.3);
    });
  }
}

function speakCantonese(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'zh-HK';
    msg.rate = 0.85;
    window.speechSynthesis.speak(msg);
  }
}

function showRewardModal(onNextCallback) {
  playSound('complete');
  speakCantonese("好叻啊！你完成了這個練習！");
  
  let modal = document.getElementById('reward-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reward-modal';
    modal.style.cssText = `
      position: fixed; top:0; left:0; width:100vw; height:100vh;
      background: rgba(0,0,0,0.7); display:flex; justify-content:center;
      align-items:center; z-index:9999;
    `;
    modal.innerHTML = `
      <div style="background:white; padding:30px; border-radius:20px; text-align:center; max-width:80%;">
        <div style="font-size:60px;">🌟 🍎 🌟</div>
        <h2 style="color:#0284c7; font-size:28px; margin:10px 0;">太棒了！完成練習！</h2>
        <button id="modal-next-btn" style="padding:12px 24px; font-size:20px; background:#0284c7; color:white; border:none; border-radius:10px; cursor:pointer;">再來一次</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
  
  document.getElementById('modal-next-btn').onclick = () => {
    modal.style.display = 'none';
    if (onNextCallback) onNextCallback();
  };
}