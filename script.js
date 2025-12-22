// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {

  // --- Hero Particle Background ---
  const heroCanvas = document.getElementById('heroCanvas');
  const ctx = heroCanvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  for(let i=0;i<100;i++){
    particles.push({
      x: Math.random()*heroCanvas.width,
      y: Math.random()*heroCanvas.height,
      radius: Math.random()*2+1,
      dx: (Math.random()-0.5)*0.5,
      dy: (Math.random()-0.5)*0.5
    });
  }
function showLink() {
    alert("https://www.apple.com/app-store/");
}


  function animateParticles(){
    ctx.clearRect(0,0,heroCanvas.width, heroCanvas.height);
    ctx.fillStyle = 'rgba(6,182,212,0.8)';
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if(p.x<0||p.x>heroCanvas.width) p.dx*=-1;
      if(p.y<0||p.y>heroCanvas.height) p.dy*=-1;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- Fade Up Animation ---
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, {threshold:0.2});
  document.querySelectorAll('.fadeUp').forEach(el=>observer.observe(el));

  // --- Demo Chart ---
  const ctxDemo = document.getElementById('demoChart').getContext('2d');
  const demoChart = new Chart(ctxDemo,{
    type:'line',
    data:{
      labels:['6AM','9AM','12PM','3PM','6PM','9PM'],
      datasets:[
        {label:'Heart', data:[76,72,80,78,75,74], borderColor:'#06b6d4', backgroundColor:'rgba(6,182,212,0.2)', tension:0.4},
        {label:'Steps', data:[5000,6500,7000,7500,8200,9000], borderColor:'#00f5a0', backgroundColor:'rgba(0,245,160,0.2)', tension:0.4},
        {label:'Sleep', data:[0,0,2,1.5,2,0.5], borderColor:'#fff', backgroundColor:'rgba(255,255,255,0.2)', tension:0.4}
      ]
    },
    options:{responsive:true, plugins:{legend:{position:'top'}}}
  });

  // --- Demo Buttons & Stats ---
  document.getElementById('addSample').addEventListener('click', () => {
    const newHeart = Math.floor(Math.random()*(100-60+1))+60; // 60-100 bpm
    const newSteps = Math.floor(Math.random()*(12000-3000+1))+3000; // 3k-12k steps
    const newSleep = (Math.random()*(9-4)+4).toFixed(1); // 4-9 hours

    demoChart.data.datasets[0].data.shift(); demoChart.data.datasets[0].data.push(newHeart);
    demoChart.data.datasets[1].data.shift(); demoChart.data.datasets[1].data.push(newSteps);
    demoChart.data.datasets[2].data.shift(); demoChart.data.datasets[2].data.push(newSleep);
    demoChart.update();

    // Update stats panel
    document.getElementById('demoHeart').textContent = `${newHeart} bpm`;
    document.getElementById('demoSteps').textContent = newSteps;
    document.getElementById('demoSleep').textContent = `${newSleep}h`;
  });

  document.getElementById('resetDemo').addEventListener('click', ()=> {
    demoChart.data.datasets[0].data=[76,72,80,78,75,74];
    demoChart.data.datasets[1].data=[5000,6500,7000,7500,8200,9000];
    demoChart.data.datasets[2].data=[0,0,2,1.5,2,0.5];
    demoChart.update();

    document.getElementById('demoHeart').textContent = '76 bpm';
    document.getElementById('demoSteps').textContent = '8500';
    document.getElementById('demoSleep').textContent = '6.8h';
  });

  // --- Contact Form ---
  document.getElementById('sendMsg').addEventListener('click', ()=>{
    const email=document.querySelector('#contact input').value;
    const msg=document.querySelector('#contact textarea').value;
    if(!email||!msg){ alert('Please fill out email and message'); return; }
    alert('Thanks! Your message has been sent (demo).');
    document.querySelector('#contact input').value='';
    document.querySelector('#contact textarea').value='';
  });

  // --- Chatbot / Pulse AI ---
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatInput = document.getElementById('chatInput');
  const sendChat = document.getElementById('sendChat');

  chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('open');
    chatbotToggle.textContent = chatbotWindow.classList.contains('open') ? '✖' : '💬';
    if (chatbotWindow.classList.contains('open')) scrollToBottom();
  });

  function addMessage(text, sender){
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = text; // allow bold & bullets
    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }

  function scrollToBottom(){
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function getBotResponse(userMessage){
    const msg = userMessage.toLowerCase().trim();
    const tips = [
      {text: "**Hydration:** Drink at least 8 glasses of water today."},
      {text: "**Steps:** Aim for 10,000 steps to maintain an active lifestyle."},
      {text: "**Sleep:** Target 7-8 hours of quality sleep for recovery."},
      {text: "**Heart Rate:** Check your resting heart rate; 60–100 bpm is healthy."},
      {text: "**Calories:** Balance intake with daily burn for your goals."},
      {text: "**Recovery:** Low HRV? Consider light activity and rest."},
      {text: "**Activity:** Short walks or stretching improve circulation."}
    ];

    // Emergency
    if(msg.includes('chest pain') || msg.includes('fainting') || msg.includes('shortness of breath'))
      return "⚠️ I am an AI, not a doctor. Call emergency services immediately if you are experiencing serious symptoms!";

    // Symptom disclaimer
    if(msg.includes('pain') || msg.includes('symptom') || msg.includes('sick'))
      return "⚠️ I am an AI, not a doctor. This is an analysis of your data trends, not a medical diagnosis. Please consult a professional for medical concerns.";

    // Greetings
    if(msg.includes('hello') || msg.includes('hi')) 
      return "Hi! I'm <b>Pulse</b>, your AI Health Companion. I can help analyze your heart rate, sleep, steps, and calories. What would you like to check today?";

    // Features
    if(msg.includes('feature') || msg.includes('do'))
      return "I can help you track and analyze:<br>- Heart Rate & HRV<br>- Sleep Cycles (REM, Deep, Light)<br>- Steps & Activity<br>- Calories Burned<br>- Personalized actionable tips based on trends.";

    // Demo
    if(msg.includes('demo') || msg.includes('live'))
      return "The live demo simulates real-time data:<br>- Heart Rate<br>- Steps<br>- Sleep<br>Click 'Add Data' to see trends and insights!";

    // Contact
    if(msg.includes('contact') || msg.includes('email'))
      return "You can reach out via the contact form at the bottom of the page for further questions or support.";

    // Price
    if(msg.includes('price') || msg.includes('cost'))
      return "We offer a free basic tier and a premium subscription with advanced AI insights for $4.99/month.";

    // Thanks
    if(msg.includes('thank'))
      return "You're welcome! I'm here to help you stay on top of your health goals.";

    // AI Tips / Advice
    if(msg.includes('tip') || msg.includes('advice') || msg.includes('help')){
      const randomTip = tips[Math.floor(Math.random()*tips.length)];
      return `✅ <b>Pulse Tip:</b> ${randomTip.text}`;
    }

    // Default fallback
    return "I'm <b>Pulse</b>, your AI Health Companion. I provide insights and tips about your heart rate, sleep, steps, calories, and more. Try asking for a 'tip', 'advice', or check your 'demo' data!";
  }

  function handleSendMessage(){
    const userText = chatInput.value.trim();
    if(userText==='') return;
    addMessage(userText,'user');
    setTimeout(()=>{
      const botResponse = getBotResponse(userText);
      addMessage(botResponse,'bot');
    },500);
    chatInput.value='';
  }

  sendChat.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') handleSendMessage(); });

});


