// JavaScript for navigation buttons and media display
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the main media, thumbnails, and navigation buttons
    const mainMedia = document.querySelector('.main-media');
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    // Define an array of media sources (images, videos, or 3D viewers)
    const mediaSources = [
        '../Image/Jester_Setting.jpg',    // Replace with actual media sources
        '../3D_Viewer.html',
        '../Video/DumboVideo.mp4',
        '../Image/JesterAngleCamera.jpg',
        '../Image/JesterFrontCamera.jpg',
        '../Image/JesterSideCamera.jpg',
        '../Image/JesterBackCamera.jpg',
    ];

    let currentIndex = 0;

    // Function to display media based on index
    function showMedia(index) {
        mainMedia.innerHTML = ''; // Clear previous content

        const mediaPath = mediaSources[index];

        if (mediaPath.endsWith('.jpg') || mediaPath.endsWith('.png')) {
            // Display image
            const img = document.createElement('img');
            img.src = mediaPath;
            img.alt = 'Full Image';
            mainMedia.appendChild(img);
        } else if (mediaPath.endsWith('.mp4')) {
            // Display video
            const video = document.createElement('video');
            video.src = mediaPath;
            video.controls = true;
            mainMedia.appendChild(video);
        } else if (mediaPath.endsWith('.html')) {
            // Display 3D viewer (HTML file)
            const iframe = document.createElement('iframe');
            iframe.src = mediaPath;
            mainMedia.appendChild(iframe);
        }

        // Update the current thumbnail index
        currentIndex = index;
        
        // Highlight the selected thumbnail
        thumbnailItems.forEach((item) => {
            item.style.borderColor = '#ccc';
        });
        thumbnailItems[currentIndex].style.borderColor = '#007BFF';
    }

    // Add click event listeners to thumbnails
    thumbnailItems.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            showMedia(index);
        });
    });

    // Event listeners for previous and next buttons
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + mediaSources.length) % mediaSources.length;
        showMedia(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % mediaSources.length;
        showMedia(currentIndex);
    });

    // Initial display of media
    showMedia(currentIndex);
});
