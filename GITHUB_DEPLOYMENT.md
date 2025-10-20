# 🚀 GitHub Deployment Guide for Kyle & Kenny

Your Astro Theme Pure project is now ready for deployment! This guide will help you deploy your blog to production.

## 📍 Your Repository

**Repository**: [https://github.com/massoudsh/kyleandkenny](https://github.com/massoudsh/kyleandkenny)

## 🎯 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Go to [vercel.com](https://vercel.com)** and sign in with your GitHub account
2. **Click "New Project"** and import your repository `massoudsh/kyleandkenny`
3. **Configure Environment Variables**:
   ```bash
   # Required
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=your-secure-jwt-secret-key
   SESSION_SECRET=your-secure-session-secret-key
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your-secure-admin-password
   
   # Optional
   SITE_URL=https://yourdomain.vercel.app
   SITE_NAME=Kyle & Kenny Blog
   SITE_DESCRIPTION=Meet your creators, Kyle & Kenny
   ```
4. **Deploy** - Vercel will automatically build and deploy your site!

### Option 2: Netlify

1. **Go to [netlify.com](https://netlify.com)** and connect your GitHub repository
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add Environment Variables** in Netlify dashboard
4. **Deploy** your site

### Option 3: Railway

1. **Go to [railway.app](https://railway.app)** and create a new project
2. **Connect GitHub** and select your repository
3. **Add PostgreSQL** database service
4. **Configure Environment Variables**
5. **Deploy** your application

## 🗄️ Database Setup

### For Vercel (Recommended)

1. **Add Vercel Postgres**:
   - In your Vercel project dashboard
   - Go to Storage tab
   - Add Postgres database
   - Copy the connection string to `DATABASE_URL`

2. **Run Database Setup**:
   ```bash
   # In Vercel dashboard, add these build commands:
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

### For Other Platforms

Use any PostgreSQL database service:
- **Supabase** (free tier available)
- **Railway Postgres**
- **AWS RDS**
- **Google Cloud SQL**

## 🔐 Environment Variables Setup

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key"
SESSION_SECRET="your-super-secure-session-secret-key"

# Admin Account
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-admin-password"
```

### Optional Variables

```bash
# Site Configuration
SITE_URL="https://yourdomain.com"
SITE_NAME="Kyle & Kenny Blog"
SITE_DESCRIPTION="Meet your creators, Kyle & Kenny"

# Email (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"

# Security
CORS_ORIGIN="https://yourdomain.com"
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

## 🎨 Customization

### Update Site Information

Edit `src/site.config.ts` to customize:

```typescript
export const theme: ThemeUserConfig = {
  title: 'Kyle & Kenny Blog',
  author: 'Kyle & Kenny',
  description: 'Meet your creators, Kyle & Kenny',
  // ... other configurations
}
```

### Add Your Content

1. **Blog Posts**: Add markdown files to `src/content/blog/`
2. **Pages**: Create new pages in `src/pages/`
3. **Images**: Add images to `src/assets/` or `public/`

## 🔧 Local Development

If you want to run locally:

```bash
# Clone your repository
git clone https://github.com/massoudsh/kyleandkenny.git
cd kyleandkenny

# Install dependencies
npm install

# Set up environment
npm run setup:env

# Set up database (requires PostgreSQL)
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

## 📱 Admin Panel

Once deployed, access your admin panel at:
- `https://yourdomain.com/admin`

**Default Admin Credentials**:
- Email: `admin@yourdomain.com` (or whatever you set in ADMIN_EMAIL)
- Password: The password you set in ADMIN_PASSWORD

## 🎯 Features Available

Your deployed blog will have:

- ✅ **User Authentication & Registration**
- ✅ **Admin Dashboard**
- ✅ **Blog Post Management**
- ✅ **Comment System**
- ✅ **Search Functionality**
- ✅ **Responsive Design**
- ✅ **SEO Optimization**
- ✅ **Analytics Ready**
- ✅ **Security Features**

## 🔄 Automatic Deployments

Your GitHub repository is set up with:
- **GitHub Actions CI/CD** pipeline
- **Automatic deployments** on push to main branch
- **Build testing** and validation

## 📞 Support

If you need help:
- Check the [SETUP.md](./SETUP.md) for detailed setup instructions
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced deployment options
- Open an issue on your GitHub repository

## 🎉 You're All Set!

Your Astro Theme Pure blog is now production-ready and deployed! 

**Next Steps**:
1. Deploy to your preferred platform
2. Set up your database
3. Configure environment variables
4. Customize your content
5. Share your blog with the world!

---

**Happy Blogging! 🚀**

*Kyle & Kenny would be proud!*
