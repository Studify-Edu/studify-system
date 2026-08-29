document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    
    let particles = [];
    const connectionDistance = 150;
    
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    // Add mouse move listeners to the login wrapper so it captures events properly
    const loginWrapper = document.getElementById('loginBox');
    if (loginWrapper) {
        loginWrapper.addEventListener('mousemove', function(event) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });
        loginWrapper.addEventListener('mouseout', function() {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    }

    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        let numberOfParticles = (width * height) / 9000;
        if (numberOfParticles > 100) numberOfParticles = 100;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 1;
            const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            const directionX = (Math.random() * 1) - 0.5;
            const directionY = (Math.random() * 1) - 0.5;
            const color = '#3b82f6'; // Primary blue tint
            
            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 20) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
            ctx.fill();
        }

        update() {
            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }

            this.x += this.directionX * 0.5;
            this.y += this.directionY * 0.5;
            
            // Keep base coordinates moving slowly so the network drifts
            this.baseX += this.directionX * 0.5;
            this.baseY += this.directionY * 0.5;
            
            if(this.baseX > width) { this.baseX = width; this.directionX = -Math.abs(this.directionX); }
            if(this.baseX < 0) { this.baseX = 0; this.directionX = Math.abs(this.directionX); }
            if(this.baseY > height) { this.baseY = height; this.directionY = -Math.abs(this.directionY); }
            if(this.baseY < 0) { this.baseY = 0; this.directionY = Math.abs(this.directionY); }
            
            // Constrain actual X and Y to not drift infinitely
            if (this.x > width + 100) this.x = width + 100;
            if (this.x < -100) this.x = -100;
            if (this.y > height + 100) this.y = height + 100;
            if (this.y < -100) this.y = -100;

            this.draw();
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                    + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(30, 58, 138, ${opacityValue * 0.8})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
    }

    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });

    init();
    animate();
});

