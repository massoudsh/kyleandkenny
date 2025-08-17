# 🚀 Deployment Guide - Vercel

## Prerequisites

1. **Database Setup**: Complete the database setup first
2. **Environment Variables**: Configure your `.env` file
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Step 1: Prepare for Deployment

### Update Environment Variables

Make sure your `.env` file has all required variables:

```bash
# Database
DATABASE_URL="your-database-url"

# Authentication
JWT_SECRET="your-secure-jwt-secret"
SESSION_SECRET="your-secure-session-secret"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-password"

# Site Configuration
SITE_URL="https://your-app.vercel.app"
```

### Test Locally

```bash
# Build the project
npm run build

# Test the build
npm run preview
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Login to Vercel
npx vercel login

# Deploy
npx vercel

# Deploy to production
npx vercel --prod
```

### Option B: Using Vercel Dashboard

1. **Push your code to GitHub**
2. **Go to [vercel.com](https://vercel.com)**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure environment variables**
6. **Deploy**

## Step 3: Configure Environment Variables in Vercel

In your Vercel dashboard:

1. **Go to your project settings**
2. **Navigate to "Environment Variables"**
3. **Add all variables from your `.env` file**

### Required Environment Variables:

```bash
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-admin-password
SITE_URL=https://your-app.vercel.app
```

## Step 4: Database Setup in Production

After deployment:

1. **Set up your production database** (Supabase/Railway)
2. **Update the DATABASE_URL in Vercel**
3. **Run database migrations**:

```bash
# Connect to your production database
npx prisma db push --schema=./prisma/schema.prisma
```

## Step 5: Create Admin User

After deployment, create your first admin user:

1. **Go to your deployed app**
2. **Navigate to `/auth/register`**
3. **Create an admin account**
4. **Or use the database directly to set admin role**

## Step 6: Custom Domain (Optional)

1. **In Vercel dashboard, go to "Domains"**
2. **Add your custom domain**
3. **Update DNS settings**
4. **Update SITE_URL environment variable**

## 🎉 Your App is Live!

Your application will be available at:
- **Development**: `https://your-app.vercel.app`
- **Production**: `https://yourdomain.com` (if custom domain)

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Automatic error logging
- **Uptime Monitoring**: 99.9% uptime guarantee

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection**: Check DATABASE_URL
2. **Build Errors**: Check build logs in Vercel
3. **Environment Variables**: Ensure all are set in Vercel
4. **CORS Issues**: Check CORS_ORIGIN setting

### Useful Commands:

```bash
# View deployment logs
npx vercel logs

# Redeploy
npx vercel --prod

# Check build locally
npm run build
```
