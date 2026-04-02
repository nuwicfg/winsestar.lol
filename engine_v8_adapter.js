/**
 * SOVEREIGN v7.5 "winsestar.lol" - ADAPTED ENGINE
 * @author: Antigravity / winse
 */

"use strict";

(function() {
    // Wait for profile data to be available
    function init() {
        if (!window.S_PROFILE_DATA) {
            setTimeout(init, 100);
            return;
        }

        const profile = window.S_PROFILE_DATA;
        const config = profile.config || {};
        
        // Map profile data to sState structure expected by the engine
        window.sState = {
            discordId: config.links?.discord?.split('/').pop() || '',
            siteTitle: profile.full_name || profile.username,
            bio: profile.bio || '',
            colors: config.colors || {},
            effects: config.effects || {},
            media: config.media || { bgMode: 'stars' },
            discord: config.discord || { sync: true },
            links: config.links || {},
            features: config.features || { badges: ['imperial-star'], typewriter: true, viewCounter: true }
        };

        bootSovereign();
    }

    async function bootSovereign() {
        try {
            applySovereignState(window.sState);
            setupStaticTilt();
            preloadAvatar();
            fetchTelemetry();
            setInterval(fetchTelemetry, 15000);
        } catch (e) {
            console.error("Sovereign Engine Error:", e);
        }
    }

    // --- REUSED CORE LOGIC FROM engine_v8.js ---
    // (Stripped down version for cleaner execution in Next.js)

    function applySovereignState(s) {
        const root = document.documentElement;
        const c = s.colors || {};
        
        // Apply CSS Variables
        if (c.name) {
            root.style.setProperty('--text-start', c.name[0]);
            root.style.setProperty('--text-end', c.name[1]);
        }
        if (c.border) {
            root.style.setProperty('--border-start', c.border[0]);
            root.style.setProperty('--border-end', c.border[1]);
        }
        // ... more color mapping ...

        const eff = s.effects || {};
        const nameEl = document.getElementById('profileName');
        const cardEl = document.getElementById('mainCard');

        if (nameEl) {
            nameEl.classList.toggle('active-glitch', !!eff.glitchName);
        }
        if (cardEl) {
            cardEl.classList.toggle('float-animation', !!eff.floatCard);
            cardEl.classList.toggle('glow-animation', !!eff.glowCard);
        }

        handleBgMatrix(s.media || { bgMode: 'stars' });
        renderSocialIcons(s.links || {});
        applyBadges(s.features?.badges || []);
        
        if (s.features?.typewriter) {
            const bioEl = document.getElementById('profileBio');
            if (bioEl) applyTypewriter(bioEl, s.bio);
        }
    }

    function handleBgMatrix(m) {
        const atom = document.getElementById('particles-js');
        if (!atom) return;
        
        // Simple star background by default
        if (window.particlesJS) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 150 },
                    color: { value: m.atomColor || '#ffffff' },
                    opacity: { value: 0.5 },
                    size: { value: 1 },
                    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.1, width: 1 },
                    move: { enable: true, speed: 2 }
                }
            });
        }
    }

    function renderSocialIcons(links) {
        const grid = document.getElementById('socialLinks');
        if (!grid) return;
        grid.innerHTML = '';
        
        const icons = { discord: 'fa-discord', instagram: 'fa-instagram', github: 'fa-github' };
        Object.keys(icons).forEach(k => {
            if (links[k]) {
                grid.innerHTML += `<a href="${links[k]}" target="_blank" class="social-item">
                    <i class="fa-brands ${icons[k]}"></i>
                </a>`;
            }
        });
    }

    function setupStaticTilt() {
        const card = document.getElementById('cardTilt');
        if (!card) return;
        window.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const centerX = r.left + r.width / 2;
            const centerY = r.top + r.height / 2;
            const rx = ((e.clientY - centerY) / (window.innerHeight / 2)) * -10;
            const ry = ((e.clientX - centerX) / (window.innerWidth / 2)) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        });
    }

    // --- TELEMETRY HELPER ---
    async function fetchTelemetry() {
        const dId = window.sState.discordId;
        if (!dId) return;
        try {
            const r = await fetch('https://api.lanyard.rest/v1/users/' + dId);
            const { data } = await r.json();
            if (data) renderTelemetry(data);
        } catch (e) {}
    }

    function renderTelemetry(data) {
        const statusEl = document.getElementById('discordStatus');
        if (statusEl) {
            const colors = { online: '#22c55e', idle: '#f59e0b', dnd: '#ef4444', offline: '#4b5563' };
            statusEl.style.background = colors[data.discord_status] || colors.offline;
        }
    }

    function applyTypewriter(el, text) {
        el.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        type();
    }

    function applyBadges(badges) {
        const wrap = document.getElementById('badgeContainer');
        if (!wrap || !badges.length) return;
        wrap.classList.remove('hidden');
        wrap.innerHTML = badges.map(b => `<div class="badge-item"><i class="fa-solid fa-certificate"></i></div>`).join('');
    }

    function preloadAvatar() {
        // Fallback or early load logic
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
