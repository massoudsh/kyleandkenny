#!/bin/bash

echo "🚀 Astro Blog - Quick Setup Script"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your database URL and secrets."
    echo ""
    echo "🔧 Required steps:"
    echo "1. Edit .env file with your database URL"
    echo "2. Set JWT_SECRET and SESSION_SECRET"
    echo "3. Configure admin credentials"
    echo ""
    read -p "Press Enter after you've configured .env file..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Check if database is configured
if grep -q "your-database-url" .env; then
    echo "⚠️  Please configure your DATABASE_URL in .env file"
    echo "   See setup-database.md for instructions"
    exit 1
fi

# Push database schema
echo "🗄️ Setting up database..."
npx prisma db push

# Build the project
echo "🔨 Building project..."
npm run build

# Test the build
echo "🧪 Testing build..."
npm run preview &
PREVIEW_PID=$!

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Your app should be running at: http://localhost:4321"
echo ""
echo "🚀 To deploy to Vercel:"
echo "   1. npx vercel login"
echo "   2. npx vercel"
echo "   3. npx vercel --prod"
echo ""
echo "📚 See deploy.md for detailed deployment instructions"
echo ""

# Wait for user to stop preview
echo "Press Ctrl+C to stop the preview server..."
wait $PREVIEW_PID
