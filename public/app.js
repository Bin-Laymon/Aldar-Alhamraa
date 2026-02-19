const t = {
  en: {
    heroTitle: 'Digital Storytelling Marketplace',
    heroBody: 'Browse immersive narrative PDFs and support independent writers.',
    featured: 'Featured Stories',
    marketplace: 'Marketplace'
  },
  ar: {
    heroTitle: 'سوق القصص الرقمية',
    heroBody: 'اكتشف ملفات PDF سردية وادعم الكتّاب المستقلين.',
    featured: 'قصص مميزة',
    marketplace: 'السوق'
  }
};

let currentLang = 'en';

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t[currentLang][el.dataset.i18n];
  });
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langToggle').textContent = currentLang === 'en' ? 'AR' : 'EN';
}

async function fetchStories() {
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;
  const maxPrice = document.getElementById('maxPrice').value;
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sort) params.set('sort', sort);
  if (maxPrice) params.set('maxPrice', maxPrice);

  const res = await fetch(`/api/stories?${params.toString()}`);
  const stories = await res.json();

  const categories = [...new Set(stories.map((s) => s.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  const existing = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach((c) => {
    categoryFilter.innerHTML += `<option value="${c}">${c}</option>`;
  });
  categoryFilter.value = existing;

  const featured = stories.filter((s) => s.is_featured);
  renderStories(document.getElementById('featuredStories'), featured);
  renderStories(document.getElementById('stories'), stories);
}

function renderStories(target, stories) {
  if (!stories.length) {
    target.innerHTML = '<p class="meta">No stories available.</p>';
    return;
  }

  target.innerHTML = stories.map((story) => `
    <article class="story">
      <h4>${story.title}</h4>
      <p class="meta">${story.category} • $${story.price}</p>
      <p>${story.description || ''}</p>
      <p class="meta">${story.writer_name} • ★ ${Number(story.avg_rating).toFixed(1)}</p>
    </article>
  `).join('');
}

document.getElementById('langToggle').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyTranslations();
});

document.getElementById('applyFilters').addEventListener('click', fetchStories);
applyTranslations();
fetchStories();
