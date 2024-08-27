function updateProgressBar() {
    const progressBarInner = document.querySelector('.progress-bar-inner');
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    progressBarInner.style.height = `${scrollPercent}%`;
}

// Update progress bar on scroll
window.addEventListener('scroll', updateProgressBar);

// Initial update in case the page is loaded with a scroll
updateProgressBar();