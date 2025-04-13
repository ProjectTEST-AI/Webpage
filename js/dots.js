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

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle - Fixed to ensure reliable functionality
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        // Use a robust click handler for the toggle button
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Force toggle the active class
            navMenu.classList.toggle('active');
            
            // Update icon based on menu state
            if (navMenu.classList.contains('active')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
      
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
  
    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
  
    // Initialize neural network canvas
    const hero = document.querySelector('.hero');
    const canvas = document.getElementById('nnCanvas');
    
    // Check if canvas exists - some pages might not have it
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
  
    // Neural network parameters - Declare these BEFORE the resizeCanvas function
    const neurons = [];
    const colors = ['#10A2D7', '#9C27B0', '#E91E63', '#4CAF50', '#03A9F4'];
    let neuronCount = 0;
    let connectionDistance = 0;
    
    // Calculate neuron count based on screen size
    function calculateNeuronCount() {
      // Base count for large screens
      const baseCount = 100;
      
      // Get the viewport width
      const viewportWidth = window.innerWidth;
      
      // Scale down neuron count for smaller screens
      if (viewportWidth <= 576) {
        return Math.floor(baseCount * 0.4); // 40% of dots on mobile
      } else if (viewportWidth <= 768) {
        return Math.floor(baseCount * 0.6); // 60% of dots on tablets
      } else if (viewportWidth <= 992) {
        return Math.floor(baseCount * 0.8); // 80% of dots on small desktops
      }
      
      return baseCount; // 100% on large desktops
    }
    
    // Calculate connection distance based on screen size
    function calculateConnectionDistance() {
      // Base distance for large screens
      const baseDistance = 150;
      
      // Get the viewport width
      const viewportWidth = window.innerWidth;
      
      // Adjust connection distance for smaller screens
      if (viewportWidth <= 576) {
        return baseDistance * 1.2; // Increase spacing on mobile
      } else if (viewportWidth <= 768) {
        return baseDistance * 1.1; // Slightly increase spacing on tablets
      }
      
      return baseDistance;
    }
    
    // Set canvas size
    function resizeCanvas() {
      // Save the current state of neurons before resizing
      const savedNeurons = neurons.length > 0 ? [...neurons] : [];
      
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      
      // Restore saved neurons state if available
      if (savedNeurons.length > 0) {
        // Adjust positions for new canvas dimensions
        const widthRatio = canvas.width / (savedNeurons[0].canvasWidth || canvas.width);
        const heightRatio = canvas.height / (savedNeurons[0].canvasHeight || canvas.height);
        
        neurons.length = 0;
        savedNeurons.forEach(neuron => {
          neurons.push({
            x: neuron.x * widthRatio,
            y: neuron.y * heightRatio,
            vx: neuron.vx,
            vy: neuron.vy,
            color: neuron.color,
            active: neuron.active,
            size: neuron.size,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
          });
        });
      }
    }
    
    // Initialize neurons
    function createNeurons() {
      neurons.length = 0;
      // Update neuron count based on current screen size
      neuronCount = calculateNeuronCount();
      connectionDistance = calculateConnectionDistance();
      
      for (let i = 0; i < neuronCount; i++) {
        neurons.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          active: Math.random() > 0.7,
          size: Math.random() * 1.5 + 1,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height
        });
      }
    }
  
    // Update neuron positions
    function updateNeurons() {
      neurons.forEach(neuron => {
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;
  
        // Bounce off edges
        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;
  
        // Randomly activate neurons
        if (Math.random() < 0.003) neuron.active = !neuron.active;
      });
    }
  
    // Draw neural network
    function drawNetwork() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw connections
      neurons.forEach((neuron, i) => {
        neurons.slice(i + 1).forEach(other => {
          const dx = other.x - neuron.x;
          const dy = other.y - neuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) {
            const opacity = Math.max(0, 1 - (distance / connectionDistance)) * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(neuron.x, neuron.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
  
            // Data pulse effect
            if (neuron.active || other.active) {
              const gradient = ctx.createLinearGradient(neuron.x, neuron.y, other.x, other.y);
              gradient.addColorStop(0, `${neuron.color}33`);
              gradient.addColorStop(1, `${other.color}33`);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });
  
      // Draw neurons
      neurons.forEach(neuron => {
        ctx.beginPath();
        ctx.fillStyle = neuron.active ? neuron.color : `${neuron.color}88`;
        if (neuron.active) {
          ctx.shadowColor = neuron.color;
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
    
    // Initialize canvas
    resizeCanvas();
    
    // Handle window resize to adjust neuron count and distribution
    window.addEventListener('resize', () => {
      resizeCanvas();
      createNeurons();
    });
  
    // Animation loop
    function animate() {
      updateNeurons();
      drawNetwork();
      requestAnimationFrame(animate);
    }
    
    // Start the animation
    createNeurons();
    animate();
  
    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.fade-in');
    function checkReveal() {
      revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.8) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }
    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Initial check
  });
