
/* =========================================================
   CINEMATIC BIRTHDAY INTRO
   ========================================================= */
(function () {
    "use strict";

    function initBirthdayIntro() {
        const intro = document.getElementById("birthdayIntro");
        if (!intro) return;

        const canvas = document.getElementById("birthdayCanvas");
        const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
        const orb = document.getElementById("introOrb");
        const startBtn = document.getElementById("startMagicBtn");
        const skipBtn = document.getElementById("skipIntroBtn");
        const enterBtn = document.getElementById("enterStoryBtn");
        const title = document.getElementById("introTitle");
        const text = document.getElementById("introText");
        const sceneNo = document.getElementById("introSceneNumber");
        const progress = document.querySelector(".intro-progress");
        const progressBar = document.getElementById("introProgressBar");
        const continueBox = document.getElementById("introContinue");

        if (!canvas || !ctx || !orb || !startBtn || !skipBtn || !enterBtn) return;

        document.body.classList.add("intro-lock");

        const scenes = [
            {
                title: "Hey, my o w n e r r...",
                text: "Before you enter our little world, I made one tiny piece of magic for you."
            },
            {
                title: "For the girl(witch) I love ♡",
                text: "Somewhere between our random talks, silly fights and little moments... you became my favourite person."
            },
            {
                title: "Our Journey ✦",
                text: "Every little memory, every laugh, every random moment with you became a part of my favourite story."
            },
            {
                title: "Our Memories ♡",
                text: "I could replay a thousand moments, but I would still choose the ones where I get to be with you."
            },
            {
                title: "You are my favourite story",
                text: "I don't want a perfect story. I just want ours — messy, beautiful, funny and completely ours."
            },
            {
                title: "Happy Birthday, my Love 💜",
                text: "Today is yours. And this little world is just the beginning of everything I still want to create with you."
            }
        ];

        const stars = [];
        const particles = [];
        const trails = [];
        let width = 0, height = 0, dpr = 1;
        let started = false;
        let currentScene = 0;
        let sceneTimer = null;
        let progressTimer = null;
        let lastTime = performance.now();
        let mouseX = -1000, mouseY = -1000;

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            stars.length = 0;
            const count = Math.min(220, Math.max(90, Math.floor(width / 6)));
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 1.7 + .2,
                    a: Math.random() * .8 + .15,
                    tw: Math.random() * 2 + .5,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }

        function particle(x, y, power = 1, heart = false) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 2.5 + .6) * power;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - .6 * power,
                size: heart ? Math.random() * 14 + 10 : Math.random() * 4 + 1,
                life: 1,
                decay: Math.random() * .012 + .008,
                char: heart ? ["♥", "♡", "✦", "✧"][Math.floor(Math.random() * 4)] : null,
                spin: (Math.random() - .5) * .08
            });
        }

        function burst(x, y, amount = 55, power = 1) {
            for (let i = 0; i < amount; i++) particle(x, y, power, true);
        }

        function ripple(x, y) {
            const ring = document.createElement("div");
            ring.className = "intro-click-ripple";
            ring.style.left = x + "px";
            ring.style.top = y + "px";
            intro.appendChild(ring);
            setTimeout(() => ring.remove(), 900);
        }

        function draw(now) {
            const dt = Math.min(40, now - lastTime);
            lastTime = now;

            ctx.clearRect(0, 0, width, height);

            const glow = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, Math.max(width, height) * .7
            );
            glow.addColorStop(0, "rgba(155,93,229,.10)");
            glow.addColorStop(.5, "rgba(229,197,110,.025)");
            glow.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);

            stars.forEach(s => {
                const twinkle = s.a + Math.sin(now * .001 * s.tw + s.phase) * .25;
                ctx.globalAlpha = Math.max(.05, Math.min(1, twinkle));
                ctx.fillStyle = "#fff1b8";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            if (mouseX > -500) {
                const g = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120);
                g.addColorStop(0, "rgba(229,197,110,.11)");
                g.addColorStop(1, "rgba(155,93,229,0)");
                ctx.fillStyle = g;
                ctx.fillRect(mouseX - 120, mouseY - 120, 240, 240);
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx * (dt / 16);
                p.y += p.vy * (dt / 16);
                p.vy += .018 * dt;
                p.life -= p.decay * (dt / 16);

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                if (p.char) {
                    ctx.font = p.size + "px serif";
                    ctx.fillStyle = (i % 2) ? "#e6a5ca" : "#e5c56e";
                    ctx.fillText(p.char, p.x, p.y);
                } else {
                    ctx.fillStyle = "#e5c56e";
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;

            requestAnimationFrame(draw);
        }

        function sound() {
            try {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (!AC) return;
                const ac = new AC();
                const notes = [261.63, 329.63, 392, 523.25, 659.25];
                const now = ac.currentTime;
                notes.forEach((f, i) => {
                    const o = ac.createOscillator();
                    const g = ac.createGain();
                    o.type = "sine";
                    o.frequency.value = f;
                    g.gain.setValueAtTime(.0001, now + i * .13);
                    g.gain.exponentialRampToValueAtTime(.035, now + i * .13 + .03);
                    g.gain.exponentialRampToValueAtTime(.0001, now + i * .13 + .7);
                    o.connect(g);
                    g.connect(ac.destination);
                    o.start(now + i * .13);
                    o.stop(now + i * .13 + .75);
                });
                setTimeout(() => ac.close().catch(() => {}), 5000);
            } catch (_) {}
        }

        function scene(index) {
            currentScene = index;
            const s = scenes[index];

            title.style.opacity = "0";
            title.style.transform = "translateY(12px)";
            text.style.opacity = "0";
            text.style.transform = "translateY(8px)";

            setTimeout(() => {
                title.textContent = s.title;
                text.textContent = s.text;
                sceneNo.textContent = String(index + 1).padStart(2, "0");
                title.style.opacity = "1";
                title.style.transform = "translateY(0)";
                text.style.opacity = "1";
                text.style.transform = "translateY(0)";
            }, 260);

            burst(width / 2, height * .43, index === scenes.length - 1 ? 85 : 30, 1.6);
            sound();
        }

        function finish() {
            clearInterval(sceneTimer);
            clearInterval(progressTimer);
            progressBar.style.width = "100%";
            burst(width / 2, height * .43, 130, 2.2);
            sound();
            continueBox.classList.add("show");
            startBtn.style.display = "none";
            skipBtn.style.display = "none";
        }

        function start() {
            if (started) return;
            started = true;

            startBtn.style.display = "none";
            skipBtn.style.display = "none";
            progress.classList.add("active");
            sound();

            const duration = 18000;
            const each = duration / scenes.length;
            const begin = Date.now();

            scene(0);

            progressTimer = setInterval(() => {
                const pct = Math.min(100, ((Date.now() - begin) / duration) * 100);
                progressBar.style.width = pct + "%";
            }, 30);

            sceneTimer = setInterval(() => {
                currentScene++;
                if (currentScene >= scenes.length) {
                    finish();
                    return;
                }
                scene(currentScene);
            }, each);
        }

        function enterStory() {
            clearInterval(sceneTimer);
            clearInterval(progressTimer);
            intro.classList.add("hide-intro");
            document.body.classList.remove("intro-lock");

            setTimeout(() => {
                intro.remove();
                const loginPage = document.getElementById("loginPage");
                if (loginPage) {
                    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
                    loginPage.classList.add("active-page");
                }
                window.scrollTo(0, 0);
            }, 1200);
        }

        resize();
        requestAnimationFrame(draw);

        window.addEventListener("resize", resize);

        document.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener("touchmove", e => {
            const t = e.touches[0];
            if (t) {
                mouseX = t.clientX;
                mouseY = t.clientY;
            }
        }, { passive: true });

        intro.addEventListener("click", e => {
            if (e.target.closest("button")) return;
            if (!started) return;
            burst(e.clientX, e.clientY, 20, 1.5);
            ripple(e.clientX, e.clientY);
        });

        orb.addEventListener("click", start);
        orb.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                start();
            }
        });

        startBtn.addEventListener("click", start);

        skipBtn.addEventListener("click", enterStory);
        enterBtn.addEventListener("click", enterStory);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initBirthdayIntro);
    } else {
        initBirthdayIntro();
    }
})();


/* ============================================
            LOGIN DETAILS
============================================ */

const correctUsername = "SANJAYKARTHIGA";

const correctPassword = "loved ones";


/* ============================================
                LOGIN
============================================ */

function login() {

    const username =
        document.getElementById("username")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value
        .trim();

    const error =
        document.getElementById("loginError");


    if (
        username.toLowerCase() ===
        correctUsername.toLowerCase()
        &&
        password === correctPassword
    ) {

        error.innerHTML = "";

        createHeartExplosion();

        setTimeout(function() {

            showPage("welcomePage");

        }, 700);

    }

    else {

        error.innerHTML =
            "Hmm... wrong secret. Try again, love 💜";

        const box =
            document.querySelector(".login-box");

        box.classList.add("shake");

        setTimeout(function() {

            box.classList.remove("shake");

        }, 500);

    }

}


/* ============================================
              ENTER KEY
============================================ */

document.addEventListener(
    "keydown",
    function(event) {

        const login =
            document.getElementById("loginPage");

        if (
            event.key === "Enter"
            &&
            login.classList.contains(
                "active-page"
            )
        ) {

            login();

        }

    }
);


/* ============================================
             PAGE SWITCHING
============================================ */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(function(page) {

        page.classList.remove(
            "active-page"
        );

    });


    const target =
        document.getElementById(pageId);


    target.classList.add(
        "active-page"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    createHeartExplosion();

}


/* ============================================
              3D TILT EFFECT
============================================ */

function enableTilt() {

    const cards =
        document.querySelectorAll(
            ".tilt-card"
        );


    cards.forEach(function(card) {

        card.addEventListener(
            "mousemove",
            function(event) {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    (y - centerY) /
                    14;


                const rotateY =
                    (centerX - x) /
                    14;


                card.style.transform =
                    `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-8px)
                    scale(1.02)
                    `;

            }
        );


        card.addEventListener(
            "mouseleave",
            function() {

                card.style.transform =
                    `
                    perspective(1000px)
                    rotateX(0deg)
                    rotateY(0deg)
                    translateY(0)
                    scale(1)
                    `;

            }
        );

    });

}

enableTilt();


/* ============================================
              FLOATING HEARTS
============================================ */

function createFloatingHeart() {

    const heart =
        document.createElement("div");


    heart.className =
        "floating-heart";


    const symbols =
        [
            "♡",
            "♥",
            "✦",
            "✧"
        ];


    heart.innerHTML =
        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];


    heart.style.left =
        Math.random() * 100 +
        "vw";


    heart.style.fontSize =
        (10 + Math.random() * 18) +
        "px";


    heart.style.animationDuration =
        (6 + Math.random() * 5) +
        "s";


    document.body.appendChild(
        heart
    );


    setTimeout(
        function() {

            heart.remove();

        },
        11000
    );

}


setInterval(
    createFloatingHeart,
    1800
);


/* ============================================
              HEART EXPLOSION
============================================ */

function createHeartExplosion() {

    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const heart =
            document.createElement("div");


        heart.className =
            "floating-heart";


        heart.innerHTML =
            i % 2 === 0
            ? "♥"
            : "✦";


        heart.style.left =
            (40 + Math.random() * 20) +
            "vw";


        heart.style.bottom =
            (20 + Math.random() * 20) +
            "vh";


        heart.style.fontSize =
            (12 + Math.random() * 20) +
            "px";


        heart.style.animationDuration =
            (3 + Math.random() * 3) +
            "s";


        document.body.appendChild(
            heart
        );


        setTimeout(
            function() {

                heart.remove();

            },
            7000
        );

    }

}


/* ============================================
             PROPOSAL MESSAGE
============================================ */

function showProposal() {

    const proposal =
        document.getElementById(
            "proposalMessage"
        );


    proposal.classList.add(
        "show"
    );


    createBigHeartExplosion();

}


/* ============================================
             BIG HEART EFFECT
============================================ */

function createBigHeartExplosion() {

    const symbols =
        [
            "♥",
            "♡",
            "💜",
            "✦",
            "✨",
            "💍"
        ];


    for (
        let i = 0;
        i < 40;
        i++
    ) {

        const item =
            document.createElement("div");


        item.className =
            "floating-heart";


        item.innerHTML =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        item.style.left =
            Math.random() * 100 +
            "vw";


        item.style.bottom =
            "20vh";


        item.style.fontSize =
            (12 + Math.random() * 25) +
            "px";


        item.style.animationDuration =
            (3 + Math.random() * 4) +
            "s";


        document.body.appendChild(
            item
        );


        setTimeout(
            function() {

                item.remove();

            },
            8000
        );

    }

}


/* ============================================
             MOUSE GLOW
============================================ */

const cursorGlow =
    document.querySelector(
        ".cursor-glow"
    );


document.addEventListener(
    "mousemove",
    function(event) {

        if (!cursorGlow) return;


        cursorGlow.style.left =
            event.clientX + "px";


        cursorGlow.style.top =
            event.clientY + "px";

    }
);