import { useEffect, useRef } from "react";

export default function Particles({
    count = 100,
    color = "240, 165, 0", // gold (RGB)
    maxSize = 2.2,
    speed = 1,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animId = 0;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const makeParticles = () => {
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * maxSize + 0.3,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                a: Math.random() * 0.6 + 0.15,
                da: (Math.random() - 0.5) * 0.008,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.a += p.da;

                if (p.a <= 0.1 || p.a >= 0.75) p.da *= -1;
                // if (p.x < 0) p.x = canvas.width;
                // if (p.x > canvas.width) p.x = 0;
                // if (p.y < 0) p.y = canvas.height;
                // if (p.y > canvas.height) p.y = 0;
                
                // bounce off edges
                if (p.x - p.r <= 0) {
                    p.x = p.r;
                    p.vx *= -1;
                }
                if (p.x + p.r >= canvas.width) {
                    p.x = canvas.width - p.r;
                    p.vx *= -1;
                }
                if (p.y - p.r <= 0) {
                    p.y = p.r;
                    p.vy *= -1;
                }
                if (p.y + p.r >= canvas.height) {
                    p.y = canvas.height - p.r;
                    p.vy *= -1;
                }

                ctx.beginPath();
                ctx.globalAlpha = p.a;
                ctx.fillStyle = `rgba(${color}, 1)`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            const maxDist = 140;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxDist) {
                        // const fade = 1 - dist / maxDist;
                        const fade = Math.pow(1 - dist / maxDist, 2); // softer falloff
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${color}, ${fade * 0.45})`;
                        ctx.lineWidth = Math.max(0.3, fade * 1.1);
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };

        resize();
        makeParticles();
        draw();

        const onResize = () => {
            resize();
            makeParticles();
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
        };
    }, [count, color, maxSize, speed]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        />
    );
}