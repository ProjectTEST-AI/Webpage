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
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    let dots = []; // Array to store dot objects with position, velocity, color, size, and z-axis movement

    function randomColor() {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    function createDot() {
        const z = Math.random() * 20 + 1; // Initial simulated depth
        const velZ = (Math.random() - 0.5) * 0.2; // Velocity along the z-axis for dynamic depth
        const baseSize = 10; // Base size for dot at z=1
        const size = baseSize * z / 10; // Size increases with depth
        const dot = {
            x: Math.random() * (canvas.width - 20),
            y: Math.random() * (canvas.height - 20),
            z: z,
            velX: (Math.random() - 0.5) * 2,
            velY: (Math.random() - 0.5) * 2,
            velZ: velZ,
            color: randomColor(),
            size: size
        };
        dots.push(dot);
    }

    function updateDotZ(dot) {
        dot.z += dot.velZ;
        const minZ = 1, maxZ = 20;
        if (dot.z <= minZ || dot.z >= maxZ) {
            dot.velZ *= -1; // Reverse direction if it goes beyond min or max z
        }
        dot.size = 8 * dot.z / 8; // Update size based on new z position for 3D effect
    }

    function updateConnections() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for redrawing

        // Draw and update positions of dots, with simulated 3D effects including z-axis movement
        dots.forEach(dot => {
            updateDotZ(dot); // Update dot's z position for dynamic depth effect

            const opacity = dot.z / 20; // Adjust opacity based on depth
            ctx.fillStyle = `rgba(${dot.color.match(/\d+/g).join(',')},${opacity})`;
            ctx.shadowColor = `rgba(0, 0, 255, ${opacity / 2})`;
            ctx.shadowBlur = dot.size / 2;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            const lightSize = dot.size * 1.5; // Increase size for a larger light effect
            const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, lightSize / 2);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright center
            gradient.addColorStop(1, `rgba(${dot.color.match(/\d+/g).join(',')}, 0)`); // Fading to transparent color

            ctx.beginPath();
            ctx.moveTo(dot.x - lightSize / 2, dot.y - lightSize / 2);
            ctx.lineTo(dot.x + lightSize / 2, dot.y - lightSize / 2);
            ctx.lineTo(dot.x + lightSize / 2, dot.y + lightSize / 2);
            ctx.lineTo(dot.x - lightSize / 2, dot.y + lightSize / 2);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.shadowBlur = lightSize / 4; // Add a slight blur effect
            ctx.shadowColor = `rgba(${dot.color.match(/\d+/g).join(',')}, 1)`;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset blur effect

            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            dot.x += dot.velX;
            dot.y += dot.velY;

            // Bounce off the edges
            if (dot.x <= 20 || dot.x >= (canvas.width-20)) dot.velX *= -1;
            if (dot.y <= 20 || dot.y >= (canvas.height-20)) dot.velY *= -1;
        });

        // Draw connections, considering new z positions
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dot1 = dots[i];
                const dot2 = dots[j];
                const distance = Math.sqrt((dot1.x - dot2.x) ** 2 + (dot1.y - dot2.y) ** 2);
                const maxDistance = 500; // Connection visibility range
                if (distance < maxDistance) {
                    const opacity = Math.min(dot1.z, dot2.z) / 20;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity - distance / maxDistance})`;
                    ctx.beginPath();
                    ctx.moveTo(dot1.x, dot1.y);
                    ctx.lineTo(dot2.x, dot2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        updateConnections(); // Draw dots and update connections based on proximity
        requestAnimationFrame(animate); // Loop the animation
    }

    // Create dots
    for (let i = 0; i < 50; i++) { // Adjust number of dots as needed
        createDot();
    }

    animate(); // Start the animation loop
});