const menuItems = document.querySelectorAll('.menu-item');
const soundIcon = document.getElementById('sound-icon');
const soundImg = document.getElementById('sound-img');
const gameMusic = document.getElementById('game-music');

menuItems.forEach(item => {
    item.addEventListener('click', (event) => {
        if (item.id !== 'novo-jogo') {
            item.style.display = 'none'; // Esconde o item ao ser clicado
        }
    });
});

// Toca a música do jogo ao iniciar a página
window.onload = function() {
    gameMusic.play();
};

function toggleSound() {
    if (gameMusic.paused) {
        gameMusic.play();
        soundImg.src = 'images/com-som.png'; 
    } else {
        gameMusic.pause();
        soundImg.src = 'images/sem-som.png'; 
    }
}
