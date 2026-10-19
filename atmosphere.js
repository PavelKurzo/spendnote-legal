(function () {
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    window.addEventListener("pageshow", function () {
        window.scrollTo(0, 0);
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blobs = document.querySelectorAll("[data-blob]");
    if (!blobs.length) return;

    const palette = [
        [0.20, 0.48, 0.92],
        [0.28, 0.62, 0.96],
        [0.36, 0.50, 0.94],
        [0.18, 0.40, 0.80]
    ];

    const states = [
        { x: 140, y: -220, heading: 0.7, colorIndex: 0, size: 380, blur: 72, opacity: 0.36 },
        { x: -160, y: 240, heading: 3.6, colorIndex: 2, size: 310, blur: 64, opacity: 0.30 },
        { x: 80, y: 180, heading: 5.2, colorIndex: 1, size: 240, blur: 56, opacity: 0.24 }
    ];

    const maxX = Math.max(180, window.innerWidth * 0.28);
    const maxY = Math.max(260, window.innerHeight * 0.34);

    function rgb(index) {
        const stop = palette[index % palette.length];
        return `rgb(${Math.round(stop[0] * 255)} ${Math.round(stop[1] * 255)} ${Math.round(stop[2] * 255)})`;
    }

    function wrapHeading(heading) {
        let value = heading % (Math.PI * 2);
        if (value < 0) value += Math.PI * 2;
        return value;
    }

    function paint(el, state, duration) {
        el.style.width = `${state.size}px`;
        el.style.height = `${state.size}px`;
        el.style.filter = `blur(${state.blur}px)`;
        el.style.opacity = String(state.opacity);
        el.style.background = rgb(state.colorIndex);
        el.style.transition = duration
            ? `transform ${duration}s ease-in-out, background-color ${duration}s ease-in-out`
            : "none";
        el.style.transform = `translate(-50%, -50%) translate(${state.x}px, ${state.y}px)`;
    }

    function nextStep(state) {
        let heading = wrapHeading(state.heading + (1 + Math.random() * 4.3));
        const distance = 90 + Math.random() * 110;
        let x = state.x + Math.cos(heading) * distance;
        let y = state.y + Math.sin(heading) * distance;

        if (x > maxX || x < -maxX) {
            x = Math.min(Math.max(x, -maxX), maxX);
            heading = wrapHeading(Math.PI - heading);
        }
        if (y > maxY || y < -maxY) {
            y = Math.min(Math.max(y, -maxY), maxY);
            heading = wrapHeading(-heading);
        }

        return {
            ...state,
            x,
            y,
            heading,
            colorIndex: (state.colorIndex + (1 + Math.floor(Math.random() * 2))) % palette.length
        };
    }

    function wander(index) {
            const duration = 6 + Math.random() * 5;
        states[index] = nextStep(states[index]);
        paint(blobs[index], states[index], duration);
        window.setTimeout(() => wander(index), duration * 1000);
    }

    blobs.forEach((el, index) => {
        const state = states[index] || states[0];
        paint(el, state, 0);
    });

    if (reduceMotion) return;

    states.forEach((_, index) => {
        window.setTimeout(() => wander(index), index === 0 ? 80 : 2400 + index * 400);
    });
})();
