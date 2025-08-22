document.addEventListener('DOMContentLoaded', function() {
    let isAdmin = false;
    let articles = [];

    // Check if admin is already logged in
    checkAdminSession();
    
    // Load articles from online storage on page load
    loadArticles().then(() => {
        renderArticles();
    });
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup real-time syncing
    setupRealTimeSync();

    // Admin elements (created dynamically)
    let adminPanel = null;
    let newsForm = null;

    // Handle admin button clicks (works on all pages)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'admin-login-btn') {
            e.preventDefault();
            if (isAdmin) {
                logout();
            } else {
                showLoginModal();
            }
        }
        
        // Handle modal close
        if (e.target && e.target.id === 'close-modal') {
            hideLoginModal();
        }
        
        // Handle modal backdrop click
        if (e.target && e.target.id === 'admin-modal') {
            hideLoginModal();
        }
    });

    // Handle login form submission
    document.addEventListener('submit', function(e) {
        if (e.target && e.target.id === 'login-form') {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'bensteels' && password === 'bensteels123') {
                // Successful login
                isAdmin = true;
                // Save admin session
                sessionStorage.setItem('buildone_admin', 'true');
                hideLoginModal();
                createAdminInterface();
                updateAdminButtons('Logout');
                renderArticles();
                alert('Login successful!');
            } else {
                alert('Invalid credentials');
            }
        }
    });

    function showLoginModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    function hideLoginModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        clearLoginForm();
    }

    function clearLoginForm() {
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        if (username) username.value = '';
        if (password) password.value = '';
    }

    function updateAdminButtons(text) {
        document.querySelectorAll('#admin-login-btn').forEach(btn => {
            btn.textContent = text;
        });
    }

    function logout() {
        isAdmin = false;
        // Clear admin session
        sessionStorage.removeItem('buildone_admin');
        removeAdminInterface();
        updateAdminButtons('Admin');
        renderArticles();
    }
    
    function checkAdminSession() {
        // Check if admin session exists
        if (sessionStorage.getItem('buildone_admin') === 'true') {
            isAdmin = true;
            updateAdminButtons('Logout');
            // Only create admin interface if on news page
            if (document.getElementById('news-articles')) {
                createAdminInterface();
            }
        }
    }

    function createAdminInterface() {
        if (adminPanel) return;
        
        const container = document.querySelector('.news-content .container');
        if (!container) return;
        
        // Create admin panel
        adminPanel = document.createElement('div');
        adminPanel.className = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-header">
                <h3>Admin Panel</h3>
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>
            <button onclick="showNewsForm()" class="admin-btn">Add News Article</button>
        `;
        
        // Create news form
        newsForm = document.createElement('div');
        newsForm.className = 'news-form hidden';
        newsForm.innerHTML = `
            <h3>Add New Article</h3>
            <form onsubmit="submitArticle(event)">
                <input type="text" id="article-title" placeholder="Article Title" required>
                <input type="date" id="article-date" required>
                <textarea id="article-preview" placeholder="Article preview..." rows="3" required></textarea>
                <input type="url" id="article-url" placeholder="Full article URL (optional)">
                
                <div class="formatting-options">
                    <label>Font Family:</label>
                    <select id="font-family">
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                    </select>
                    
                    <label>Font Size:</label>
                    <select id="font-size">
                        <option value="0.9rem">Small</option>
                        <option value="1rem" selected>Medium</option>
                        <option value="1.1rem">Large</option>
                    </select>
                </div>
                
                <div class="form-buttons">
                    <button type="submit">Publish Article</button>
                    <button type="button" onclick="hideNewsForm()">Cancel</button>
                </div>
            </form>
        `;
        
        const newsArticles = document.getElementById('news-articles');
        container.insertBefore(adminPanel, newsArticles);
        container.insertBefore(newsForm, newsArticles);
        
        // Set today's date
        setTimeout(() => {
            const dateInput = document.getElementById('article-date');
            if (dateInput) {
                dateInput.valueAsDate = new Date();
            }
        }, 100);
    }

    function removeAdminInterface() {
        if (adminPanel) {
            adminPanel.remove();
            adminPanel = null;
        }
        if (newsForm) {
            newsForm.remove();
            newsForm = null;
        }
    }

    // Global functions for admin interface
    window.logout = logout;
    
    window.showNewsForm = function() {
        if (newsForm) {
            newsForm.classList.remove('hidden');
            // Hide the add button
            const addBtn = adminPanel.querySelector('.admin-btn');
            if (addBtn) addBtn.style.display = 'none';
        }
    };
    
    window.hideNewsForm = function() {
        if (newsForm) {
            newsForm.classList.add('hidden');
            // Show the add button again
            const addBtn = adminPanel.querySelector('.admin-btn');
            if (addBtn) addBtn.style.display = 'inline-block';
            // Clear form
            const form = newsForm.querySelector('form');
            if (form) form.reset();
        }
    };
    
    window.submitArticle = function(e) {
        e.preventDefault();
        if (!isAdmin) return;

        const title = document.getElementById('article-title').value;
        const date = document.getElementById('article-date').value;
        const preview = document.getElementById('article-preview').value;
        const url = document.getElementById('article-url').value;
        const fontFamily = document.getElementById('font-family').value;
        const fontSize = document.getElementById('font-size').value;

        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const article = {
            id: Date.now(),
            title,
            date: formattedDate,
            preview,
            url: url || null,
            fontFamily,
            fontSize
        };

        articles.unshift(article);
        saveArticles();
        renderArticles();
        hideNewsForm();
        alert('Article published successfully!');
    };

    window.deleteArticle = function(id) {
        if (!isAdmin) return;
        
        if (confirm('Are you sure you want to delete this article?')) {
            articles = articles.filter(article => article.id !== id);
            saveArticles();
            renderArticles();
        }
    };

    async function loadArticles() {
        try {
            // Use a simple GitHub Gist for cross-user storage
            const response = await fetch('https://api.github.com/gists/abc123def456', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const gist = await response.json();
                const content = gist.files['articles.json'].content;
                articles = JSON.parse(content);
            } else {
                // Fallback to localStorage
                const saved = localStorage.getItem('buildone_articles');
                if (saved) {
                    articles = JSON.parse(saved);
                }
            }
        } catch (error) {
            console.log('Loading from localStorage as fallback');
            const saved = localStorage.getItem('buildone_articles');
            if (saved) {
                articles = JSON.parse(saved);
            }
        }
    }
    
    async function saveArticles() {
        // For now, just save locally - GitHub API requires authentication
        localStorage.setItem('buildone_articles', JSON.stringify(articles));
        
        // Broadcast to other tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'buildone_articles',
            newValue: JSON.stringify(articles)
        }));
    }

    function renderArticles() {
        const newsArticles = document.getElementById('news-articles');
        if (!newsArticles) return;
        
        newsArticles.innerHTML = '';
        
        if (articles.length === 0) {
            newsArticles.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.5); padding: 3rem;">No articles published yet.</p>';
            return;
        }

        articles.forEach(article => {
            const articleElement = document.createElement('article');
            articleElement.className = 'news-article';
            articleElement.style.fontFamily = article.fontFamily || 'Inter';
            articleElement.style.fontSize = article.fontSize || '1rem';
            
            if (article.url) {
                articleElement.style.cursor = 'pointer';
                articleElement.addEventListener('click', function(e) {
                    if (e.target.classList.contains('delete-btn')) return;
                    window.open(article.url, '_blank');
                });
            }
            
            articleElement.innerHTML = `
                <div class="article-date">${article.date}</div>
                <h2>${article.title}</h2>
                <p>${article.preview}</p>
                ${isAdmin ? `<div class="article-actions"><button class="delete-btn" onclick="deleteArticle(${article.id})">Delete</button></div>` : ''}
            `;

            newsArticles.appendChild(articleElement);
        });
    }
    
    function setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenuBtn.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            navLinks.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') {
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        }
    }
    
    function setupRealTimeSync() {
        // Poll for updates every 30 seconds
        setInterval(async function() {
            const currentCount = articles.length;
            await loadArticles();
            if (articles.length !== currentCount) {
                renderArticles();
            }
        }, 30000);
        
        // Listen for localStorage changes from other tabs
        window.addEventListener('storage', function(e) {
            if (e.key === 'buildone_articles') {
                const saved = localStorage.getItem('buildone_articles');
                if (saved) {
                    articles = JSON.parse(saved);
                    renderArticles();
                }
            }
        });
    }
});