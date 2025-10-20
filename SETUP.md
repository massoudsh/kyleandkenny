# Astro Theme Pure - Quick Setup Guide

This guide will help you get your Astro Theme Pure blog up and running quickly.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
# Run the automated setup script
npm run setup:env

# Or manually copy env.example to .env and configure
cp env.example .env
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push database schema (requires DATABASE_URL in .env)
npm run db:push

# Seed with initial data
npm run db:seed
```

### 4. Start Development

```bash
npm run dev
```

Your site will be available at `http://localhost:4321`

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **Database** (PostgreSQL recommended)
- **Git** for version control

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Database (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# Authentication (Required)
JWT_SECRET="your-secure-jwt-secret"
SESSION_SECRET="your-secure-session-secret"

# Admin (Required)
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-admin-password"

# Site Configuration
SITE_URL="https://yourdomain.com"
SITE_NAME="Your Blog Name"
SITE_DESCRIPTION="Your blog description"
```

### Site Configuration

Edit `src/site.config.ts` to customize:

- Site title and description
- Navigation menu
- Footer links
- Social media links
- Theme colors and fonts

## 🗄️ Database Setup

### Local Development

1. **Install PostgreSQL**
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   createdb astro_theme_pure
   ```

3. **Update .env**
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/astro_theme_pure"
   ```

### Production

Use a managed database service:
- **Vercel Postgres** (recommended for Vercel deployments)
- **Railway Postgres**
- **AWS RDS**
- **Google Cloud SQL**
- **Supabase**

## 📝 Content Management

### Adding Blog Posts

1. Create new markdown files in `src/content/blog/`
2. Use the frontmatter format:

```yaml
---
title: "Your Post Title"
description: "Post description"
pubDate: "2024-01-01"
heroImage: "/path/to/image.jpg"
tags: ["tag1", "tag2"]
---

# Your Post Content

Write your content here...
```

### Admin Panel

Access the admin panel at `/admin` (requires authentication):

- Manage posts
- Moderate comments
- View analytics
- Manage users

## 🎨 Customization

### Theme Customization

1. **Colors**: Edit `src/assets/styles/app.css`
2. **Layout**: Modify components in `src/components/`
3. **Pages**: Customize pages in `src/pages/`

### Components

The theme includes many reusable components:

- **Basic**: `Aside`, `Tabs`, `Timeline`, `Steps`
- **Advanced**: `GithubCard`, `LinkPreview`, `Quote`, `QRCode`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment with database
- **AWS**: EC2 or Lambda deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:check    # Start with type checking

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Fix linting issues
npm run format       # Format code
npm run check        # Type checking

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Utilities
npm run clean        # Clean build artifacts
npm run sync         # Sync content collections
```

## 📚 Documentation

- [Astro Documentation](https://docs.astro.build)
- [Astro Theme Pure Docs](https://astro-pure.js.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is running
   - Verify credentials

2. **Build Failures**
   - Check Node.js version (18+ required)
   - Clear node_modules and reinstall
   - Check TypeScript errors

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Ensure HTTPS in production

### Getting Help

- [GitHub Issues](https://github.com/cworld1/astro-theme-pure/issues)
- [Astro Discord](https://astro.build/chat)
- [Documentation](https://astro-pure.js.org/docs)

## 🎉 Next Steps

1. **Customize your site** - Update colors, fonts, and layout
2. **Add content** - Write your first blog posts
3. **Configure integrations** - Set up comments, analytics, etc.
4. **Deploy** - Push to production
5. **Share** - Show off your new blog!

---

Happy blogging! 🚀
