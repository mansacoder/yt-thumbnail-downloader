document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const urlInput = document.querySelector('.url-input');
    const submitBtn = document.querySelector('.submit-btn');
    const loadingElement = document.querySelector('.loading');
    const errorElement = document.querySelector('.error');
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    const themeToggle = document.querySelector('.theme-toggle');
    const instructionModal = document.getElementById('instructionModal');
    const closeModal = document.getElementById('closeModal');
    const filenameDisplay = document.getElementById('filenameDisplay');

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.textContent = isDarkMode ? '🌞' : '🌓';
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '🌞';
    }

    // Extract YouTube video ID from URL
    function getVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Generate thumbnail URLs (only first 3 qualities)
    function generateThumbnailUrls(videoId) {
        return [
            {
                quality: 'Maximum Resolution',
                resolution: '1280x720',
                url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            },
            {
                quality: 'High Quality',
                resolution: '480x360',
                url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            },
            {
                quality: 'Medium Quality',
                resolution: '320x180',
                url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
            }
        ];
    }

    // Download image with fallback instructions
    function downloadImage(url, filename) {
        // First try the direct approach
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.target = '_blank';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        
        // If the direct approach fails, show instructions
        setTimeout(() => {
            showSaveInstructions(filename);
        }, 1000);
    }

    // Show save instructions modal
    function showSaveInstructions(filename) {
        filenameDisplay.textContent = filename;
        instructionModal.classList.add('active');
        
        // Also show the filename in the modal
        const filenameElement = document.createElement('p');
        filenameElement.style.marginTop = '1rem';
        filenameElement.style.fontWeight = 'bold';
        filenameElement.textContent = `Recommended filename: ${filename}`;
    }

    // Close modal
    closeModal.addEventListener('click', () => {
        instructionModal.classList.remove('active');
    });

    // Create thumbnail card
    function createThumbnailCard(thumbnail) {
        const card = document.createElement('div');
        card.className = 'thumbnail-card';
        
        const img = document.createElement('img');
        img.src = thumbnail.url;
        img.alt = `YouTube thumbnail ${thumbnail.quality}`;
        img.className = 'thumbnail-img';
        img.loading = 'lazy';
        
        // Add right-click context menu
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            filenameDisplay.textContent = `youtube-thumbnail-${thumbnail.quality.toLowerCase().replace(' ', '-')}.jpg`;
            instructionModal.classList.add('active');
        });
        
        const info = document.createElement('div');
        info.className = 'thumbnail-info';
        
        const quality = document.createElement('h3');
        quality.className = 'thumbnail-quality';
        quality.textContent = thumbnail.quality;
        
        const resolution = document.createElement('p');
        resolution.className = 'thumbnail-resolution';
        resolution.textContent = `Resolution: ${thumbnail.resolution}`;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'Download';
        
        const filename = `youtube-thumbnail-${thumbnail.quality.toLowerCase().replace(' ', '-')}.jpg`;
        
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadImage(thumbnail.url, filename);
        });
        
        info.appendChild(quality);
        info.appendChild(resolution);
        info.appendChild(downloadBtn);
        
        card.appendChild(img);
        card.appendChild(info);
        
        return card;
    }

    // Handle form submission
    submitBtn.addEventListener('click', () => {
        const videoUrl = urlInput.value.trim();
        const videoId = getVideoId(videoUrl);

        // Clear previous results and errors
        thumbnailsContainer.innerHTML = '';
        errorElement.style.display = 'none';

        if (!videoId) {
            errorElement.style.display = 'block';
            return;
        }

        // Show loading state
        loadingElement.style.display = 'block';
        submitBtn.disabled = true;

        // Simulate network delay (remove in production)
        setTimeout(() => {
            const thumbnails = generateThumbnailUrls(videoId);
            
            // Create and append thumbnail cards
            thumbnails.forEach(thumbnail => {
                const card = createThumbnailCard(thumbnail);
                thumbnailsContainer.appendChild(card);
            });

            // Hide loading state
            loadingElement.style.display = 'none';
            submitBtn.disabled = false;
        }, 800);
    });

    // Allow submission with Enter key
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
});