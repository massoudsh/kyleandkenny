# Deployment Guide for Astro Theme Pure

This guide will help you deploy your Astro Theme Pure blog to production.

## Prerequisites

- Node.js 18.0.0 or higher
- A database (PostgreSQL recommended)
- A deployment platform (Vercel, Netlify, etc.)

## Quick Start

### 1. Environment Setup

```bash
# Run the environment setup script
npm run setup:env

# Or manually create .env file with the following variables:
# DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
# JWT_SECRET="your-secure-jwt-secret"
# SESSION_SECRET="your-secure-session-secret"
# ADMIN_EMAIL="admin@yourdomain.com"
# ADMIN_PASSWORD="your-secure-admin-password"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 3. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Options

### Vercel (Recommended)

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Astro

2. **Configure environment variables**
   - In your Vercel dashboard, go to Settings > Environment Variables
   - Add all the variables from your `.env` file
   - Make sure to use production values for sensitive data

3. **Database setup**
   - Use Vercel Postgres or any external PostgreSQL database
   - Update your `DATABASE_URL` in Vercel environment variables
   - Run database migrations in production

4. **Deploy**
   - Push to your main branch
   - Vercel will automatically deploy

### Netlify

1. **Connect your repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Use the following build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

2. **Configure environment variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add all required environment variables

3. **Deploy**
   - Push to your main branch
   - Netlify will automatically build and deploy

### Railway

1. **Connect your repository**
   - Go to [railway.app](https://railway.app)
   - Create a new project from GitHub repository

2. **Add database**
   - Add PostgreSQL service
   - Copy the database URL to your environment variables

3. **Deploy**
   - Railway will automatically detect and deploy your Astro app

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
JWT_SECRET="your-secure-jwt-secret-key"
SESSION_SECRET="your-secure-session-secret-key"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-admin-password"
```

### Optional Variables

```bash
# Site Configuration
SITE_URL="https://yourdomain.com"
SITE_NAME="Your Site Name"
SITE_DESCRIPTION="Your site description"

# Email (for password reset, notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"

# Security
CORS_ORIGIN="https://yourdomain.com"
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Analytics
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
GOOGLE_TAG_MANAGER_ID="GTM_ID"
```

## Database Management

### Production Database Setup

1. **Create a production database**
   - Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
   - Or use Vercel Postgres, Railway Postgres, etc.

2. **Run migrations**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to production database
   DATABASE_URL="your-production-database-url" npm run db:push
   
   # Seed with initial data
   DATABASE_URL="your-production-database-url" npm run db:seed
   ```

### Database Maintenance

```bash
# View your database in Prisma Studio
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset database (development only)
npx prisma migrate reset
```

## Security Checklist

- [ ] Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- [ ] Use HTTPS in production
- [ ] Set secure admin password
- [ ] Configure CORS_ORIGIN for your domain
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Use environment variables for all sensitive data
- [ ] Never commit .env files to version control

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build

# Check for unused dependencies
npm audit
```

### Runtime Optimization

- Enable image optimization in `astro.config.ts`
- Use CDN for static assets
- Configure caching headers
- Enable compression

## Monitoring and Analytics

### Error Monitoring

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### Health Checks

Create a health check endpoint:

```typescript
// src/pages/api/health.ts
export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Verify credentials

2. **Build failures**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Check for TypeScript errors

3. **Authentication issues**
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Ensure HTTPS in production

### Getting Help

- Check the [Astro documentation](https://docs.astro.build)
- Review [Prisma documentation](https://www.prisma.io/docs)
- Open an issue on the repository

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Monitor database performance
- [ ] Review and rotate secrets quarterly
- [ ] Backup database regularly
- [ ] Monitor error logs

### Updates

```bash
# Update dependencies
npm update

# Update Astro
npm install astro@latest

# Update Prisma
npm install prisma@latest @prisma/client@latest
```

## Support

For additional support:
- GitHub Issues: [Create an issue](https://github.com/cworld1/astro-theme-pure/issues)
- Documentation: [Astro Theme Pure Docs](https://astro-pure.js.org/docs)
- Community: [Astro Discord](https://astro.build/chat)
