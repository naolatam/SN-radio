import { useState } from 'react';
import AdminLayout from './admin/AdminLayout';
import ArticlesSection from './admin/ArticlesSection';
import CategoriesSection from './admin/CategoriesSection';
import MembersSection from './admin/MembersSection';
import ThemeSection from './admin/ThemeSection';

interface AdminPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function AdminPage({ onBack, onLogout }: AdminPageProps) {
  const [activeSection, setActiveSection] = useState('articles');

  const renderSection = () => {
    switch (activeSection) {
      case 'articles':
        return <ArticlesSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'members':
        return <MembersSection />;
      case 'theme':
        return <ThemeSection />;
      default:
        return <ArticlesSection />;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onBack={onBack}
      onLogout={onLogout}
    >
      {renderSection()}
    </AdminLayout>
  );
}
