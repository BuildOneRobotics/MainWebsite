document.addEventListener('DOMContentLoaded', function() {
    const addNewsBtn = document.getElementById('add-news-btn');
    const newsForm = document.getElementById('news-form');
    const articleForm = document.getElementById('article-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const newsArticles = document.getElementById('news-articles');

    // Show/hide news form
    addNewsBtn.addEventListener('click', function() {
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
        
        const title = document.getElementById('article-title').value;
        const date = document.getElementById('article-date').value;
        const content = document.getElementById('article-content').value;

        // Format date
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create new article element
        const newArticle = document.createElement('article');
        newArticle.className = 'news-article';
        newArticle.innerHTML = `
            <div class="article-date">${formattedDate}</div>
            <h2>${title}</h2>
            <p>${content}</p>
        `;

        // Insert at the beginning of news articles
        newsArticles.insertBefore(newArticle, newsArticles.firstChild);

        // Reset form and hide it
        articleForm.reset();
        newsForm.classList.add('hidden');
        addNewsBtn.style.display = 'inline-block';

        // Show success message
        alert('Article published successfully!');
    });

    // Set today's date as default
    document.getElementById('article-date').valueAsDate = new Date();
});