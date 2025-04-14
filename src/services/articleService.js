const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const TIMEOUT_DURATION = 5000;
const cache = new Map();

const withTimeout = (promise) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_DURATION)
    )
  ]);
};

// Simulated data store
let articles = [
  {
    id: 1,
    title: 'Getting Started with React',
    content: 'React is a popular JavaScript library...',
    language: 'english',
    publishDate: '2024-04-14',
    status: 'Published'
  },
  {
    id: 2,
    title: 'ری ایکٹ کے ساتھ شروع کریں',
    content: 'ری ایکٹ ایک مقبول جاوا اسکرپٹ لائبریری ہے...',
    language: 'urdu',
    publishDate: '2024-04-14',
    status: 'Draft'
  }
];

export const getArticles = async () => {
  try {
    if (cache.has('articles')) {
      return cache.get('articles');
    }
    await delay(500);
    const data = [...articles];
    cache.set('articles', data);
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles');
  }
};

export const createArticle = async (article) => {
  await delay(500);
  const newArticle = {
    ...article,
    id: articles.length + 1,
  };
  articles.push(newArticle);
  return newArticle;
};

export const deleteArticle = async (id) => {
  await delay(500);
  articles = articles.filter(article => article.id !== id);
  return id;
};

export const updateArticle = async (id, updatedArticle) => {
  await delay(500);
  articles = articles.map(article => 
    article.id === id ? { ...article, ...updatedArticle } : article
  );
  return updatedArticle;
};