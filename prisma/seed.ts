import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample tags
  const tags = [
    { name: 'Technology', slug: 'technology', description: 'Posts about technology and programming' },
    { name: 'Web Development', slug: 'web-development', description: 'Posts about web development' },
    { name: 'Astro', slug: 'astro', description: 'Posts about Astro framework' },
    { name: 'Tutorial', slug: 'tutorial', description: 'Tutorial posts' },
    { name: 'News', slug: 'news', description: 'News and updates' }
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag
    })
  }

  console.log('✅ Sample tags created')

  // Create sample categories
  const categories = [
    { name: 'Programming', slug: 'programming', description: 'Programming related content' },
    { name: 'Design', slug: 'design', description: 'Design related content' },
    { name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step tutorials' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('✅ Sample categories created')

  // Create sample post
  const samplePost = await prisma.post.upsert({
    where: { slug: 'welcome-to-astro-theme-pure' },
    update: {},
    create: {
      title: 'Welcome to Astro Theme Pure',
      slug: 'welcome-to-astro-theme-pure',
      content: `# Welcome to Astro Theme Pure

This is a sample post to demonstrate the capabilities of Astro Theme Pure. This theme provides:

- **Fast Performance**: Built with Astro for optimal speed
- **Modern Design**: Clean and responsive design
- **Rich Features**: Comments, search, and more
- **Easy Customization**: Flexible configuration options

## Getting Started

1. Configure your environment variables
2. Set up your database
3. Customize your site configuration
4. Start writing content!

Happy blogging! 🚀`,
      excerpt: 'A sample post to demonstrate the capabilities of Astro Theme Pure.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: adminUser.id
    }
  })

  console.log('✅ Sample post created:', samplePost.title)

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'Astro Theme Pure', type: 'string' },
    { key: 'site_description', value: 'A simple, fast and powerful blog theme built by Astro', type: 'string' },
    { key: 'posts_per_page', value: '10', type: 'number' },
    { key: 'enable_comments', value: 'true', type: 'boolean' },
    { key: 'enable_search', value: 'true', type: 'boolean' }
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type },
      create: setting
    })
  }

  console.log('✅ Site settings created')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
