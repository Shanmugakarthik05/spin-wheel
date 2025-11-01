# UXcellence Data Persistence Guide

## What Changed

The UXcellence app now uses **Supabase backend persistence** instead of just browser memory. This means:

✅ **Teams are now accessible across different browsers/devices**
✅ **When admin adds a team, anyone can log in with that team name**
✅ **All game state (teams, questions, rounds) is saved to a database**
✅ **Real-time updates: Changes sync every 3 seconds**

## How It Works

### 1. Backend API (Server)
Located in `/supabase/functions/server/index.tsx`

**Endpoints:**
- `GET /make-server-8ff233bb/state` - Fetches all game data (teams, questions, rounds)
- `POST /make-server-8ff233bb/teams` - Saves teams to database
- `POST /make-server-8ff233bb/questions` - Saves questions to database
- `POST /make-server-8ff233bb/currentRound` - Saves current round
- `POST /make-server-8ff233bb/rounds` - Saves round configurations

### 2. Frontend Changes

**Initial Load:**
- App fetches all data from backend on startup
- Shows loading spinner while fetching

**Auto-Sync:**
- Every 3 seconds, the app polls the backend for updates
- All users see changes made by admin in real-time

**Automatic Team Login:**
- When participant tries to log in, they can enter team name
- If team exists in database → Login successful ✅
- If team doesn't exist yet → Shows "Team not found" with option to go back
- **NEW:** If admin adds the team while user is on error screen, the page auto-refreshes and logs them in!

### 3. Admin Workflow

1. Admin logs in with "UXcellence"
2. Admin adds teams → **Automatically saved to database**
3. Admin adds questions → **Automatically saved to database**
4. Admin advances rounds → **Automatically saved to database**

### 4. Participant Workflow

1. Participant receives team name from admin
2. Admin adds team in dashboard
3. Participant opens link and enters team name
4. **Auto-login happens** because team now exists in database!
5. Participant can spin wheel and get question
6. All actions sync across all devices

## Benefits

✅ **Share link works instantly** - No need to reload
✅ **Multi-device support** - Admin and participants can use different devices
✅ **Persistent state** - Data survives browser refresh
✅ **Real-time sync** - Everyone sees updates within 3 seconds
✅ **No manual refresh needed** - Automatic polling handles updates

## Technical Details

- **Storage:** Supabase Key-Value Store
- **Sync Interval:** 3 seconds (configurable in App.tsx line 49)
- **Error Handling:** Toast notifications for failed operations
- **Loading States:** Spinner shown during initial data load
