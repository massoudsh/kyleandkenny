#!/bin/bash

# Setup environment variables for Astro Theme Pure

echo "Setting up environment variables..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/astro_theme_pure"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
SESSION_SECRET="your-session-secret-key-change-this-in-production"

# Admin Configuration
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-admin-password"

# Email Configuration (for password reset, notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@yourdomain.com"

# File Upload Configuration
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="5242880"
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,image/webp"

# Site Configuration
SITE_URL="https://yourdomain.com"
SITE_NAME="Astro Theme Pure"
SITE_DESCRIPTION="A simple, fast and powerful blog theme built by Astro"

# Security Configuration
CORS_ORIGIN="https://yourdomain.com"
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
GOOGLE_TAG_MANAGER_ID="GTM_ID"

# Social Media (optional)
TWITTER_HANDLE="@yourhandle"
GITHUB_USERNAME="yourusername"
LINKEDIN_URL="https://linkedin.com/in/yourprofile"

# Development Configuration
NODE_ENV="development"
PORT="4321"
DEBUG="true"

# Cache Configuration
CACHE_TTL="3600"
REDIS_URL="redis://localhost:6379"

# Search Configuration
SEARCH_INDEX_PATH="data/search-index"
SEARCH_RESULTS_LIMIT="20"

# Backup Configuration
BACKUP_DIR="backups"
BACKUP_RETENTION_DAYS="30"
EOF
    echo "✅ Created .env file"
else
    echo "⚠️  .env file already exists"
fi

# Generate secure secrets
echo "Generating secure secrets..."

# Generate JWT secret
if command -v openssl &> /dev/null; then
    JWT_SECRET=$(openssl rand -hex 32)
    SESSION_SECRET=$(openssl rand -hex 32)
    
    # Update .env file with secure secrets
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=\"$JWT_SECRET\"/" .env
    sed -i.bak "s/SESSION_SECRET=.*/SESSION_SECRET=\"$SESSION_SECRET\"/" .env
    rm .env.bak
    
    echo "✅ Generated secure JWT and Session secrets"
else
    echo "⚠️  OpenSSL not found. Please manually update JWT_SECRET and SESSION_SECRET in .env"
fi

echo ""
echo "🚀 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update database connection string in .env"
echo "2. Configure email settings in .env"
echo "3. Update site configuration in .env"
echo "4. Run 'npm run setup:db' to set up the database"
echo ""
echo "⚠️  Remember to keep your .env file secure and never commit it to version control!"
