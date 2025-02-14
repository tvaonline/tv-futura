document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('videoPlayer');
    const player = new Plyr(video);

    const channels = {
        "SBT": {
            url: "https://tv.unisc.br/hls/test.m3u8",
            name: "SBT",
            logo: "https://example.com/sbt_logo.png", // Substitua pelo URL do logo do SBT
            location: "Rua Carlos Cyrillo Jr, 92 - Vila Guilherme, São Paulo - SP, 02079-000, Brasil",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.4795672212055!2d-46.65130688502233!3d-23.56437298467964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c9e7a4c1f1%3A0x9eebd4a9a5b3a97a!2sRua%20Carlos%20Cyrillo%20Jr%2C%2092%20-%20Vila%20Guilherme%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002079-000%2C%20Brasil!5e0!3m2!1spt-BR!2sus!4v1615727972905!5m2!1spt-BR!2sus",
            currentProgram: "Programa do Ratinho"
        },
        "TV Gazeta": {
            url: "https://tv.unisc.br/hls/test.m3u8",
            name: "TV Gazeta",
            logo: "https://kub.sh/444bd2",
            location: "Avenida Paulista, 900 - Bela Vista, São Paulo - SP, 01310-100, Brasil",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.4795672212055!2d-46.65130688502233!3d-23.56437298467964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c9e7a4c1f1%3A0x9eebd4a9a5b3a97a!2sAvenida%20Paulista%2C%20900%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100%2C%20Brasil!5e0!3m2!1spt-BR!2sus!4v1615727972905!5m2!1spt-BR!2sus",
            currentProgram: "Jornal da Gazeta"
        }
    };

    function loadChannel(channelName) {
        const channel = channels[channelName];
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
    }

    // Carregar o canal inicial (TV Gazeta)
    loadChannel("TV Gazeta");

    // Exemplo: Trocar para o canal SBT
    // loadChannel("SBT");
	
	
});