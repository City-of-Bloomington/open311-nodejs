export default function() {
  let deferredPrompt;
  const addBtn = document.querySelector('.a2hs-button');

  console.log(addBtn);

  addBtn.style.display = 'none';

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt');
    e.preventDefault();
    
    deferredPrompt = e;
    
    addBtn.style.display = 'block';

    addBtn.addEventListener('click', (e) => {
      
      addBtn.style.display = 'none';
      
      deferredPrompt.prompt();
      
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Accepted the A2HS prompt.');
        } else {
          console.log('Dismissed the A2HS prompt.');
        }
        deferredPrompt = null;
      });
    });
  });
}