document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('videoPlayer');
    const player = new Plyr(video);

    function loadChannel(channelName) {
        fetch('channels.json')
            .then(response => response.json())
            .then(data => {
                const channel = data.channels[channelName];
                if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(channel.url);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, function() {
                        video.play();
                    });
                    hls.on(Hls.Events.ERROR, function(event, data) {
                        console.error('Hls.js error:', data);
                        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                            console.warn('Network error occurred, retrying...');
                            hls.startLoad();
                        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                            console.warn('Media error occurred, trying to recover...');
                            hls.recoverMediaError();
                        } else {
                            console.error('Unrecoverable error occurred, destroying Hls instance...');
                            hls.destroy();
                        }
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = channel.url;
                    video.addEventListener('loadedmetadata', function() {
                        player.play();
                    });
                } else {
                    alert('Seu navegador não suporta HLS.');
                }

                // Atualizar informações do canal
                document.getElementById('channelName').textContent = channel.name;
                document.getElementById('channelLogo').src = channel.logo;
                document.getElementById('channelLocation').textContent = `Endereço: ${channel.location}`;
                document.getElementById('channelMap').src = channel.mapUrl;
                document.getElementById('currentProgram').textContent = channel.currentProgram;

                // Carregar notícias
                loadNews(channelName);
            })
            .catch(error => {
                console.error('Erro ao carregar o canal:', error);
            });
    }

    function loadNews(channelName) {
        fetch('news.json')
            .then(response => response.json())
            .then(data => {
                const newsList = data.news[channelName] || [];
                const newsContent = document.getElementById('newsContent');
                newsContent.innerHTML = newsList.map(news => `<p>${news}</p>`).join('');
            })
            .catch(error => {
                console.error('Erro ao carregar as notícias:', error);
            });
    }

    // Obter o nome do canal a partir da URL (ex: ?channel=SBT)
    const urlParams = new URLSearchParams(window.location.search);
    const channelName = urlParams.get('channel') || 'TV Gazeta';

    // Carregar o canal inicial
    loadChannel(channelName);
});