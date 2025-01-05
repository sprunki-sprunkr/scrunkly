// Check if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if device is in portrait mode
const isPortrait = () => {
  return window.innerHeight > window.innerWidth;
};

// Check if document is in fullscreen
const isInFullscreen = () => {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || 
    document.mozFullScreenElement || document.msFullscreenElement);
};

// Enter fullscreen mode
export const enterFullscreen = async (container, iframe, fullscreenBtn, exitFullscreenBtn) => {
  // Store original styles
  container.dataset.originalPosition = container.style.position || '';
  container.dataset.originalWidth = container.style.width || '';
  container.dataset.originalHeight = container.style.height || '';
  
  // Add transition class
  container.classList.add('transition-all', 'duration-300', 'ease-in-out');
  iframe.classList.add('transition-all', 'duration-300', 'ease-in-out');
  
  if (isMobile()) {
    try {
      // Request screen orientation lock to landscape
      await screen.orientation.lock('landscape');
    } catch (err) {
      console.log('Screen orientation lock failed:', err);
    }
    
    // Hide scrollbars and set body background
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.background = '#000';
    
    // Only hide specific elements
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const asides = container.parentElement.querySelectorAll('aside');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    asides.forEach(aside => aside.style.display = 'none');
    
    // Mobile fullscreen setup
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.bottom = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '9999';
    container.style.backgroundColor = '#000';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    // Force landscape mode
    if (isPortrait()) {
      // 在竖屏模式下
      container.style.transform = 'rotate(90deg)';
      container.style.transformOrigin = 'left top';
      container.style.width = '100vh';
      container.style.height = '100vw';
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '100%';
      
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.maxWidth = '100%';
      iframe.style.maxHeight = '100%';
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.transform = 'none';
    } else {
      // 在横屏模式下
      container.style.transform = 'none';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.maxWidth = '100%';
      iframe.style.maxHeight = '100%';
      iframe.style.position = 'relative';
      iframe.style.transform = 'none';
    }
    
  } else {
    // Desktop fullscreen
    try {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        await container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        await container.msRequestFullscreen();
      }
      
      container.style.backgroundColor = '#000';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.maxWidth = 'none';
      iframe.style.maxHeight = 'none';
    } catch (err) {
      console.log('Fullscreen request failed:', err);
    }
  }

  // Show exit button, hide enter button with transition
  fullscreenBtn.classList.add('transition-opacity', 'duration-300');
  exitFullscreenBtn.classList.add('transition-opacity', 'duration-300');
  
  fullscreenBtn.style.opacity = '0';
  setTimeout(() => {
    fullscreenBtn.style.display = 'none';
    exitFullscreenBtn.style.display = 'flex';
    setTimeout(() => {
      exitFullscreenBtn.style.opacity = '1';
    }, 50);
  }, 300);
};

// Exit fullscreen mode
export const exitFullscreen = async (container, iframe, fullscreenBtn, exitFullscreenBtn) => {
  if (isMobile()) {
    try {
      // Unlock screen orientation
      await screen.orientation.unlock();
    } catch (err) {
      console.log('Screen orientation unlock failed:', err);
    }
    
    // Restore scrollbars and background
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.background = '';
    
    // Show previously hidden elements
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const asides = container.parentElement.querySelectorAll('aside');
    
    if (header) header.style.display = '';
    if (footer) footer.style.display = '';
    asides.forEach(aside => aside.style.display = '');
    
    // Reset container to original state with transition
    Object.assign(container.style, {
      position: container.dataset.originalPosition,
      width: container.dataset.originalWidth,
      height: container.dataset.originalHeight,
      top: '',
      left: '',
      right: '',
      bottom: '',
      zIndex: '',
      backgroundColor: '',
      margin: '',
      padding: '',
      transform: '',
      transformOrigin: '',
      display: '',
      alignItems: '',
      justifyContent: ''
    });
    
    // Reset iframe styles with transition
    Object.assign(iframe.style, {
      width: '100%',
      height: 'auto',
      transform: '',
      position: '',
      top: '',
      left: '',
      maxWidth: '',
      maxHeight: '',
      transformOrigin: '',
      aspectRatio: '4/3'
    });
    
  } else {
    // Exit desktop fullscreen
    try {
      if (isInFullscreen()) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.log('Exit fullscreen failed:', err);
    } finally {
      // Reset styles regardless of fullscreen exit success
      Object.assign(container.style, {
        backgroundColor: '',
        display: '',
        alignItems: '',
        justifyContent: ''
      });
      
      Object.assign(iframe.style, {
        width: '100%',
        height: 'auto',
        maxWidth: '',
        maxHeight: '',
        aspectRatio: '4/3'
      });
    }
  }

  // Hide exit button, show enter button with transition
  exitFullscreenBtn.style.opacity = '0';
  setTimeout(() => {
    exitFullscreenBtn.style.display = 'none';
    fullscreenBtn.style.display = 'flex';
    setTimeout(() => {
      fullscreenBtn.style.opacity = '1';
    }, 50);
  }, 300);

  // Remove transition classes after animation
  setTimeout(() => {
    container.classList.remove('transition-all', 'duration-300', 'ease-in-out');
    iframe.classList.remove('transition-all', 'duration-300', 'ease-in-out');
  }, 300);
};

// Handle fullscreen change event
export const handleFullscreenChange = (container, iframe, fullscreenBtn, exitFullscreenBtn) => {
  // Only handle desktop fullscreen changes
  if (!isMobile() && !isInFullscreen()) {
    try {
      document.getElementById('iframeBar').classList.remove('hidden')
      exitFullscreen(container, iframe, fullscreenBtn, exitFullscreenBtn);
    } catch (err) {
      console.log('Fullscreen change handler error:', err);
      // Ensure buttons are in correct state even if error occurs
      fullscreenBtn.style.display = 'flex';
      fullscreenBtn.style.opacity = '1';
      exitFullscreenBtn.style.display = 'none';
      exitFullscreenBtn.style.opacity = '0';
    }
  }
};
