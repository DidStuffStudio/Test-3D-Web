// Get references to the main media element, thumbnails, and Three.js container
const mainMedia = document.getElementById('mainMedia');
const thumbnailItems = document.querySelectorAll('.thumbnail-item');
const threejsContainer = document.getElementById('threejs-container');

// Function to update the main media (image, video, or Three.js viewer)
function updateMainMedia(src, type) {
    mainMedia.innerHTML = ''; // Clear the main media container

    if (type === 'image') {
        const mediaElement = document.createElement('img');
        mediaElement.src = src;
        mainMedia.appendChild(mediaElement);
    } else if (type === 'video') {
        const mediaElement = document.createElement('video');
        mediaElement.src = src;
        mediaElement.controls = true; // Add controls for videos
        mainMedia.appendChild(mediaElement);
    } else if (type === 'threejs') {
        // You can create your Three.js scene and render it here
        // For simplicity, here's a placeholder message
        const messageElement = document.createElement('p');
        messageElement.textContent = 'Three.js Viewer Placeholder';
        mainMedia.appendChild(messageElement);
    }
}

// Add click event listeners to thumbnails
thumbnailItems.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
        const thumbnailImg = thumbnail.querySelector('img');
        const thumbnailVideo = thumbnail.querySelector('video');

        // Determine the media type (image, video, or Three.js)
        let mediaType = 'image';
        if (thumbnailImg) {
            mediaType = 'image';
            updateMainMedia(thumbnailImg.src, 'image');
        } else if (thumbnailVideo) {
            mediaType = 'video';
            updateMainMedia(thumbnailVideo.src, 'video');
        } else {
            mediaType = 'threejs';
            updateMainMedia('', 'threejs'); // Clear the main media container for Three.js
        }

        // Remove any previous highlight from thumbnails
        thumbnailItems.forEach((item) => {
            item.style.borderColor = '#ccc';
        });

        // Highlight the selected thumbnail
        thumbnail.style.borderColor = '#007BFF';
    });
});

// Set the initial main media source to the first thumbnail
if (thumbnailItems.length > 0) {
    const firstThumbnail = thumbnailItems[0];
    const firstThumbnailImg = firstThumbnail.querySelector('img');
    const firstThumbnailVideo = firstThumbnail.querySelector('video');

    if (firstThumbnailImg) {
        updateMainMedia(firstThumbnailImg.src, 'image');
    } else if (firstThumbnailVideo) {
        updateMainMedia(firstThumbnailVideo.src, 'video');
    } else {
        updateMainMedia('', 'threejs'); // Clear the main media container for Three.js
    }

    firstThumbnail.style.borderColor = '#007BFF';
}
