document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.channel-link');
    const video = document.getElementById('videoPlayer');
    const player = new Plyr(video);

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const url = this.href;
            loadM3U8(url);
        });
    });

    function loadM3U8(url) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
            hls.on(Hls.Events.ERROR, function(event, data) {
                console.error('Hls.js error:', data);
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
        } else {
            alert('Your browser does not support HLS.');
        }
    }
});