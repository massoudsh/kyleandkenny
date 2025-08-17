# 🗄️ Database Setup Guide

## Option 1: Supabase (Recommended - Free)

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up for a free account**
3. **Create a new project**
4. **Get your database URL from Settings > Database**
5. **Update your `.env` file:**

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Option 2: Railway (Free Tier)

1. **Go to [Railway](https://railway.app)**
2. **Sign up and create a new project**
3. **Add PostgreSQL service**
4. **Copy the connection URL**
5. **Update your `.env` file**

## Option 3: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create database
createdb astro_blog

# Update .env
DATABASE_URL="postgresql://localhost:5432/astro_blog"
```

## 🔧 Database Setup Commands

After setting up your database URL, run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Create admin user (optional)
npx prisma studio
```

## 🔐 Security Setup

Update your `.env` file with secure secrets:

```bash
# Generate secure JWT secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Generate session secret
SESSION_SECRET="your-session-secret-key-change-this-in-production"

# Set admin credentials
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-admin-password"
```

## 🚀 Next Steps

1. **Set up your database URL**
2. **Run the database commands above**
3. **Test the application locally**
4. **Deploy to Vercel**
