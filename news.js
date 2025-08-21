document.addEventListener('DOMContentLoaded', function() {
    let isAdmin = false;
    let articles = [];

    // DOM elements
    const adminModal = document.getElementById('admin-modal');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const closeModal = document.getElementById('close-modal');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    const addNewsBtn = document.getElementById('add-news-btn');
    const newsForm = document.getElementById('news-form');
    const articleForm = document.getElementById('article-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const newsArticles = document.getElementById('news-articles');

    // Show admin modal
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            adminModal.classList.remove('hidden');
        });
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            adminModal.classList.add('hidden');
        });
    }

    // Close modal on outside click
    adminModal.addEventListener('click', function(e) {
        if (e.target === adminModal) {
            adminModal.classList.add('hidden');
        }
    });

    // Admin login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'bensteels' && password === 'bensteels123') {
                isAdmin = true;
                adminModal.classList.add('hidden');
                if (adminPanel) adminPanel.classList.remove('hidden');
                loadArticles();
                // Update admin button text
                if (adminLoginBtn) adminLoginBtn.textContent = 'Logout';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            isAdmin = false;
            adminPanel.classList.add('hidden');
            if (newsForm) newsForm.classList.add('hidden');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            if (adminLoginBtn) adminLoginBtn.textContent = 'Admin';
        });
    }

    // Handle admin button click when logged in
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (isAdmin) {
                // Logout
                isAdmin = false;
                if (adminPanel) adminPanel.classList.add('hidden');
                if (newsForm) newsForm.classList.add('hidden');
                adminLoginBtn.textContent = 'Admin';
            } else {
                // Show login modal
                adminModal.classList.remove('hidden');
            }
        });
    }

    // Show/hide news form
    if (addNewsBtn) {
        addNewsBtn.addEventListener('click', function() {
            if (!isAdmin) return;
            newsForm.classList.remove('hidden');
            addNewsBtn.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            newsForm.classList.add('hidden');
            if (addNewsBtn) addNewsBtn.style.display = 'inline-block';
            if (articleForm) articleForm.reset();
        });
    }

    // Handle form submission
    if (articleForm) {
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

            // Create article object
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

            // Reset form and hide it
            articleForm.reset();
            newsForm.classList.add('hidden');
            if (addNewsBtn) addNewsBtn.style.display = 'inline-block';

            alert('Article published successfully!');
        });
    }

    // Load articles from localStorage
    function loadArticles() {
        const saved = localStorage.getItem('buildone_articles');
        if (saved) {
            articles = JSON.parse(saved);
        }
        renderArticles();
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
            articleElement.style.fontFamily = article.fontFamily;
            articleElement.style.fontSize = article.fontSize;
            
            // Make article clickable if it has a URL
            if (article.url) {
                articleElement.style.cursor = 'pointer';
                articleElement.addEventListener('click', function() {
                    window.open(article.url, '_blank');
                });
            }
            
            articleElement.innerHTML = `
                <div class="article-date">${article.date}</div>
                <h2>${article.title}</h2>
                <p>${article.preview}</p>
                <div class="article-actions">
                    ${isAdmin ? `<button class="delete-btn" onclick="deleteArticle(${article.id})">Delete</button>` : ''}
                </div>
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

    // Set today's date as default
    const articleDateInput = document.getElementById('article-date');
    if (articleDateInput) {
        articleDateInput.valueAsDate = new Date();
    }

    // Load articles on page load
    const saved = localStorage.getItem('buildone_articles');
    if (saved) {
        articles = JSON.parse(saved);
        renderArticles();
    }
});