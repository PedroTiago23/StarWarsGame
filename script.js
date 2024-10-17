// Declaração de variáveis
let move_speed = 5, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let background_music = new Audio('/audio/music.mp3');

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let maxScore = 5; // Pontuação máxima
let gate_generated = false; // Flag para saber se o "gate" final foi gerado
let last_pipe_x = 0; // Para armazenar a posição do último cano gerado

img.style.display = 'none';
message.classList.add('messageStyle');

// Variáveis para armazenar propriedades do pássaro e do fundo
let bird_props, background_props;
let bird_dy = 0; // Velocidade vertical do pássaro

document.addEventListener('keydown', handleKeyDown);
function handleKeyDown(e) {
    if (e.key == 'Enter' && game_state != 'Play') {
        resetGame();
    } else if (e.key == 'ArrowUp' || e.key == ' ') {
        img.src = 'images/Bird-2.png';
        bird_dy = -7.6; // Impulso do pássaro
    }
}

document.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowUp' || e.key == ' ') {
        img.src = 'images/Bird-1.png';
    }
});

function resetGame() {
    document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
    img.style.display = 'block';
    bird.style.top = '40vh';
    bird_dy = 0; // Reinicia a velocidade do pássaro
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Pontos: ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
}

function play() {
    background_music.play()
    let pipe_separation = 0;
    let pipe_gap = 35; // Distância normal entre canos

    function update() {
        if (game_state !== 'Play') return;

        bird_props = bird.getBoundingClientRect();
        background_props = document.querySelector('.background').getBoundingClientRect();

        // Aplicar gravidade
        bird_dy += gravity;
        bird.style.top = Math.min(bird_props.top + bird_dy, background_props.bottom - bird_props.height) + 'px';

        // Checar limites do pássaro
        if (bird_props.top <= 0 || bird_props.bottom >= background_props.bottom) {
            endGame('Game Over<br>Pressione enter para recomeçar', 'red');
            return;
        }

        // Atualiza os canos
        updatePipes();

        requestAnimationFrame(update);
    }

    function updatePipes() {
        let pipe_sprites = document.querySelectorAll('.pipe_sprite');
        pipe_sprites.forEach((element) => {
            let pipe_props = element.getBoundingClientRect();

            // Verifica se o jogador colidiu com os canos
            if (checkCollision(bird_props, pipe_props)) {
                endGame('Game Over<br>Pressione enter para recomeçar', 'red');
                return;
            }

            // Atualiza a posição dos canos
            if (pipe_props.right <= 0) {
                element.remove();
            } else {
                element.style.left = pipe_props.left - move_speed + 'px';

                // Verifica se o jogador passou pelos canos para aumentar a pontuação
                if (pipe_props.right < bird_props.left && pipe_props.right + move_speed >= bird_props.left && element.increase_score == '1') {
                    score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                    element.increase_score = '0';

                    // Verifica se atingiu o maxScore e cria o "gate"
                    if (parseInt(score_val.innerHTML) == maxScore && !gate_generated) {
                        gate_generated = true;
                        createGate();
                    }
                }
            }
        });

        // Gera novos canos
        if (pipe_separation > 115 && parseInt(score_val.innerHTML) < maxScore) {
            pipe_separation = 0;
            createPipes();
        }
        pipe_separation++;
    }

    function createPipes() {
        let pipe_posi = Math.floor(Math.random() * 43) + 8;

        let pipe_sprite_top = document.createElement('div');
        pipe_sprite_top.className = 'pipe_sprite';
        pipe_sprite_top.style.top = pipe_posi - 70 + 'vh';
        pipe_sprite_top.style.left = '100vw';
        document.body.appendChild(pipe_sprite_top);

        let pipe_sprite_bottom = document.createElement('div');
        pipe_sprite_bottom.className = 'pipe_sprite';
        pipe_sprite_bottom.style.top = pipe_posi + pipe_gap + 'vh';
        pipe_sprite_bottom.style.left = '100vw';
        pipe_sprite_bottom.increase_score = '1'; // Aumenta a pontuação
        document.body.appendChild(pipe_sprite_bottom);

        last_pipe_x = parseInt(pipe_sprite_bottom.style.left); // Armazena a posição do último cano
    }

    function createGate() {
        let gate = document.createElement('div');
        gate.className = 'pipe_sprite';
        gate.style.top = '30vh'; // Posição do "gate"
        gate.style.left = (parseFloat(last_pipe_x) + 1200) + 'px'; // Distância maior entre o último cano e o "gate"
        gate.increase_score = '0'; // Não contar pontos para o "gate"

        document.body.appendChild(gate);

        // Verifica se o jogador passou pelo "gate"
        checkGate(gate);
    }

    function checkGate(gate) {
        function check() {
            if (game_state !== 'Play') return;

            let gate_props = gate.getBoundingClientRect();
            if (gate_props.right < bird_props.left) {
                endGame('Parabéns! Você conseguiu!<br>', 'green', true);
            } else {
                requestAnimationFrame(check);
            }
        }
        requestAnimationFrame(check);
    }

    function checkCollision(bird_props, pipe_props) {
        return bird_props.left < pipe_props.left + pipe_props.width &&
            bird_props.right > pipe_props.left &&
            bird_props.top < pipe_props.top + pipe_props.height &&
            bird_props.bottom > pipe_props.top;
    }

    function endGame(messageText, color, showButton = false) {
        background_music.pause()
        game_state = 'End';
        gate_generated = false;
        message.innerHTML = messageText.fontcolor(color);
        message.classList.add('messageStyle');
        img.style.display = 'none';

        if (showButton) {
            let button = document.createElement('button');
            button.innerText = 'Sua recompensa';
            button.style.fontSize = "24px" 
            button.onclick = nextPage;
            message.appendChild(button);
        }
    }

    requestAnimationFrame(update);
}

function nextPage() {
    window.location.href = "telafinal.html" ; // Redireciona para a próxima página
}
