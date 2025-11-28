import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding themes...');

  // Default/Classic Theme
  const classicTheme = await prisma.theme.upsert({
    where: { slug: 'classic' },
    update: {},
    create: {
      name: 'Classique',
      slug: 'classic',
      description: 'Thème par défaut de SN-Radio avec des couleurs bleues et oranges',
      primaryColor: '#007EFF',
      secondaryColor: '#FFBB62',
      backgroundColor: '#12171C',
      favicon: '/favicon.ico',
      icon: '/icon.png',
      logo: '/logo.png',
      siteName: 'SN-Radio',
      isActive: true,
    },
  });

  console.log('✅ Created Classic theme:', classicTheme.name);

  // Christmas Theme
  const christmasTheme = await prisma.theme.upsert({
    where: { slug: 'christmas' },
    update: {},
    create: {
      name: 'Noël',
      slug: 'christmas',
      description: 'Thème festif pour la période de Noël avec des couleurs rouge et vert',
      primaryColor: '#DC2626',
      secondaryColor: '#059669',
      backgroundColor: '#0F1419',
      favicon: '/favicon.ico',
      icon: '/icon.png',
      logo: '/logo.png',
      siteName: 'SN-Radio 🎄',
      isActive: false,
    },
  });

  console.log('✅ Created Christmas theme:', christmasTheme.name);

  // Dark Theme
  const darkTheme = await prisma.theme.upsert({
    where: { slug: 'dark' },
    update: {},
    create: {
      name: 'Sombre',
      slug: 'dark',
      description: 'Thème sombre minimaliste pour une expérience nocturne',
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#0A0A0B',
      favicon: '/favicon.ico',
      icon: '/icon.png',
      logo: '/logo.png',
      siteName: 'SN-Radio',
      isActive: false,
    },
  });

  console.log('✅ Created Dark theme:', darkTheme.name);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding themes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
