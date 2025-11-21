export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  featured: boolean;
  date: string;
  readTime: string;
}

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Actualités': 'bg-blue-600',
    'Musique': 'bg-purple-600',
    'Émissions': 'bg-green-600',
    'Événements': 'bg-orange-600',
    'Interviews': 'bg-red-600',
    'Culture': 'bg-pink-600',
    'Sport': 'bg-indigo-600',
    'Technologie': 'bg-cyan-600'
  };
  return colors[category] || 'bg-gray-600';
};