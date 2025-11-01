# 🔄 Reset & Round Control Features Guide

## Overview
The UXcellence app now includes comprehensive reset and round control features that give admins full control over the game flow.

## New Features

### 1. 🎯 Complete Round Dialog
When completing a round, admins now have two options:

#### **Try Again**
- Resets the current round
- Teams can spin the wheel again
- Same questions remain available
- **Marks are preserved** for record-keeping
- All question assignments are cleared
- All teams' `hasSpun` status is reset

#### **Go to Next Round**
- Advances top teams to the next round
- Teams are ranked by their marks (highest first)
- Only specified number of teams advance
- Non-advancing teams stay in current round
- Advancing teams get fresh start (can spin again)

### 2. 🔄 Reset Current Round
Accessible from the Round Control tab with "Reset Round" button.

**What it does:**
- ✅ Clears all question assignments for current round
- ✅ Unlocks all questions in current round
- ✅ Resets all teams' spin status
- ✅ **Preserves team marks** (for historical tracking)
- ✅ Teams can participate again immediately

**Use cases:**
- Practice rounds
- Testing the system
- Redo a round due to technical issues
- Give teams another chance

### 3. 🔁 Reset All Rounds
Accessible from Settings → "Reset All Rounds" button.

**What it does:**
- ⚠️ Moves ALL teams back to Round 1
- ⚠️ Unlocks ALL questions in all rounds
- ⚠️ Clears ALL marks and feedback
- ⚠️ Resets current round to 1
- ⚠️ Complete system restart

**Use cases:**
- Starting a new competition
- Complete system reset
- Testing from scratch
- New batch of participants

## UI Locations

### Complete Round Dialog
1. Navigate to **"Round Control"** tab
2. Enter number of teams to advance
3. Click **"Complete Round X & Advance Teams"**
4. Dialog appears with two options:
   - **Cancel**: Don't do anything
   - **Try Again**: Reset current round (orange button)
   - **Go to Next Round**: Advance teams (green button)

### Reset Current Round
1. Navigate to **"Round Control"** tab
2. Click **"Reset Round"** button (orange, with rotation icon)
3. Confirm in dialog
4. Round is reset immediately

### Reset All Rounds
1. Click **"Settings"** button (top right)
2. Scroll to bottom of settings dialog
3. Click **"Reset All Rounds"** button (red, destructive)
4. Confirm the action (cannot be undone)
5. Entire system resets to Round 1

## Visual Indicators

### Round Control Statistics
Three key metrics displayed:
- **Total Teams**: Number of teams in current round
- **Teams with Questions**: How many have been assigned
- **Teams Marked**: How many have received evaluation

### Color Coding
- 🟢 **Green**: Advance to next round (positive action)
- 🟡 **Orange**: Try again / Reset current round (caution)
- 🔴 **Red**: Reset all rounds (destructive action)

## Workflow Examples

### Example 1: Practice Round
```
1. Teams spin and get questions
2. Admin realizes it's just a test
3. Click "Complete Round" → "Try Again"
4. Teams can spin again with same questions
```

### Example 2: Normal Progression
```
1. Teams spin and get questions
2. Admin marks all teams in "Marks" tab
3. Click "Complete Round" → "Go to Next Round"
4. Top 10 teams advance to Round 2
5. Round 2 begins fresh
```

### Example 3: Technical Issue Mid-Round
```
1. Round 2 is in progress
2. Technical issue occurs
3. Click "Reset Round" button
4. All teams can spin again
5. Their Round 2 marks are preserved
```

### Example 4: New Competition
```
1. Previous competition ended
2. Open Settings
3. Click "Reset All Rounds"
4. Confirm reset
5. Fresh start - all teams in Round 1
```

## Safety Features

### Confirmation Dialogs
All destructive actions require confirmation:
- ✅ Reset current round
- ✅ Reset all rounds
- ✅ Complete round (with options)

### Data Preservation
- **Reset Current Round**: Preserves marks
- **Reset All Rounds**: Clears everything (by design)

### Visual Warnings
- Orange buttons: Caution (reversible)
- Red buttons: Danger (data loss)
- Clear descriptions in all dialogs

## Technical Details

### Reset Current Round
```typescript
// Teams in current round
- hasSpun: false
- assignedQuestionId: undefined
- marks: PRESERVED ✓
- reason: PRESERVED ✓

// Questions in current round
- isLocked: false
- assignedToTeamId: undefined
```

### Reset All Rounds
```typescript
// All teams
- round: 1
- hasSpun: false
- assignedQuestionId: undefined
- marks: undefined (CLEARED)
- reason: undefined (CLEARED)

// All questions
- isLocked: false
- assignedToTeamId: undefined

// System
- currentRound: 1
```

### Team Advancement Sorting
```typescript
Teams sorted by:
1. Marks (descending) - highest first
2. Teams with marks before unmarked teams
3. Original order for unmarked teams
```

## Best Practices

### ✅ DO:
- Mark teams before advancing rounds
- Use "Try Again" for practice/testing
- Export data before "Reset All Rounds"
- Communicate with teams before resets
- Use round statistics to track progress

### ❌ DON'T:
- Reset all rounds during active competition
- Forget to export important data
- Reset without communicating to teams
- Use "Try Again" when you mean to advance
- Skip marking teams before advancement

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Dialog | `Esc` |
| Confirm (Dialog open) | `Enter` |

## Error Prevention

### Disabled States
- Complete Round button disabled if teams haven't spun
- Input validation for team count
- Confirmation required for all resets

### Toast Notifications
- ✅ Success: Action completed
- ℹ️ Info: Important information
- ⚠️ Warning: Caution required
- ❌ Error: Action failed

## Data Persistence

All reset actions are:
- ✅ Saved to Supabase database
- ✅ Synced across all devices
- ✅ Reflected in real-time (3s polling)
- ✅ Persistent across browser refresh

## Troubleshooting

### "Complete Round" button is disabled
- Ensure all teams have been assigned questions
- Check Round Control tab statistics

### Teams not advancing correctly
- Verify marks are entered in "Marks" tab
- Check team count input is valid number
- Review sort order (highest marks first)

### Reset not working
- Check internet connection
- Verify Supabase connection
- Look for error toast messages
- Refresh browser and try again

---

**Status**: ✅ Fully Implemented & Production Ready
