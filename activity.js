document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const imageOff = document.getElementById('img_off');
    const imageOn = document.getElementById('img_on');
    const redButton = document.getElementById('redButton');

    // Path to the sound, relative to index.html
    const SOUND_SRC = 'audio/redbutton.mp3';

    const states = {
        off: {
            src: 'images/off.png',
            alt: 'Dark room, monitor off'
        },
        on: {
            src: 'images/on.png',
            alt: 'Dark room, the monitor shows a grinning figure and blood on the wall'
        }
    };

    // Preload and decode both images so the first switch is instant
    Object.values(states).forEach(({ src }) => {
        const img = new Image();
        img.src = src;
        if (img.decode) img.decode().catch(() => {});
    });

    // Preload the sound so it plays with no delay on click
    const redButtonSound = new Audio(SOUND_SRC);
    redButtonSound.preload = 'auto';

    function playSound() {
        redButtonSound.currentTime = 0;   // restart from the beginning every time
        const playback = redButtonSound.play();
        // Some browsers reject play() (e.g. missing file); fail silently so the toggle never breaks
        if (playback && typeof playback.catch === 'function') {
            playback.catch(() => {});
        }
    }

    function stopSound() {
        redButtonSound.pause();
        redButtonSound.currentTime = 0;
    }

    function render(isOn) {
        body.classList.toggle('on', isOn);

        // Only the visible image gets a description
        imageOff.alt = isOn ? '' : states.off.alt;
        imageOff.setAttribute('aria-hidden', String(isOn));
        imageOn.alt = isOn ? states.on.alt : '';
        imageOn.setAttribute('aria-hidden', String(!isOn));

        redButton.setAttribute('aria-pressed', String(isOn));
    }

    function toggle() {
        const turningOn = !body.classList.contains('on');

        // Enables the power-off animations (they must not run on page load)
        body.classList.add('has-toggled');
        render(turningOn);

        // Sound plays only when on.png shows up; turning OFF cuts it short
        if (turningOn) {
            playSound();
        } else {
            stopSound();
        }
    }

    // <button> already handles Enter and Space, so no extra key code is needed
    redButton.addEventListener('click', toggle);

    // Always start OFF
    render(false);
});