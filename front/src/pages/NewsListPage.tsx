/**
 * NewsListPage - Single Responsibility: Display all news articles
 * Following KISS principle - simple list view
 */
import NewsPage from '@/components/NewsPage';
import { useArticles } from '@/hooks/useArticles';

export default function NewsListPage() {
  const { articles } = useArticles();

  return (
    <NewsPage 
      articles={articles}
    />
  );
}
