document.addEventListener('DOMContentLoaded', function() {
    let isAdmin = false;
    let articles = [];

    // DOM elements
    const adminLogin = document.getElementById('admin-login');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    const addNewsBtn = document.getElementById('add-news-btn');
    const newsForm = document.getElementById('news-form');
    const articleForm = document.getElementById('article-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const newsArticles = document.getElementById('news-articles');

    // Admin login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'bensteels' && password === 'bensteels123') {
            isAdmin = true;
            adminLogin.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            loadArticles();
        } else {
            alert('Invalid credentials');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        isAdmin = false;
        adminLogin.classList.remove('hidden');
        adminPanel.classList.add('hidden');
        newsForm.classList.add('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });

    // Show/hide news form
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

    // Handle form submission
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
        addNewsBtn.style.display = 'inline-block';

        alert('Article published successfully!');
    });

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
            
            articleElement.innerHTML = `
                <div class="article-date">${article.date}</div>
                <h2>${article.title}</h2>
                <p>${article.preview}</p>
                <div class="article-actions">
                    ${article.url ? `<a href="${article.url}" target="_blank" class="read-more-btn">Read Full Article</a>` : ''}
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
    document.getElementById('article-date').valueAsDate = new Date();

    // Load articles on page load (for non-admin view)
    if (!isAdmin) {
        const saved = localStorage.getItem('buildone_articles');
        if (saved) {
            articles = JSON.parse(saved);
            renderArticles();
        }
    }
});