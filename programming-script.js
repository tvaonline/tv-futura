document.addEventListener('DOMContentLoaded', function() {
    function getCurrentProgram() {
        // Simulação de obtenção de programação ao vivo
        const currentProgram = "Jornal da Gazeta";
        document.getElementById('currentProgram').textContent = currentProgram;
    }

    getCurrentProgram();
    // Se necessário, atualize a programação regularmente
    setInterval(getCurrentProgram, 60000); // Atualiza a cada minuto
});