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

    const neurons = [];
    const dataPackets = [];
    const neuronCount = 100;
    let connectionDistance, maxConnections;
    const connectionLifespan = 500;
    const animationSpeed = 0.0005;
    const colors = ['#00ff00', '#00ffff', '#0080ff', '#8000ff', '#ff00ff'];

    function updateConnectionParams() {
        // Adjust connection parameters based on canvas width
        if (canvas.width < 600) {
            connectionDistance = 80;
            maxConnections = 3;
        } else if (canvas.width < 1200) {
            connectionDistance = 100;
            maxConnections = 5;
        } else {
            connectionDistance = 120;
            maxConnections = 7;
        }
    }

    updateConnectionParams();

    // Create neurons
    for (let i = 0; i < neuronCount; i++) {
        neurons.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            connections: [],
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function updateConnections() {
        for (const neuron of neurons) {
            // Remove old connections
            neuron.connections = neuron.connections.filter(conn => conn.age < connectionLifespan);

            // Add new connections if needed
            if (neuron.connections.length < maxConnections) {
                const nearbyNeurons = neurons
                    .filter(n => n !== neuron)
                    .map(n => ({
                        neuron: n,
                        distance: Math.sqrt((n.x - neuron.x) ** 2 + (n.y - neuron.y) ** 2)
                    }))
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, maxConnections - neuron.connections.length);

                for (const nearby of nearbyNeurons) {
                    if (nearby.distance < connectionDistance) {
                        neuron.connections.push({ neuron: nearby.neuron, age: 0 });
                    }
                }
            }

            // Age existing connections
            for (const conn of neuron.connections) {
                conn.age++;
            }
        }
    }

    function createDataPacket(start, end) {
        return {
            startX: start.x,
            startY: start.y,
            endX: end.x,
            endY: end.y,
            progress: 0,
            color: start.color
        };
    }

    let time = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += animationSpeed;

        updateConnections();

        // Draw connections
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        for (const neuron of neurons) {
            for (const conn of neuron.connections) {
                const opacity = 1 - conn.age / connectionLifespan;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(neuron.x, neuron.y);
                ctx.lineTo(conn.neuron.x, conn.neuron.y);
                ctx.stroke();
            }
        }

        // Draw and update neurons
        ctx.shadowBlur = 10;
        for (const neuron of neurons) {
            ctx.beginPath();
            ctx.fillStyle = neuron.color;
            ctx.arc(neuron.x, neuron.y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Add glow effect
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, 8);
            gradient.addColorStop(0, neuron.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.arc(neuron.x, neuron.y, 8, 0, Math.PI * 2);
            ctx.fill();

            // Move neurons in a circular pattern
            neuron.x += Math.cos(time) * 0.2;
            neuron.y += Math.sin(time) * 0.2;

            // Wrap around edges
            neuron.x = (neuron.x + canvas.width) % canvas.width;
            neuron.y = (neuron.y + canvas.height) % canvas.height;

            // Randomly send data packets
            if (Math.random() < 0.001 && neuron.connections.length > 0) {
                const targetConnection = neuron.connections[Math.floor(Math.random() * neuron.connections.length)];
                dataPackets.push(createDataPacket(neuron, targetConnection.neuron));
            }
        }

        // Update and draw data packets
        ctx.shadowBlur = 15;
        for (let i = dataPackets.length - 1; i >= 0; i--) {
            const packet = dataPackets[i];
            packet.progress += 0.005;

            if (packet.progress >= 1) {
                dataPackets.splice(i, 1);
                continue;
            }

            const x = packet.startX + (packet.endX - packet.startX) * packet.progress;
            const y = packet.startY + (packet.endY - packet.startY) * packet.progress;

            ctx.beginPath();
            ctx.fillStyle = packet.color;
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Add glow effect to data packets
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 5);
            gradient.addColorStop(0, packet.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    function handleResize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        updateConnectionParams();
    }

    window.addEventListener('resize', handleResize);
});
