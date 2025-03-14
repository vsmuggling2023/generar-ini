document.addEventListener('DOMContentLoaded', function() {
    const bpmInput = document.getElementById('bpm');
    const startStopButton = document.getElementById('startStopButton');
    const timeSignatureSelect = document.getElementById('timeSignature');
    const metronomeArm = document.getElementById('metronomeArm');

    let isRunning = false;
    let interval;
    let beatCount = 0;

    const pulseSound = new Audio('sonidos/pulso.wav'); // Cambia 'pulse.wav' por la ruta de tu archivo de pulso
    const accentSound = new Audio('sonidos/acento.wav'); // Cambia 'accent.wav' por la ruta de tu archivo de acento

    function playBeat() {
        const timeSignature = timeSignatureSelect.value;
        const [beatsPerMeasure, noteValue] = timeSignature.split('/').map(Number);

        // Reproduce el acento en el primer tiempo del compás
        if (beatCount % beatsPerMeasure === 0) {
            accentSound.currentTime = 0;
            accentSound.play();
        } else {
            pulseSound.currentTime = 0;
            pulseSound.play();
        }

        beatCount++;
    }

    function startMetronome() {
        if (isRunning) return;

        isRunning = true;
        startStopButton.textContent = 'Detener';
        metronomeArm.classList.add('active'); // Activa la animación del brazo

        const bpm = parseInt(bpmInput.value);
        const timeSignature = timeSignatureSelect.value;
        const [beatsPerMeasure, noteValue] = timeSignature.split('/').map(Number);

        // Ajusta el intervalo según el valor de la nota (4 = negra, 8 = corchea)
        const baseNoteValue = 4; // La negra es la referencia (1/4)
        const intervalTime = (60 / bpm) * (baseNoteValue / noteValue) * 1000;

        // Ajusta la duración de la animación del brazo
        const animationDuration = (intervalTime / 1000) * 2 + 's'; // Duración en segundos
        metronomeArm.style.animationDuration = animationDuration;

        interval = setInterval(playBeat, intervalTime);
    }

    function stopMetronome() {
        if (!isRunning) return;

        isRunning = false;
        startStopButton.textContent = 'Iniciar';
        metronomeArm.classList.remove('active'); // Detiene la animación del brazo
        clearInterval(interval);
        beatCount = 0;
    }

    startStopButton.addEventListener('click', function() {
        if (isRunning) {
            stopMetronome();
        } else {
            startMetronome();
        }
    });

    bpmInput.addEventListener('input', function() {
        if (isRunning) {
            stopMetronome();
            startMetronome();
        }
    });

    timeSignatureSelect.addEventListener('change', function() {
        if (isRunning) {
            stopMetronome();
            startMetronome();
        }
    });
});