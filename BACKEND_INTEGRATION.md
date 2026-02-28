# Backend Integration Guide

## ✅ What Was Integrated

Your frontend now connects to all the new backend features:

### 1. **Authentication Backend**
- **Signup endpoint**: `POST /api/auth/signup`
  - Creates new user account with email, username, password, belt rank, academy
  - Response includes user object

- **Login endpoint**: `POST /api/auth/login`
  - OAuth2 compatible form submission
  - Returns JWT access token
  - Token stored in localStorage

- **Current user**: `GET /api/auth/me`
  - Requires Authorization header with Bearer token
  - Returns logged-in user data

**Frontend Implementation**: 
- `src/contexts/AuthContext.jsx` - Manages auth state and API calls
- `src/components/AuthModal.jsx` - Login/signup UI modal
- Automatically includes token in API requests

### 2. **Video Analysis Endpoints**
- **Upload & Auto-Analyze**: `POST /api/videos/upload`
  - Now with `auto_analyze=true` enabled by default
  - Returns analysis results immediately
  - Handles both `pose_analysis` and `llm_analysis` responses

**Frontend Updates**:
- `src/VideoAnalysisUI.jsx` now:
  - Uses authenticated user's ID for uploads
  - Sends `auto_analyze=true` with all uploads
  - Displays enhanced results (total frames, keypoints detected, etc.)
  - Shows detailed LLM analysis text
  - Handles both old and new API response formats

### 3. **BJJ Position Systems API**
- **Fetch systems**: `GET /api/positions/systems`
  - Returns all position maps (overview, closed guard, back control, mount)
  - Each system includes nodes, edges, and execution steps

**Frontend Updates**:
- `src/PositionsNetwork.jsx` now:
  - Fetches position data from backend
  - Falls back to local data if API unavailable
  - Passes authentication token when available

### 4. **Authentication UI**
- New login/signup modal in header
- User display with belt rank (coming soon)
- Logout functionality
- Session persistence via localStorage

## 📋 Setup Checklist

### Backend Requirements
Your backend needs these endpoints active:
- [ ] `POST /api/auth/signup` ✅
- [ ] `POST /api/auth/login` ✅
- [ ] `GET /api/auth/me` (requires implementation if missing)
- [ ] `POST /api/videos/upload` (with auto_analyze support) ✅
- [ ] `GET /api/positions/systems` ✅
- [ ] CORS configured for your frontend domain ✅

### Environment Variables (Frontend)
Set in Vercel or local `.env`:
```
VITE_API_URL=https://your-backend-url.com
```

Current: `bjj-social-backend-production.up.railway.app`

### Testing the Integration

**Local Development**:
```bash
npm run dev
```

**Test Flows**:
1. **Sign up**: Click "Login" button → Switch to "Sign up" tab
2. **Login**: Enter credentials
3. **Upload video**: Select video, click "Upload & Analyze"
4. **View analysis**: Results display automatically
5. **Browse positions**: Click "Positions Map" tab

## 🔄 API Response Formats

### Video Analysis Response
```json
{
  "video": {
    "id": "1",
    "user_id": "user123",
    "title": "Training",
    "video_url": "https://...",
    "uploaded_at": "2025-11-07T10:30:00"
  },
  "analysis": {
    "pose_analysis": {
      "dominant_position": "Closed Guard",
      "positions_detected": ["Standing", "Closed Guard", "Mount"],
      "total_frames": 300,
      "keypoints_detected": 17
    },
    "llm_analysis": {
      "success": true,
      "analysis": "Detailed breakdown...",
      "recommendations": ["Improve grip strength", "...]
    }
  }
}
```

### Position Systems Response
```json
{
  "overview": {
    "label": "FULL MAP",
    "description": "...",
    "nodes": [...],
    "edges": [...]
  },
  "closed_guard": { ... },
  "back_control": { ... },
  "mount": { ... }
}
```

## 🚀 Deployment

Your CI/CD pipeline (GitHub Actions) automatically:
1. Installs dependencies
2. Lints code
3. Builds the project
4. Deploys to Vercel

**Deploy with**: `git push origin main`

Once deployed, add your Vercel URL to the backend's CORS whitelist:
```
https://bjj-social-frontend.vercel.app
```

## ⚙️ Architecture

```
Frontend (Vite + React)
    ├── AuthContext (manages JWT tokens)
    ├── AuthModal (login/signup UI)
    ├── VideoAnalysisUI (upload & results)
    └── PositionsNetwork (interactive map)
         ↓
    API Layer (axios/fetch calls)
         ↓
Backend (FastAPI)
    ├── /api/auth/* (authentication)
    ├── /api/videos/* (upload & analysis)
    ├── /api/positions/* (position maps)
    └── Other routes (tournaments, seminars, etc.)
         ↓
    Services
    ├── AI Service (pose detection)
    ├── MotionLLM Service (video analysis)
    ├── Video Service (storage/R2)
    └── Database
```

## 🐛 Troubleshooting

### "Login failed" error
- Check backend is running: `curl https://your-backend-url/docs`
- Verify credentials are correct
- Check CORS settings on backend

### "Video upload 404"
- Backend server might be down
- Check `VITE_API_URL` environment variable
- Verify `/api/videos/upload` endpoint exists

### Position map not loading
- Check backend `/api/positions/systems` is accessible
- Inspect browser console for errors
- Try refreshing page

## 📚 Additional Resources

- Backend docs: Check `API_DOCUMENTATION.md` in backend repo
- Auth setup: See backend `AUTH_DOCUMENTATION.md`
- Position systems: See backend `POSITION_SYSTEMS_API.md`

---

**Next Steps**:
1. Ensure backend `/api/auth/me` endpoint is implemented
2. Test the full login → upload → analyze flow
3. Deploy to Vercel and test with production backend
4. Monitor errors in Vercel dashboard
