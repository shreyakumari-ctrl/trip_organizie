// Choose Your Next Memory - Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger to X icon if needed
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Toggle menu when "Home" links are clicked (to satisfy user request)
        const homeLinks = document.querySelectorAll('.nav-links a[href="index.html"]');
        homeLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // If it's already active (on home page), we might want to toggle menu instead of reload
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('trip_organizie/')) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        navLinks.classList.toggle('active');
                        const icon = mobileMenuBtn.querySelector('i');
                        if (navLinks.classList.contains('active')) {
                            icon.classList.remove('fa-bars');
                            icon.classList.add('fa-times');
                        } else {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            });
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Mood Selection Logic (Home Page)
    const moodCards = document.querySelectorAll('.mood-card');
    moodCards.forEach(card => {
        card.addEventListener('click', () => {
            const mood = card.querySelector('h3').innerText;
            window.location.href = `discover.html?mood=${encodeURIComponent(mood)}`;
        });
    });

    // "Build My Trip" Suggestion Tool
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    let userChoices = {};

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const value = target.getAttribute('data-value');
            const parent = target.closest('.tool-step');

            // Visual feedback
            parent.querySelectorAll('.btn').forEach(b => {
                b.style.backgroundColor = 'transparent';
                b.style.color = 'var(--primary)';
            });
            target.style.backgroundColor = 'var(--primary)';
            target.style.color = 'white';

            if (parent.id === 'step1') {
                userChoices.mood = value;
                setTimeout(() => {
                    document.getElementById('step1').style.display = 'none';
                    document.getElementById('step2').style.display = 'block';
                }, 400);
            } else if (parent.id === 'step2') {
                userChoices.budget = value;
                showSuggestion(userChoices);
            }
        });
    });

    function showSuggestion(choices) {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('result').style.display = 'block';

        const textElement = document.getElementById('suggestion-text');

        // Simple logic for suggestion
        if (choices.mood === 'chill' && choices.budget === 'low') {
            textElement.innerText = "Misty Mornings in Darjeeling";
        } else if (choices.mood === 'adventure') {
            textElement.innerText = "The Hidden Side of Goa";
        } else if (choices.budget === 'high') {
            textElement.innerText = "Swiss Alps Adventure";
        } else {
            textElement.innerText = "Kerala Backwaters";
        }
    }

    // Discover Page Filtering -  Handled by renderDiscoverTrips and updateFilterLogic below

    // Form Handling (General)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Skip auth forms here, handled specifically below
        if (form.id === 'signupForm' || form.id === 'loginForm') return;

        form.addEventListener('submit', (e) => {
            // Allow default for now if it's the inline onsubmit, but let's override for cleaner handling
            // The inline onsubmit in HTML handles the alert, so we can just log here or add animation
            console.log('Form submitted');
        });
    });

    // Authentication Logic
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // 1. Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            // Simple validation
            if (name && email && password) {
                const user = { name, email, password };
                localStorage.setItem('user', JSON.stringify(user));
                alert('Account created successfully! Please log in.');
                window.location.href = 'login.html';
            }
        });
    }

    // 2. Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (storedUser && storedUser.email === email && storedUser.password === password) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            } else {
                if (loginError) loginError.style.display = 'block';
                // Shake animation effect for error
                const card = document.querySelector('.auth-card');
                card.style.transform = 'translateX(10px)';
                setTimeout(() => card.style.transform = 'translateX(0)', 100);
            }
        });
    }

    // 3. Check Auth State & Update UI
    checkAuthState();

    function checkAuthState() {
        // Dark Mode Logic
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const loginBtn = document.getElementById('loginBtn');
        const navLinks = document.querySelector('.nav-links');

        if (!loginBtn || !navLinks) return;

        if (isLoggedIn) {
            const user = JSON.parse(localStorage.getItem('user'));
            const fullName = user ? user.name : 'Traveler';
            const firstName = fullName.split(' ')[0];
            const firstLetter = firstName.charAt(0).toUpperCase();

            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // For mobile, hide the login link and ensure profile/logout exist
                loginBtn.parentElement.style.display = 'none';

                if (!document.getElementById('mobile-logout')) {
                    const userLi = document.createElement('li');
                    userLi.id = 'mobile-user-info';
                    userLi.innerHTML = `
                        <div class="user-profile mobile-profile" style="justify-content: center; margin-bottom: 2rem;">
                            <div class="user-avatar">${firstLetter}</div>
                            <span class="user-name">${fullName}</span>
                        </div>
                    `;
                    // Prepend to top of menu
                    navLinks.insertBefore(userLi, navLinks.firstChild);

                    // Add Settings for Mobile
                    const settingsLi = document.createElement('li');
                    settingsLi.id = 'mobile-settings-li';
                    settingsLi.innerHTML = `<a href="#" id="mobile-settings"><i class="fas fa-cog"></i> Settings</a>`;
                    navLinks.appendChild(settingsLi);

                    // Add Dark Mode Toggle for Mobile
                    const darkModeLi = document.createElement('li');
                    darkModeLi.id = 'mobile-dark-mode-li';
                    darkModeLi.innerHTML = `<a href="#" id="mobile-dark-mode"><i class="fas fa-moon"></i> <span>${localStorage.getItem('darkMode') === 'true' ? 'Light Mode' : 'Dark Mode'}</span></a>`;
                    navLinks.appendChild(darkModeLi);

                    const logoutLi = document.createElement('li');
                    logoutLi.id = 'mobile-logout-li';
                    logoutLi.innerHTML = `<a href="#" id="mobile-logout"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
                    navLinks.appendChild(logoutLi);

                    // Mobile Event Listeners
                    document.getElementById('mobile-settings').addEventListener('click', (e) => {
                        e.preventDefault();
                        alert('Settings page coming soon!');
                    });

                    const mobileDarkModeBtn = document.getElementById('mobile-dark-mode');
                    mobileDarkModeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        document.body.classList.toggle('dark-mode');
                        const isDark = document.body.classList.contains('dark-mode');
                        localStorage.setItem('darkMode', isDark);
                        const textSpan = mobileDarkModeBtn.querySelector('span');
                        const icon = mobileDarkModeBtn.querySelector('i');
                        if (isDark) {
                            textSpan.innerText = 'Light Mode';
                            icon.className = 'fas fa-sun';
                        } else {
                            textSpan.innerText = 'Dark Mode';
                            icon.className = 'fas fa-moon';
                        }
                    });

                    document.getElementById('mobile-logout').addEventListener('click', (e) => {
                        e.preventDefault();
                        localStorage.removeItem('isLoggedIn');
                        window.location.reload();
                    });
                }
            }
            else {
                // Desktop logic (Dropdown)
                const mobileInfo = document.getElementById('mobile-user-info');
                const mobileSettingsLi = document.getElementById('mobile-settings-li');
                const mobileDarkModeLi = document.getElementById('mobile-dark-mode-li');
                const mobileLogLi = document.getElementById('mobile-logout-li');

                if (mobileInfo) mobileInfo.remove();
                if (mobileSettingsLi) mobileSettingsLi.remove();
                if (mobileDarkModeLi) mobileDarkModeLi.remove();
                if (mobileLogLi) mobileLogLi.remove();

                const li = loginBtn.parentElement;
                li.style.display = 'block';
                li.style.position = 'relative';

                // Only inject if the trigger doesn't exist
                if (!document.getElementById('userProfileTrigger')) {
                    li.innerHTML = `
                        <div class="user-profile" id="userProfileTrigger">
                            <div class="user-avatar">${firstLetter}</div>
                            <span class="user-name">${firstName}</span>
                            <i class="fas fa-chevron-down" style="font-size: 0.8rem; color: var(--text-muted); padding-left: 5px;"></i>
                        </div>
                        <div class="dropdown-menu" id="userDropdown">
                            <div class="dropdown-item" id="settingsBtn">
                                <i class="fas fa-cog"></i> Settings
                            </div>
                            <div class="dropdown-item" id="darkModeToggle">
                                <i class="fas fa-moon"></i> <span>${isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </div>
                            <div class="dropdown-divider"></div>
                            <div class="dropdown-item" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </div>
                        </div>
                    `;

                    // Desktop Event Listeners
                    const trigger = document.getElementById('userProfileTrigger');
                    const dropdown = document.getElementById('userDropdown');
                    const darkModeBtn = document.getElementById('darkModeToggle');

                    if (trigger && dropdown) {
                        trigger.addEventListener('click', (e) => {
                            e.stopPropagation();
                            dropdown.classList.toggle('show');
                        });

                        document.addEventListener('click', (e) => {
                            if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                                dropdown.classList.remove('show');
                            }
                        });
                    }

                    if (darkModeBtn) {
                        darkModeBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            document.body.classList.toggle('dark-mode');
                            const isDark = document.body.classList.contains('dark-mode');
                            localStorage.setItem('darkMode', isDark);
                            const textSpan = darkModeBtn.querySelector('span');
                            const icon = darkModeBtn.querySelector('i');
                            if (isDark) {
                                textSpan.innerText = 'Light Mode';
                                icon.className = 'fas fa-sun';
                            } else {
                                textSpan.innerText = 'Dark Mode';
                                icon.className = 'fas fa-moon';
                            }
                        });
                    }

                    const desktopLogout = document.getElementById('logoutBtn');
                    if (desktopLogout) {
                        desktopLogout.addEventListener('click', (e) => {
                            e.preventDefault();
                            localStorage.removeItem('isLoggedIn');
                            window.location.reload();
                        });
                    }

                    if (document.getElementById('settingsBtn')) {
                        document.getElementById('settingsBtn').addEventListener('click', () => {
                            alert('Settings page coming soon!');
                        });
                    }
                }
            }
        } else {
            // Not logged in: ensure login button is visible and mobile-only user info is gone
            loginBtn.parentElement.style.display = 'block';
            const mobileInfo = document.getElementById('mobile-user-info');
            const mobileSettingsLi = document.getElementById('mobile-settings-li');
            const mobileDarkModeLi = document.getElementById('mobile-dark-mode-li');
            const mobileLogLi = document.getElementById('mobile-logout-li');

            if (mobileInfo) mobileInfo.remove();
            if (mobileSettingsLi) mobileSettingsLi.remove();
            if (mobileDarkModeLi) mobileDarkModeLi.remove();
            if (mobileLogLi) mobileLogLi.remove();
        }
    }

    // ============================================
    // TRIP DATA & DETAILS PAGE LOGIC
    // ============================================

    const tripData = {
        'darjeeling': {
            name: 'Misty Mornings in Darjeeling',
            duration: '3 Days / 2 Nights',
            price: '$299',
            mood: 'chill',
            budget: 'low',
            category: 'mountain',
            description: "This isn't just a visit to a hill station; it's a step back in time. Experience the colonial charm of Darjeeling, wake up to the sight of Kanchenjunga, and ride the famous toy train through the clouds. Perfect for those seeking peace, tea, and breathtaking sunrises.",
            heroImage: 'https://s7ap1.scene7.com/is/image/incredibleindia/2-summer-capital-of-India-darjeeling-west-bengal-city-ff?qlt=82&ts=1726643695016&wid=1920&hei=1080&fit=constrain',
            inclusions: ['3 Star Accommodation', 'Breakfast & Dinner', 'Local Sightseeing', 'Toy Train Ride'],
            lat: 27.0410, lng: 88.2663,
            weather: '15°C Misty',
            spots: [
                { name: 'Tiger Hill', img: 'https://hblimg.mmtcdn.com/content/hubble/img/darjeeling/mmt/activities/m_activities-darjeeling-tiger-hill_l_400_640.jpg?w=400&h=300&fit=crop' },
                { name: 'Batasia Loop', img: 'https://www.swarnabdutta.com/wp-content/uploads/2021/03/batasia-loop-darjeeling-1024x852.jpeg?w=400&h=300&fit=crop' },
                { name: 'Tea Gardens', img: 'https://i.pinimg.com/originals/9c/48/d5/9c48d5ffba82eb18a911c8b3ca1c89ad.jpg?w=400&h=300&fit=crop' }
            ],
            hotels: [
                { name: 'Mayfair Darjeeling', price: '$120/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Glenburn Tea Estate', price: '$350/night', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Arrival & The Mall Road', desc: 'Arrive at Bagdogra/NJP and drive up the winding roads. Check into your heritage hotel. Evening stroll at the Mall Road and a warm cup of Darjeeling tea at Glenary\'s.' },
                { title: 'Day 2: Tiger Hill Sunrise & Toy Train', desc: 'Wake up at 4 AM to witness the sun painting the Kanchenjunga gold. Visit the Ghoom Monastery and take a joyride on the UNESCO World Heritage Toy Train.' },
                { title: 'Day 3: Tea Gardens & Departure', desc: 'Visit a lush green tea estate, learn how tea is processed, and buy some fresh leaves. Drive back down with memories of the mountains.' }
            ]
        },
        'goa': {
            name: 'The Hidden Side of Goa',
            duration: '4 Days / 3 Nights',
            price: '$450',
            mood: 'adventure', // also party
            budget: 'medium',
            category: 'beach',
            description: "Forget the crowded beaches. Discover the secret coves, private islands, and the rich Portuguese heritage of Goa. A mix of adventure and relaxation.",
            heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
            inclusions: ['Boutique Resort', 'Scooter Rental', 'Spice Plantation Tour', 'Private Beach Access'],
            lat: 15.2993, lng: 74.1240,
            weather: '29°C Sunny',
            spots: [
                { name: 'Palolem Beach', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80' },
                { name: 'Dudhsagar Falls', img: 'https://i.pinimg.com/originals/b8/0d/0c/b80d0ce990baac4e1b856cfa9ff9a833.jpg' },
                { name: 'Fort Aguada', img: 'https://media.istockphoto.com/id/2168332314/photo/jaisalmer-fort-or-golden-fort-from-the-roof.jpg?s=612x612&w=0&k=20&c=AV0D2sG8tmPfIFWJXOH262enNTDkulpAFoMBerMY9Go=' }
            ],
            hotels: [
                { name: 'Taj Exotica', price: '$250/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Alila Diwa', price: '$200/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: South Goa Arrival', desc: 'Land in Goa and head straight to your boutique resort in South Goa. Sunset at Agonda Beach.' },
                { title: 'Day 2: Secret Waterfalls & Heritage', desc: 'Trek to a hidden waterfall in the morning. Visit the Fontainhas Latin Quarter in the evening.' },
                { title: 'Day 3: Island Hopping', desc: 'Take a boat to Butterfly Beach and Honeymoon Island. Dolphin watching.' },
                { title: 'Day 4: Departure', desc: 'One last dip in the ocean and head to the airport.' }
            ]
        },
        'paris': {
            name: 'Parisian Nights',
            duration: '5 Days / 4 Nights',
            price: '$899',
            mood: 'cultural', // also romantic/city
            budget: 'high',
            category: 'city',
            description: "The City of Lights awaits. Experience the romance, the art of the Louvre, and the culinary magic of French patisseries.",
            heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
            inclusions: ['City Center Hotel', 'Louvre Tickets', 'Seine River Cruise', 'Daily Breakfast'],
            lat: 48.8566, lng: 2.3522,
            weather: '12°C Cloudy',
            spots: [
                { name: 'Eiffel Tower', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80' },
                { name: 'Louvre Museum', img: 'https://images.unsplash.com/photo-1500039436846-25ae2f11882e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bG91dnJlJTIwbXVzZXVtJTIwcGFyaXMlMjBmcmFuY2V8ZW58MHx8MHx8fDA=' },
                { name: 'Notre Dame', img: 'https://media.gettyimages.com/id/508603364/photo/notre-dame-de-paris-at-sunset.jpg?s=612x612&w=0&k=20&c=f4tqur0Fw0DE_lUivN_Y5dZC4onNSukKjG2TUWdgvgg=' }
            ],
            hotels: [
                { name: 'Ritz Paris', price: '$800/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Hotel de Crillon', price: '$900/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Eiffel Tower & Seine', desc: 'Arrival and evening cruise on the Seine River. View the Eiffel Tower sparkle.' },
                { title: 'Day 2: Louvre & Montmartre', desc: 'Morning at the Louvre. Afternoon wandering the artistic streets of Montmartre.' },
                { title: 'Day 3: Versailles Day Trip', desc: 'Visit the Palace of Versailles and its magnificent gardens.' },
                { title: 'Day 4: Le Marais & Shopping', desc: 'Explore the trendy Le Marais district. Shopping at Galeries Lafayette.' },
                { title: 'Day 5: Au Revoir', desc: 'Coffee at a sidewalk cafe and departure.' }
            ]
        },
        'kerala': {
            name: 'Kerala Backwaters',
            duration: '4 Days / 3 Nights',
            price: '$350',
            mood: 'chill',
            budget: 'medium',
            category: 'nature',
            description: "God's Own Country. Drift through the serene backwaters on a traditional houseboat and enjoy authentic Kerala cuisine.",
            heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            inclusions: ['Houseboat Stay', 'All Meals (Kerala Cuisine)', 'Canoe Ride', 'Cultural Show'],
            lat: 9.9312, lng: 76.2673,
            weather: '30°C Humid',
            spots: [
                { name: 'Alleppey Backwaters', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80' },
                { name: 'Munnar Tea Gardens', img: 'https://media-cdn.tripadvisor.com/media/photo-o/11/3b/9d/57/munnar-tea-estates.jpg' },
                { name: 'Fort Kochi', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' }
            ],
            hotels: [
                { name: 'Kumarakom Lake Resort', price: '$200/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Spice Village', price: '$150/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Arrival in Alleppey', desc: 'Board your private houseboat. Cruise through the canals. Lunch on board.' },
                { title: 'Day 2: Backwater Life', desc: 'Watch the village life pass by. Visit a local toddy shop. Sunset canoe ride.' },
                { title: 'Day 3: Kumarakom Bird Sanctuary', desc: 'Visit the sanctuary. Evening Kathakali performance.' },
                { title: 'Day 4: Cochin drop', desc: 'Breakfast on the boat. Disembark and drive to Cochin airport.' }
            ]
        },
        'swiss': {
            name: 'Swiss Alps Adventure',
            duration: '7 Days / 6 Nights',
            price: '$1200',
            mood: 'adventure',
            budget: 'luxury',
            category: 'mountain',
            description: "The ultimate alpine experience. Snow-capped peaks, lush valleys, and chocolate box villages.",
            heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            inclusions: ['Swiss Travel Pass', '3 Star Hotels', 'Glacier Express Seat', 'Mountain Excursions'],
            lat: 46.8182, lng: 8.2275,
            weather: '8°C Fresh',
            spots: [
                { name: 'Matterhorn', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80' },
                { name: 'Lake Lucerne', img: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=600&q=80' },
                { name: 'Jungfraujoch', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80' }
            ],
            hotels: [
                { name: 'Badrutt\'s Palace', price: '$500/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Kulm Hotel', price: '$450/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Zurich to Lucerne', desc: 'Train to Lucerne. Walk the Chapel Bridge.' },
                { title: 'Day 2: Mt. Pilatus', desc: 'Cogwheel train to the top of Mt. Pilatus.' },
                { title: 'Day 3: Interlaken', desc: 'Scenic train to Interlaken. Boat ride on Lake Brienz.' },
                { title: 'Day 4: Jungfraujoch', desc: 'Top of Europe excursion.' },
                { title: 'Day 5: Zermatt', desc: 'Train to Zermatt. View the Matterhorn.' },
                { title: 'Day 6: Glacier Express', desc: 'The world\'s slowest express train to St. Moritz.' },
                { title: 'Day 7: Departure', desc: 'Train to Zurich airport.' }
            ]
        },
        'venice': {
            name: 'Venice Grand Canal',
            duration: '4 Days / 3 Nights',
            price: '$950',
            mood: 'cultural',
            budget: 'high',
            category: 'city',
            description: "Explore the floating city. Get lost in the maze of canals, bridges, and historic palazzos.",
            heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1283&q=80',
            inclusions: ['Canal View Hotel', 'Gondola Ride', 'Murano & Burano Tour', 'Vaporetto Pass'],
            lat: 45.4408, lng: 12.3155,
            weather: '18°C Sunny',
            spots: [
                { name: 'St. Mark\'s Square', img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&q=80' },
                { name: 'Doge\'s Palace', img: 'https://www.walksofitaly.com/blog/wp-content/uploads/2023/01/Walks-20170810-Legendary-Venice-2x3-0013.jpg' },
                { name: 'Burano', img: 'https://media.istockphoto.com/id/598224568/photo/venice-beach-skateboard-park-aerial-in-los-angeles.jpg?s=612x612&w=0&k=20&c=Iib1VVUFQLJEGc80G3nNmEcghnOJzdmXdz6LbuC-lWk=' }
            ],
            hotels: [
                { name: 'Hotel Danieli', price: '$600/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Gritti Palace', price: '$700/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Arrival by Water Taxi', desc: 'Arrive in style. Check in and evening walk at St. Mark\'s Square.' },
                { title: 'Day 2: Doge\'s Palace & Gondola', desc: 'Visit the Palace. Sunset Gondola ride.' },
                { title: 'Day 3: Islands Tour', desc: 'Visit the glass blowers of Murano and colorful Burano.' },
                { title: 'Day 4: Departure', desc: 'Morning coffee and departure.' }
            ]
        },
        'kedarnath': {
            name: 'Divine Kedarnath Trek',
            duration: '5 Days / 4 Nights',
            price: '$350',
            mood: 'cultural', // spiritual
            budget: 'low',
            category: 'mountain',
            description: "A spiritual journey to one of the holiest shrines in the Himalayas. Trek through breathtaking landscapes to reach the abode of Lord Shiva.",
            heroImage: 'https://www.chardham-pilgrimage-tour.com/assets/images/mahavatar-chardham.webp',
            inclusions: ['Guesthouse Stay', 'All Meals', 'Guide for Trek', 'Transport from Haridwar'],
            lat: 30.7352, lng: 79.0669,
            weather: '5°C Snowing',
            spots: [
                { name: 'Kedarnath Temple', img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80' },
                { name: 'Bhairav Nath', img: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80' },
                { name: 'Vasuki Tal', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80' }
            ],
            hotels: [
                { name: 'GMVN Guest House', price: '$50/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Kedar Resort', price: '$80/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Haridwar to Guptkashi', desc: 'Drive through the scenic Ganga valley. Overnight stay at Guptkashi.' },
                { title: 'Day 2: Trek to Kedarnath', desc: 'Drive to Sonprayag and start the 16km trek to Kedarnath. Darshan of the temple and evening Aarti.' },
                { title: 'Day 3: Kedarnath to Guptkashi', desc: 'Morning Darshan. Trek down to Sonprayag and drive back to Guptkashi.' },
                { title: 'Day 4: Rishikesh Stopover', desc: 'Drive to Rishikesh. Attend the Ganga Aarti at Parmarth Niketan.' },
                { title: 'Day 5: Departure', desc: 'Morning rafting (optional) and departure from Haridwar.' }
            ]
        },
        'varkala': {
            name: 'Varkala Cliff & Beach',
            duration: '3 Days / 2 Nights',
            price: '$200',
            mood: 'chill',
            budget: 'low',
            category: 'beach',
            description: "Where the cliffs meet the Arabian Sea. A laid-back beach destination with a bohemian vibe, perfect for sunsets and seafood.",
            heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Varkala-like
            inclusions: ['Cliff-top Resort', 'Breakfast', 'Yoga Session', 'Scooter Rental'],
            lat: 8.7379, lng: 76.7163,
            weather: '27°C Breeze',
            spots: [
                { name: 'Varkala Cliff', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80' },
                { name: 'Papanasam Beach', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=80' },
                { name: 'Janardanaswamy Temple', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' }
            ],
            hotels: [
                { name: 'The Gateway Hotel', price: '$150/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Clafouti Beach Resort', price: '$80/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Check-in & Sunset', desc: 'Arrive at Trivandrum and drive to Varkala. Watch a mesmerizing sunset from the cliff.' },
                { title: 'Day 2: Beach & Cafes', desc: 'Morning yoga. Spend the day at Papanasam Beach. Explore the vibrant cafes on the cliff.' },
                { title: 'Day 3: Kappil Lake & Departure', desc: 'Visit the serene Kappil Lake and estuary. Drive back to Trivandrum.' }
            ]
        },
        'jaipur': {
            name: 'Royal Jaipur',
            duration: '3 Days / 2 Nights',
            price: '$300',
            mood: 'cultural',
            budget: 'low',
            category: 'history',
            description: "The Pink City. Immerse yourself in the grandeur of forts, palaces, and vibrant bazaars. A colorful cultural explosion.",
            heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            inclusions: ['Heritage Hotel', 'Breakfast', 'Fort Entry Tickets', 'Chokhi Dhani Dinner'],
            lat: 26.9124, lng: 75.7873,
            weather: '32°C Sunny',
            spots: [
                { name: 'Hawa Mahal', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80' },
                { name: 'Amer Fort', img: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=600&q=80' },
                { name: 'City Palace', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80' }
            ],
            hotels: [
                { name: 'Rambagh Palace', price: '$400/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Jai Mahal Palace', price: '$300/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Amber Fort & Jal Mahal', desc: 'Visit the majestic Amber Fort. Photo stop at Jal Mahal. Evening shopping at Johari Bazaar.' },
                { title: 'Day 2: City Palace & Hawa Mahal', desc: 'Explore the City Palace and Hawa Mahal. Visit Jantar Mantar. Dinner at Chokhi Dhani.' },
                { title: 'Day 3: Nahargarh & Departure', desc: 'Morning drive to Nahargarh Fort for a city view. Departure.' }
            ]
        },
        'corbett': {
            name: 'Jim Corbett Wilderness',
            duration: '3 Days / 2 Nights',
            price: '$350',
            mood: 'adventure',
            budget: 'medium',
            category: 'nature',
            description: "India's oldest national park. Home to the majestic Bengal Tiger and diverse wildlife. A thrilling experience in the lap of nature.",
            heroImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Tiger/Forest
            inclusions: ['Jungle Resort Stay', 'All Meals', '2 Jeep Safaris', 'Nature Walk'],
            lat: 29.5300, lng: 78.7747,
            weather: '22°C Clear',
            spots: [
                { name: 'Dhikala Zone', img: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80' },
                { name: 'Kosi River', img: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=600&q=80' },
                { name: 'Garjiya Devi', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' }
            ],
            hotels: [
                { name: 'The Golden Tusk', price: '$180/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'Namah Resort', price: '$220/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Arrival & Riverside', desc: 'Arrive at Ramnagar. Check into your resort by the Kosi River. Evening bonfire and stories.' },
                { title: 'Day 2: Jungle Safari', desc: 'Early morning Jeep Safari in the core zone. Spot tigers, elephants, and deer. Afternoon nature walk.' },
                { title: 'Day 3: Garjiya Devi & Departure', desc: 'Visit the Garjiya Devi Temple. Departure.' }
            ]
        },
        'manali': {
            name: 'Snow-capped Manali',
            duration: '4 Days / 3 Nights',
            price: '$399',
            mood: 'adventure',
            budget: 'low',
            category: 'mountain',
            description: "Surrounded by high peaks in the beautiful valley of the Beas River, Manali is a gift of the Himalayas to the world. From snow-clad mountains to thick pinewood forests, it's the ultimate destination for adventure seekers and nature lovers.",
            heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
            inclusions: ['Mountain Resort Stay', 'Daily Breakfast', 'Solang Valley Visit', 'Airport Transfers'],
            lat: 32.2432, lng: 77.1892,
            weather: '5°C Snowy',
            spots: [
                { name: 'Solang Valley', img: 'https://hblimg.mmtcdn.com/content/hubble/img/manali/mmt/activities/m_activities-manali-solang-valley_l_400_640.jpg' },
                { name: 'Rohtang Pass', img: 'https://altitudeadventureindia.com/wp-content/uploads/2019/04/Rohtang_pass_Permit-AltitudeAdventureIndia2-300x225.jpg' },
                { name: 'Hadimba Temple', img: 'https://static2.tripoto.com/media/filter/tst/img/2138145/SpotDocument/1621034324_1621034295523.jpg.webp' }
            ],
            hotels: [
                { name: 'Span Resort', price: '$150/night', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
                { name: 'The Himalayan', price: '$120/night', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80' }
            ],
            itinerary: [
                { title: 'Day 1: Arrival in Manali', desc: 'Arrive at Bhuntar/Chandigarh and drive up to the mountains. Check into your cozy resort. Evening at leisure on Old Manali road.' },
                { title: 'Day 2: Solang Valley & Adventure', desc: 'Visit Solang Valley for paragliding and skiing. Enjoy the breathtaking views of the glaciers.' },
                { title: 'Day 3: Rohtang Pass Excursion', desc: 'A scenic drive to Rohtang Pass. Play in the snow and experience the high-altitude pass (subject to permits).' },
                { title: 'Day 4: Temple Visit & Departure', desc: 'Visit the peaceful Hadimba Temple. Local shopping at Mall Road and departure.' }
            ]
        }
    };

    // Load Details Logic for details.html
    if (window.location.pathname.includes('details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const locationKey = urlParams.get('location');

        if (locationKey && tripData[locationKey]) {
            const trip = tripData[locationKey];

            // Check if key elements exist before setting
            const setVal = (id, val) => { if (document.getElementById(id)) document.getElementById(id).innerText = val; };

            setVal('tripTitle', trip.name);
            setVal('tripDuration', trip.duration);
            setVal('tripPrice', trip.price);
            setVal('heroTitle', trip.name);
            setVal('heroSubtitle', `${trip.duration} | Starting from ${trip.price}`);
            setVal('whyThisTrip', trip.description);
            setVal('sidebarPrice', trip.price);

            // Background Image
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${trip.heroImage}')`;
            }

            // Render Itinerary
            const itineraryContainer = document.getElementById('itineraryContainer');
            if (itineraryContainer) {
                itineraryContainer.innerHTML = '';
                trip.itinerary.forEach((day, index) => {
                    const html = `
                        <div class="day-card" style="border-left: 4px solid var(--accent); padding-left: 20px; margin-bottom: 30px;">
                            <h4 style="color: var(--accent);">${day.title}</h4>
                            <p style="margin-top: 10px;">${day.desc}</p>
                        </div>
                    `;
                    itineraryContainer.innerHTML += html;
                });
            }

            // Render Inclusions
            const inclusionsContainer = document.getElementById('inclusionsList');
            if (inclusionsContainer) {
                inclusionsContainer.innerHTML = '';
                trip.inclusions.forEach(item => {
                    const html = `<li style="margin-bottom: 10px;"><i class="fas fa-check" style="color: var(--primary);"></i> ${item}</li>`;
                    inclusionsContainer.innerHTML += html;
                });
            }

        } else {
            // Fallback or Redirect if no valid location key
            // For now, let's just default to Darjeeling if missing/invalid to avoid broken page
            // window.location.href = 'discover.html'; 
        }
    }

    // ============================================
    // SEARCH & DESTINATION LOGIC
    // ============================================

    // 1. Handle Search Input (Home Page & Others)
    const searchInputs = document.querySelectorAll('.hero-search input, .hero-search button');
    // We attach listeners to the container or inputs
    const heroSearchBtn = document.querySelector('.hero-search button');
    const heroSearchInput = document.querySelector('.hero-search input');

    if (heroSearchBtn && heroSearchInput) {
        heroSearchBtn.addEventListener('click', () => {
            const query = heroSearchInput.value.trim();
            if (query) {
                window.location.href = `destination.html?query=${encodeURIComponent(query)}`;
            }
        });

        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = heroSearchInput.value.trim();
                if (query) {
                    window.location.href = `destination.html?query=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // 2. Destination Page Logic
    if (window.location.pathname.includes('destination.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');

        if (query) {
            loadDestinationDetails(query);
        } else {
            // Redirect back if no query
            window.location.href = 'index.html';
        }
    }

    function loadDestinationDetails(query) {
        const lowerQuery = query.toLowerCase();
        let destData = null;

        // 1. Check if we have exact data in tripData
        if (tripData[lowerQuery]) {
            const trip = tripData[lowerQuery];
            // Normalize tripData structure to match renderDestination expectation
            // renderDestination expects: { name, desc, image, lat, lng, weather, budget, spots: [], hotels: [] }
            // tripData has: { name, description, heroImage, lat, lng, weather, price, spots: [], hotels: [] }

            destData = {
                name: trip.name,
                desc: trip.description,
                image: trip.heroImage,
                lat: trip.lat || 20.5937, // Default to India center if missing
                lng: trip.lng || 78.9629,
                weather: trip.weather || '25°C Sunny',
                budget: trip.price, // Map price to budget display
                spots: trip.spots || [],
                hotels: trip.hotels || []
            };
        } else {
            // 2. Fallback to Procedural Generation
            destData = getMockDestination(lowerQuery);
        }

        // Render Data
        renderDestination(destData);

        // Initialize Map
        initializeMap(destData.lat, destData.lng, destData.name);

        // Calculate Distance if user allows location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    if (destData.lat && destData.lng) {
                        const dist = calculateDistance(userLat, userLng, destData.lat, destData.lng);
                        document.getElementById('destDist').innerText = `${dist} km`;
                        // Estimate time: Avg speed 60km/h
                        const hours = Math.ceil(dist / 60);
                        document.getElementById('destTime').innerText = `${hours} hrs (Drive)`;
                    } else {
                        document.getElementById('destDist').innerText = "--";
                        document.getElementById('destTime').innerText = "--";
                    }
                },
                (error) => {
                    document.getElementById('destDist').innerText = "Loc. Denied";
                    document.getElementById('destTime').innerText = "--";
                }
            );
        } else {
            document.getElementById('destDist').innerText = "Not Supported";
        }
    }

    function initializeMap(lat, lng, locationName) {
        // Check if map container exists
        const mapContainer = document.getElementById('destinationMap');
        if (!mapContainer) return;

        // Initialize the map
        const map = L.map('destinationMap').setView([lat, lng], 10);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Add a marker with popup
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<b>${locationName}</b><br>Explore this beautiful destination!`).openPopup();

        // Add a circle to highlight the area
        L.circle([lat, lng], {
            color: '#006064',
            fillColor: '#FF6F61',
            fillOpacity: 0.2,
            radius: 5000 // 5km radius
        }).addTo(map);
    }

    function getMockDestination(query) {
        // A. Curated Data (Examples)
        const curated = {
            'goa': {
                name: 'Goa',
                desc: 'Golden sands, swaying palms, and a vibe that never sleeps. The perfect beach escape.',
                image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
                lat: 15.2993, lng: 74.1240,
                weather: '28°C Sunny',
                budget: '$300 - $800',
                spots: [
                    { name: 'Baga Beach', img: 'https://images.unsplash.com/photo-1544974720-3b02213d298c?auto=format&fit=crop&w=600&q=80' },
                    { name: 'Dudhsagar Falls', img: 'https://images.unsplash.com/photo-1622306352011-8f5d0f62480b?auto=format&fit=crop&w=600&q=80' },
                    { name: 'Fort Aguada', img: 'https://images.unsplash.com/photo-1590422749877-f2369651c6b1?auto=format&fit=crop&w=600&q=80' }
                ],
                hotels: [
                    { name: 'The Leela Goa', price: '$250/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
                    { name: 'Goa Marriott', price: '$180/night', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' }
                ]
            }
        };

        if (curated[query]) return curated[query];

        // B. Procedural Generation (Smart Fallback)
        // Capitalize Name
        const name = query.charAt(0).toUpperCase() + query.slice(1);

        // Deterministic generic data based on name length/chars
        const seed = name.length;

        // Random generic images
        const landscapes = [
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Nature
            'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Bridge
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Mountains
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'  // Resort
        ];

        // Generate Details
        return {
            name: name,
            desc: `Experience the hidden gems of ${name}. Whether you are looking for relaxation or adventure, ${name} has something special for you.`,
            image: landscapes[seed % landscapes.length],
            lat: 20 + (seed * 2), lng: 70 + (seed), // Mock coords
            weather: `${20 + (seed % 10)}°C Clear`,
            budget: `$${100 + (seed * 50)} - $${500 + (seed * 50)}`,
            spots: [
                { name: `${name} City Center`, img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=600&q=80' },
                { name: `Historic ${name} Museum`, img: 'https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&w=600&q=80' },
                { name: `${name} Park`, img: 'https://images.unsplash.com/photo-1496347312930-9799e0483e9b?auto=format&fit=crop&w=600&q=80' }
            ],
            hotels: [
                { name: `Hotel ${name} Grand`, price: '$120/night', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
                { name: `${name} View Resort`, price: '$200/night', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' }
            ]
        };
    }

    function renderDestination(data) {
        // Safe check for elements
        if (!document.getElementById('destName')) return;

        // Hero
        document.getElementById('destName').innerText = data.name;
        document.getElementById('destDesc').innerText = data.desc;
        document.getElementById('destHero').style.backgroundImage = `url('${data.image}')`;

        // Logistics
        document.getElementById('destWeather').innerText = data.weather;
        document.getElementById('destBudget').innerText = data.budget;

        // Spots
        const spotsContainer = document.getElementById('spotsGrid');
        spotsContainer.innerHTML = '';
        data.spots.forEach(spot => {
            const html = `
                <div class="spot-card">
                    <img src="${spot.img}" alt="${spot.name}">
                    <div class="spot-info">
                        <h3>${spot.name}</h3>
                    </div>
                </div>
            `;
            spotsContainer.innerHTML += html;
        });
        document.getElementById('destNameSpan').innerText = data.name;

        // Hotels (Reuse trip-card style or custom)
        const hotelsContainer = document.getElementById('hotelsGrid');
        hotelsContainer.innerHTML = '';
        data.hotels.forEach(hotel => {
            const html = `
                <div class="trip-card">
                    <div class="trip-image">
                        <img src="${hotel.img}" alt="${hotel.name}">
                        <span class="trip-price">${hotel.price}</span>
                    </div>
                    <div class="trip-details">
                        <h3>${hotel.name}</h3>
                        <p>Top rated accommodation in ${data.name}.</p>
                        <a href="booking.html" class="btn btn-primary">Book Now</a>
                    </div>
                </div>
            `;
            hotelsContainer.innerHTML += html;
        });
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
    }

    function toRad(value) {
        return value * Math.PI / 180;
    }

    // Hero Slideshow Logic
    function startHeroSlideshow() {
        // Robust check: Only run if .hero-search exists (Home Page)
        const heroSection = document.querySelector('.hero');
        const isHomePage = document.querySelector('.hero-search');

        if (!heroSection || !isHomePage) return;

        const images = [
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Swiss (Cool)
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Beach (Warm)
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Mountain (Cool)
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'  // City (Warm)
        ];

        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            // Use linear-gradient to ensure text readability
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${images[currentIndex]}')`;
        }, 5000);
    }

    function renderTrendingTrips() {
        const trendingGrid = document.getElementById('trending-grid');
        if (!trendingGrid) return;

        const trendingKeys = ['darjeeling', 'goa', 'paris'];

        trendingGrid.innerHTML = ''; // Clear fallback content

        trendingKeys.forEach(key => {
            const trip = tripData[key];
            if (!trip) return;

            // Determine badge based on key/data (simple mapping)
            let badge = 'Featured';
            if (trip.mood) badge = trip.mood.charAt(0).toUpperCase() + trip.mood.slice(1);

            const html = `
                <div class="trip-card">
                    <div class="trip-image">
                        <img src="${trip.heroImage}" alt="${trip.name}">
                        <span class="trip-price">From ${trip.price}</span>
                    </div>
                    <div class="trip-details">
                        <div class="trip-meta">
                            <span><i class="fas fa-clock"></i> ${trip.duration}</span>
                            <span><i class="fas fa-star"></i> 4.8</span>
                        </div>
                        <h3>${trip.name}</h3>
                        <p>${trip.description.substring(0, 80)}...</p>
                        <div class="trip-footer">
                            <span class="badge" style="background: var(--bg-body); color: var(--text-muted); padding: 5px 10px; border-radius: 20px; font-size: 0.8rem;">${badge}</span>
                            <a href="details.html?location=${key}" class="btn btn-outline"
                                style="border-color: var(--primary); color: var(--primary);">View Journey</a>
                        </div>
                    </div>
                </div>
            `;
            trendingGrid.innerHTML += html;
        });
    }

    function renderDiscoverTrips() {
        const discoverGrid = document.querySelector('.trips-grid');
        // Only run on discover page (where .trips-grid exists but not trending-grid if checking specificity, 
        // but simpler to check pathname or if grid exists and it's not the trending one. 
        // Actually discover.html has .trips-grid, index.html has #trending-grid.trips-grid

        // Let's be specific to discover page
        if (!window.location.pathname.includes('discover.html') || !discoverGrid) return;

        discoverGrid.innerHTML = '';

        Object.keys(tripData).forEach(key => {
            const trip = tripData[key];

            // Icon mapping
            let icon = 'fa-map-marker-alt';
            if (trip.category === 'mountain') icon = 'fa-mountain';
            if (trip.category === 'beach') icon = 'fa-water';
            if (trip.category === 'city') icon = 'fa-city';
            if (trip.category === 'history') icon = 'fa-monument';
            if (trip.category === 'nature') icon = 'fa-tree';

            const html = `
                <div class="trip-card" data-mood="${trip.mood}" data-budget="${trip.budget}" data-category="${trip.category}">
                    <div class="trip-image">
                        <img src="${trip.heroImage}" alt="${trip.name}">
                        <span class="trip-price">From ${trip.price}</span>
                    </div>
                    <div class="trip-details">
                        <div class="trip-meta">
                            <span><i class="fas fa-clock"></i> ${trip.duration.split(' ')[0] + ' Days'}</span>
                            <span><i class="fas ${icon}"></i> ${trip.category.charAt(0).toUpperCase() + trip.category.slice(1)}</span>
                        </div>
                        <h3>${trip.name}</h3>
                        <p>${trip.description.substring(0, 100)}...</p>
                        <div class="trip-footer">
                            <a href="details.html?location=${key}" class="btn btn-outline"
                                style="border-color: var(--primary); color: var(--primary); width: 100%; text-align: center;">View
                                Journey</a>
                        </div>
                    </div>
                </div>
            `;
            discoverGrid.innerHTML += html;
        });

        // Re-initialize filtering listeners since we just injected new DOM elements? 
        // No, event delegation or existing references might work, but let's check.
        // The previous filter logic at line 65 selects .trip-card. 
        // If we replace them content, the `tripCards` variable (const) at line 65 will hold REFERENCES to OLD elements!
        // We need to re-select tripCards or move variable declaration inside specific scope/function.

        // We will need to update the filter logic to re-query the DOM.
        updateFilterLogic();

        // Handle URL Params for filtering (moved from legacy code)
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        const moodParam = urlParams.get('mood');
        const filterVal = (categoryParam || moodParam) ? (categoryParam || moodParam).toLowerCase() : null;

        if (filterVal) {
            const filterInputs = document.querySelectorAll('.filters input');
            // Uncheck all first
            if (filterInputs.length > 0) {
                filterInputs.forEach(i => i.checked = false);
                // Try to check matching box if it exists (visual sync)
                filterInputs.forEach(i => {
                    if (i.parentElement.innerText.toLowerCase().includes(filterVal)) {
                        i.checked = true;
                        // Trigger change event to run filter logic
                        i.dispatchEvent(new Event('change'));
                    }
                });
            }
        }
    }

    function updateFilterLogic() {
        const tripCards = document.querySelectorAll('.trip-card');
        const filterInputs = document.querySelectorAll('.filters input');

        const filterFunc = () => {
            const activeMoods = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked')).map(i => i.parentNode.innerText.toLowerCase().trim());
            const budgetRadios = document.querySelectorAll('input[name="budget"]:checked');
            let activeBudget = budgetRadios.length > 0 ? budgetRadios[0].parentNode.innerText.toLowerCase().trim() : null;

            tripCards.forEach(card => {
                const cardMood = (card.getAttribute('data-mood') || '').toLowerCase();
                const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
                const cardBudget = (card.getAttribute('data-budget') || '').toLowerCase();

                let isVisible = true;

                // Mood/Category Filter
                if (activeMoods.length > 0) {
                    const isMatch = activeMoods.some(m => {
                        return cardMood.includes(m) || cardCategory.includes(m) || m.includes(cardCategory) || m.includes(cardMood);
                    });
                    if (!isMatch) isVisible = false;
                }

                // Budget Filter
                // Logic: 
                // Under $500 -> 'low'
                // $500 - $1000 -> 'medium'
                // Luxury ($1000+) -> 'luxury' or 'high'
                if (activeBudget) {
                    let budgetMatch = false;
                    if (activeBudget.includes('under') && cardBudget === 'low') budgetMatch = true;
                    if (activeBudget.includes('$500 - $1000') && cardBudget === 'medium') budgetMatch = true;
                    if (activeBudget.includes('luxury') && (cardBudget === 'luxury' || cardBudget === 'high')) budgetMatch = true;

                    if (!budgetMatch) isVisible = false;
                }

                card.style.display = isVisible ? 'block' : 'none';
            });
        };

        // Re-attach listeners
        if (filterInputs.length > 0) {
            filterInputs.forEach(input => {
                // Remove old listener to avoid dupes? verify... unique events... 
                // easier to just assign onchange safely
                input.onchange = filterFunc;
            });
        }
    }

    // Start the slideshow
    startHeroSlideshow();
    renderDiscoverTrips(); // Render discovery first
    renderTrendingTrips();

    window.addEventListener('resize', checkAuthState);
});
