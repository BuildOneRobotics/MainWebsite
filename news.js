document.addEventListener('DOMContentLoaded', function() {
    let isAdmin = false;
    let articles = [];

    // Load articles from localStorage on page load
    loadArticles();
    renderArticles();

    // DOM elements
    const adminModal = document.getElementById('admin-modal');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const closeModal = document.getElementById('close-modal');
    const loginForm = document.getElementById('login-form');
    const newsArticles = document.getElementById('news-articles');
    
    // Admin elements (created dynamically)
    let adminPanel = null;
    let newsForm = null;
    let articleForm = null;
    let addNewsBtn = null;
    let cancelBtn = null;
    let logoutBtn = null;

    // Show admin modal when clicking Admin button
    function handleAdminButtonClick(e) {
        e.preventDefault();
        if (isAdmin) {
            // If already logged in, logout
            logout();
        } else {
            // Show login modal
            if (adminModal) {
                adminModal.classList.remove('hidden');
            }
        }
    }
    
    // Attach event listener to admin button
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', handleAdminButtonClick);
    }
    
    // Also handle admin button on homepage if it exists
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'admin-login-btn') {
            handleAdminButtonClick(e);
        }
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            adminModal.classList.add('hidden');
            clearLoginForm();
        });
    }

    // Close modal on outside click
    if (adminModal) {
        adminModal.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                adminModal.classList.add('hidden');
                clearLoginForm();
            }
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'bensteels' && password === 'bensteels123') {
                // Successful login
                isAdmin = true;
                adminModal.classList.add('hidden');
                createAdminInterface();
                // Update all admin buttons
                document.querySelectorAll('#admin-login-btn').forEach(btn => {
                    btn.textContent = 'Logout';
                });
                clearLoginForm();
                renderArticles(); // Re-render to show admin controls
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Logout function
    function logout() {
        isAdmin = false;
        removeAdminInterface();
        // Update all admin buttons
        document.querySelectorAll('#admin-login-btn').forEach(btn => {
            btn.textContent = 'Admin';
        });
        clearLoginForm();
        renderArticles(); // Re-render to hide admin controls
    }

    // Clear login form
    function clearLoginForm() {
        if (document.getElementById('username')) document.getElementById('username').value = '';
        if (document.getElementById('password')) document.getElementById('password').value = '';
    }

    // Create admin interface dynamically
    function createAdminInterface() {
        if (adminPanel) return; // Already created
        
        const container = document.querySelector('.news-content .container');
        
        // Create admin panel
        adminPanel = document.createElement('div');
        adminPanel.id = 'admin-panel';
        adminPanel.className = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-header">
                <h3>Admin Panel</h3>
                <button id="logout-btn" class="logout-btn">Logout</button>
            </div>
            <button id="add-news-btn" class="admin-btn">Add News Article</button>
        `;
        
        // Create news form
        newsForm = document.createElement('div');
        newsForm.id = 'news-form';
        newsForm.className = 'news-form hidden';
        newsForm.innerHTML = `
            <h3>Add New Article</h3>
            <form id="article-form">
                <input type="text" id="article-title" placeholder="Article Title" required>
                <input type="date" id="article-date" required>
                <textarea id="article-preview" placeholder="Article preview (shown on news page)..." rows="3" required></textarea>
                <input type="url" id="article-url" placeholder="Full article URL (optional)">
                
                <div class="formatting-options">
                    <label>Font Family:</label>
                    <select id="font-family">
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
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
                    <button type="button" id="cancel-btn">Cancel</button>
                </div>
            </form>
        `;
        
        // Insert before news articles
        container.insertBefore(adminPanel, newsArticles);
        container.insertBefore(newsForm, newsArticles);
        
        // Get references to new elements
        addNewsBtn = document.getElementById('add-news-btn');
        articleForm = document.getElementById('article-form');
        cancelBtn = document.getElementById('cancel-btn');
        logoutBtn = document.getElementById('logout-btn');
        
        // Add event listeners
        logoutBtn.addEventListener('click', logout);
        
        addNewsBtn.addEventListener('click', function() {
            if (!isAdmin) return;
            newsForm.classList.remove('hidden');
            addNewsBtn.style.display = 'none';
        });
        
        cancelBtn.addEventListener('click', function() {
            newsForm.classList.add('hidden');
            addNewsBtn.style.display = 'inline-block';
            articleForm.reset();
        });
        
        articleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!isAdmin) return;

            const title = document.getElementById('article-title').value;
            const date = document.getElementById('article-date').value;
            const preview = document.getElementById('article-preview').value;
            const url = document.getElementById('article-url').value;
            const fontFamily = document.getElementById('font-family').value;
            const fontSize = document.getElementById('font-size').value;

            // Format date
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Create article
            const article = {
                id: Date.now(),
                title,
                date: formattedDate,
                preview,
                url,
                fontFamily,
                fontSize
            };

            // Add to articles array
            articles.unshift(article);
            
            // Save to localStorage
            localStorage.setItem('buildone_articles', JSON.stringify(articles));

            // Render articles
            renderArticles();

            // Reset and hide form
            articleForm.reset();
            newsForm.classList.add('hidden');
            addNewsBtn.style.display = 'inline-block';

            alert('Article published successfully!');
        });
        
        // Set today's date as default
        const articleDateInput = document.getElementById('article-date');
        if (articleDateInput) {
            articleDateInput.valueAsDate = new Date();
        }
    }
    
    // Remove admin interface
    function removeAdminInterface() {
        if (adminPanel) {
            adminPanel.remove();
            adminPanel = null;
        }
        if (newsForm) {
            newsForm.remove();
            newsForm = null;
        }
        addNewsBtn = null;
        articleForm = null;
        cancelBtn = null;
        logoutBtn = null;
    }

    // Load articles from localStorage
    function loadArticles() {
        const saved = localStorage.getItem('buildone_articles');
        if (saved) {
            articles = JSON.parse(saved);
        }
    }

    // Render articles
    function renderArticles() {
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
            
            // Make article clickable if it has a URL
            if (article.url) {
                articleElement.style.cursor = 'pointer';
                articleElement.addEventListener('click', function(e) {
                    // Don't trigger if clicking on delete button
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

    // Delete article function (global scope)
    window.deleteArticle = function(id) {
        if (!isAdmin) return;
        
        if (confirm('Are you sure you want to delete this article?')) {
            articles = articles.filter(article => article.id !== id);
            localStorage.setItem('buildone_articles', JSON.stringify(articles));
            renderArticles();
        }
    };


});