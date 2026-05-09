# Guest Planner - Deployment Guide

This project is configured for deployment to Vercel.

## Local Development

1. Install dependencies:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

2. Run both client and server:
```bash
npm run dev
```

The client will run on `http://localhost:5174` and the server on `http://localhost:5000`.

## Deployment to Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

### Steps

1. **Push to Git**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Select "Other" as the framework (since we have a custom setup)

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add variable `VITE_API_URL` with value: `https://your-project.vercel.app/api`
   - (Replace `your-project` with your actual Vercel project name)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your project

### Important Notes

- **Database**: The current implementation uses SQLite in-memory database. This means:
  - Data is **NOT persisted** between deployments
  - Perfect for testing/demo purposes
  - For production, migrate to a cloud database like PostgreSQL or MongoDB

- **API Routes**: API endpoints are served from `/api/guests`

- **CORS**: Currently configured to accept requests from all origins

## Production Considerations

For production use, consider:
1. **Database Migration**: Switch to a persistent database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Add proper authentication beyond password checking
3. **CORS Security**: Restrict origins to your frontend domain
4. **Error Logging**: Set up error tracking (Sentry, etc.)
5. **Rate Limiting**: Add rate limiting to API endpoints

## Troubleshooting

- **API not connecting**: Check that `VITE_API_URL` environment variable is set correctly
- **Build fails**: Ensure all dependencies are installed in both `client/` and `server/` directories
- **Port conflicts**: If ports 5000 or 5174 are in use, modify `.env` or package.json scripts
