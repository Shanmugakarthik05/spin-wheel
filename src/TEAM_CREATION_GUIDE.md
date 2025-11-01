# Team Self-Registration Feature - Guide

## Overview
Participants can now create their own teams directly from the login page. Team names are automatically saved to the database and appear in the admin dashboard without any manual intervention required from the admin.

## How It Works

### For Participants

#### Creating a New Team
1. Navigate to the login page
2. Click on the **"Create Team"** tab
3. Enter your desired team name in the input field
4. Click **"Create Team"** button
5. Upon successful creation:
   - Team is automatically added to the database
   - Team is assigned to the current round
   - Success message appears
   - Participant can now switch to "Login" tab and login with their team name

#### Team Creation Validations
The system checks for:
- **Empty names**: Team name cannot be blank
- **Duplicate names**: Team name must be unique (case-insensitive)
- **Reserved names**: Cannot use "UXcellence" (admin password)

#### Error Messages
- "Please enter a team name" - if field is empty
- "This team name already exists. Please choose a different name." - if name is taken
- "This name is reserved. Please choose a different team name." - if trying to use admin password

#### Success Flow
1. Team created → Success toast notification
2. Switch to "Login" tab
3. Enter the same team name
4. Click "Login"
5. Access participant dashboard

### For Admins

#### Automatic Team Management
- Teams created by participants appear automatically in the Teams tab
- No manual team entry required
- Teams are added to the current active round
- Admin can still manually add teams if needed (legacy feature preserved)

#### Team Visibility
When a participant creates a team:
- Team instantly appears in Admin Dashboard → Teams tab
- Shows in the current round
- Has default status: "Waiting" (hasn't spun yet)
- Includes all standard team properties (ID, name, round, hasSpun status)

#### Admin Controls
Admins can still:
- View all created teams
- Delete teams manually
- Add teams manually (if needed)
- Manage team progression through rounds
- Mark and score teams

## Login Page UI

### Two Tabs Layout

#### 1. Login Tab (Default)
- **Purpose**: For existing teams and admin to login
- **Fields**: 
  - Team Name or Admin Password input
- **Hint Text**: "Don't have a team? Create one in the 'Create Team' tab."
- **Button**: "Login" (purple/pink gradient)

#### 2. Create Team Tab
- **Purpose**: For new participants to register their team
- **Fields**:
  - Choose Your Team Name input
- **Info Box**: 
  - Blue alert explaining automatic registration
  - Notes that team will be added to current round
  - Instructions to use Login tab after creation
- **Button**: "Create Team" (green/emerald gradient)

## Technical Details

### Team Creation Process

1. **Validation**:
   ```
   - Check if team name is not empty
   - Check if team name doesn't already exist
   - Check if team name is not "UXcellence"
   ```

2. **Team Object Creation**:
   ```typescript
   {
     id: `team-${Date.now()}`,  // Unique timestamp-based ID
     name: teamName,             // User-provided name
     round: currentRound,        // Current active round
     hasSpun: false              // Initially hasn't spun
   }
   ```

3. **Database Persistence**:
   - Team added to local state
   - Automatically saved to Supabase backend
   - Real-time sync ensures admin sees it immediately

### Database Updates
- **Immediate**: Teams are saved to database as soon as created
- **Automatic**: No manual admin approval required
- **Persistent**: Teams persist across page refreshes
- **Synced**: Real-time sync (every 3 seconds) ensures consistency

## User Flows

### New Participant Registration Flow
```
1. Open application
2. See login page
3. Click "Create Team" tab
4. Enter team name (e.g., "Team Phoenix")
5. Click "Create Team"
6. See success message
7. Click "Login" tab
8. Enter "Team Phoenix"
9. Click "Login"
10. Access participant dashboard
```

### Admin Monitoring Flow
```
1. Admin is logged in to dashboard
2. Participant creates team on login page
3. Within 3 seconds (or less), team appears in Admin Teams tab
4. Admin can see team with "Waiting" status
5. Admin can manage team (delete, advance rounds, mark, etc.)
```

## Benefits

### For Participants
- **Self-service**: Don't need to wait for admin to create teams
- **Instant access**: Create team and login immediately
- **Autonomy**: Choose own team names
- **Simple process**: Just 2 steps (create → login)

### For Admins
- **Less work**: No manual team entry needed
- **Automatic tracking**: All teams auto-populate in dashboard
- **Real-time updates**: See new teams as they're created
- **Focus on management**: Spend time on competition management, not data entry

### For Event Organizers
- **Scalability**: Can handle many teams registering simultaneously
- **Reduced bottleneck**: No admin bottleneck for team registration
- **Better UX**: Participants have smoother onboarding experience
- **Flexibility**: Both self-registration and manual entry available

## Important Notes

### Team Name Rules
- Must be unique (case-insensitive comparison)
- Cannot be empty/whitespace only
- Cannot use "UXcellence" (reserved for admin)
- Can include letters, numbers, spaces, special characters

### Round Assignment
- Teams are automatically assigned to the **current active round**
- If admin is on Round 2, new teams join Round 2
- Teams follow normal round progression rules

### Legacy Features Preserved
- Admin can still manually add teams through dashboard
- Manual team addition works exactly as before
- Both methods (self-registration + manual) coexist

### Security Considerations
- Team name uniqueness prevents impersonation
- Admin password ("UXcellence") is protected
- No authentication beyond team name (as per original design)

## Troubleshooting

### "Team name already exists"
- **Cause**: Another participant already registered with that name
- **Solution**: Choose a different team name

### Team not appearing in admin dashboard
- **Cause**: Sync delay (max 3 seconds)
- **Solution**: Wait a few seconds for real-time sync to update

### Cannot login after creating team
- **Cause**: Typing error (team name mismatch)
- **Solution**: Enter exact team name as created (case-insensitive)

## Future Enhancements

Potential improvements for future versions:
- Email/password authentication
- Team member management (multiple users per team)
- Team avatars/logos
- Team descriptions/profiles
- Registration approval workflow
- Team invitations
