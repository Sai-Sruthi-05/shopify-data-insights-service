echo "🚀 Starting deployment process..."

echo "📦 Building application..."
npm run build

case "$1" in
  "vercel")
    echo "🌐 Deploying to Vercel..."
    npm run deploy:vercel
    ;;
  "railway")
    echo "🚂 Deploying to Railway..."
    npm run deploy:railway
    ;;
  "render")
    echo "🎨 Deploying to Render..."
    npm run deploy:render
    ;;
  "heroku")
    echo "🟣 Deploying to Heroku..."
    git add .
    git commit -m "Deploy to Heroku"
    git push heroku main
    ;;
  *)
    echo "❌ Please specify deployment target: vercel, railway, render, or heroku"
    echo "Usage: ./scripts/deploy.sh [vercel|railway|render|heroku]"
    exit 1
    ;;
esac

echo "✅ Deployment completed!"