/*
    A Documentation website about the organization: PROJECT TEST
    Copyright (C) 2024  ProjectTEST

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

document.addEventListener("DOMContentLoaded", function() {
    const hero = document.querySelector('.hero');
    const canvas = document.getElementById('nnCanvas');
    const ctx = canvas.getContext('2d');
    
    // Performance optimizations
    let rafId;
    let lastTime = 0;
    const FPS = 60;
    const frameDelay = 1000 / FPS;

    // Neural network parameters
    const neurons = [];
    const synapses = new Set();
    const neuronCount = 50; // Reduced for better performance
    const maxConnections = 3;
    const connectionDistance = 150;
    const colors = ['#4CAF50', '#03A9F4', '#3F51B5', '#9C27B0', '#E91E63'];

    // Initialize canvas
    function initCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        createNeurons();
    }

    function createNeurons() {
        neurons.length = 0;
        synapses.clear();

        for (let i = 0; i < neuronCount; i++) {
            neurons.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                active: Math.random() > 0.5
            });
        }
    }

    function updateNeurons(deltaTime) {
        neurons.forEach(neuron => {
            // Update position with smooth movement
            neuron.x += neuron.vx * deltaTime;
            neuron.y += neuron.vy * deltaTime;

            // Bounce off edges
            if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
            if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;

            // Randomly activate neurons
            if (Math.random() < 0.001) neuron.active = !neuron.active;
        });
    }

    function drawNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw synapses
        ctx.lineWidth = 0.5;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';

        neurons.forEach((neuron, i) => {
            neurons.slice(i + 1).forEach(other => {
                const dx = other.x - neuron.x;
                const dy = other.y - neuron.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = Math.max(0, 1 - (distance / connectionDistance));
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                    ctx.beginPath();
                    ctx.moveTo(neuron.x, neuron.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();

                    // Draw activation pulse if either neuron is active
                    if (neuron.active || other.active) {
                        const gradient = ctx.createLinearGradient(
                            neuron.x, neuron.y, other.x, other.y
                        );
                        gradient.addColorStop(0, `${neuron.color}44`);
                        gradient.addColorStop(1, `${other.color}44`);
                        ctx.strokeStyle = gradient;
                        ctx.stroke();
                    }
                }
            });
        });

        // Draw neurons
        neurons.forEach(neuron => {
            ctx.beginPath();
            ctx.fillStyle = neuron.active ? neuron.color : `${neuron.color}88`;
            ctx.shadowBlur = neuron.active ? 15 : 5;
            ctx.shadowColor = neuron.color;
            ctx.arc(neuron.x, neuron.y, neuron.active ? 3 : 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate(currentTime) {
        rafId = requestAnimationFrame(animate);
        
        const deltaTime = currentTime - lastTime;
        if (deltaTime < frameDelay) return;
        
        lastTime = currentTime;
        updateNeurons(deltaTime * 0.1);
        drawNetwork();
    }

    // Handle resize
    function handleResize() {
        initCanvas();
    }

    window.addEventListener('resize', handleResize);
    initCanvas();
    animate(0);

    // Cleanup
    return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', handleResize);
    };
});
