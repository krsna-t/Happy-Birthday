document.addEventListener('DOMContentLoaded', () => {
    const birthdayHeading = document.querySelector('.birthday-heading');
    const giftBoxContainer = document.querySelector('.gift-box-container');
    const giftBox = document.querySelector('.gift-box');
    const cakeScene = document.querySelector('.cake-scene');
    const candleFlame = document.querySelector('.candle .flame');
    const matchstick = document.querySelector('.matchstick');
    const matchFlame = document.querySelector('.match-flame');
    const countdownElement = document.querySelector('.countdown');
    const timerSpan = document.getElementById('timer');
    const confettiContainer = document.querySelector('.confetti-container');
    const birthdayMusic = document.getElementById('birthdayMusic');

    // Ensure music loops forever
    if (birthdayMusic) birthdayMusic.loop = true;

    console.log("DOM Content Loaded. Initializing birthday surprise script.");

    // Initial setup - hide scenes
    cakeScene.classList.add('hidden-element');
    matchstick.classList.add('hidden-element');
    matchFlame.classList.add('hidden-element');
    countdownElement.classList.add('hidden-element');
    confettiContainer.classList.add('hidden-element');
    giftBoxContainer.querySelector('.click-instruction').style.opacity = '1';

    birthdayHeading.style.animationPlayState = 'running';

    if (giftBox) {
        giftBox.addEventListener('click', () => {
            console.log("Gift box clicked!");

            // Hide birthday heading
            birthdayHeading.style.opacity = '0';
            setTimeout(() => {
                birthdayHeading.style.display = 'none';
            }, 600);

            // Start muted music (required to allow unmuting later on iOS)
            if (birthdayMusic) {
                birthdayMusic.muted = true;
                birthdayMusic.play().catch(e => console.error("Muted music play error:", e));
            }

            // Animate gift box fade
            giftBox.style.opacity = '0';
            giftBox.style.transform = 'scale(0)';
            giftBoxContainer.querySelector('.click-instruction').style.opacity = '0';

            setTimeout(() => {
                giftBoxContainer.classList.add('hidden-element');
                console.log("Gift box faded out, revealing cake scene.");

                cakeScene.classList.remove('hidden-element');
                cakeScene.classList.add('visible');

                setTimeout(startMatchstickAnimation, 800);
            }, 600);
        });
    } else {
        console.error("Error: Gift box element not found!");
    }

    function startMatchstickAnimation() {
        console.log("Starting matchstick animation.");
        matchstick.classList.remove('hidden-element');
        matchstick.classList.add('slide-in');

        setTimeout(() => {
            matchstick.classList.add('strike');
            setTimeout(() => {
                matchFlame.classList.remove('hidden-element');
                matchFlame.classList.add('lit');
                lightCandle();
            }, 300);
        }, 1000);
    }

    function lightCandle() {
        console.log("Lighting candle.");
        candleFlame.classList.add('lit');

        setTimeout(() => {
            matchFlame.classList.add('hidden-element');
            matchstick.classList.add('hidden-element');

            matchstick.classList.remove('slide-in', 'strike');
            matchstick.style.opacity = '';
            matchstick.style.transform = '';

            startCountdown();
        }, 400);
    }

    function startCountdown() {
        console.log("Starting countdown.");
        countdownElement.classList.remove('hidden-element');
        let timeLeft = 5;
        timerSpan.textContent = timeLeft;

        const countdownInterval = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownElement.classList.add('hidden-element');
                candleFlame.classList.remove('lit');

                setTimeout(() => {
                    // Show "Happy Birthday!" text
                    birthdayHeading.textContent = "Happy Birthday!";
                    birthdayHeading.style.display = 'block';
                    birthdayHeading.style.opacity = '1';

                    // Start music (unmuted)
                    if (birthdayMusic) {
                        birthdayMusic.muted = false;
                        birthdayMusic.play().catch(e => console.error("Unmuted music play error:", e));
                    }

                    triggerInfiniteConfetti();

                }, 500);
            }
        }, 1000);
    }

    function triggerInfiniteConfetti() {
        console.log("Triggering infinite confetti.");
        confettiContainer.classList.remove('hidden-element');

        const colors = [
            '#FFD700', '#FFB7C5', '#7FE5F0', '#F0EAD6',
            '#A87F6E', '#B71C1C', '#E8C76D', '#2E4C6D'
        ];
        const numConfetti = 25;

        // Keep spawning new confetti every 500ms
        setInterval(() => {
            for (let i = 0; i < numConfetti; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);

                const startX = Math.random() * window.innerWidth * 1.4 - (window.innerWidth * 0.2);
                const endX = Math.random() * window.innerWidth * 1.4 - (window.innerWidth * 0.2);
                const startY = -Math.random() * 400;
                const endY = window.innerHeight + Math.random() * 400;

                confetti.style.setProperty('--x-start', `${startX}px`);
                confetti.style.setProperty('--y-start', `${startY}px`);
                confetti.style.setProperty('--x-end', `${endX}px`);
                confetti.style.setProperty('--y-end', `${endY}px`);
                confetti.style.animationDelay = `${Math.random() * 3.5}s`;
                confetti.style.animationDuration = `${5 + Math.random() * 5}s`;

                confettiContainer.appendChild(confetti);

                // Remove confetti after it finishes animating
                setTimeout(() => {
                    confetti.remove();
                }, 10000);
            }
        }, 500);
    }
});
