# Team Selection for Round Advancement - Feature Guide

## Overview
The admin can now manually select which teams advance to the next round using checkboxes. Unselected teams are automatically deleted from the database and won't have access to future rounds.

## How It Works

### 1. **Team Selection (Teams Tab)**
- Each team in the Teams tab now has a checkbox (visible only in Rounds 1 & 2)
- Admin can select/deselect individual teams by clicking the checkbox
- A "Select All" checkbox at the top allows selecting/deselecting all teams at once
- Selection status is displayed: "X of Y teams selected"
- Selected teams show a green badge: "X team(s) will advance"

### 2. **Round Control Tab**
- Shows a summary of selected teams with their names as badges
- Displays a warning about how many unselected teams will be deleted
- The "Complete Round & Advance Selected Teams" button is only enabled when:
  - All teams have been assigned questions
  - At least one team is selected

### 3. **Completing a Round**
When the admin clicks "Complete Round & Advance Selected Teams":

1. **Confirmation Dialog** appears with three sections:
   - **Try Again**: Reset the round and let teams spin again
   - **Go to Next Round**: Advance the selected teams
   - **Warning**: Shows how many unselected teams will be deleted

2. **If "Go to Next Round" is clicked**:
   - Selected teams are moved to the next round
   - Their `hasSpun` status is reset to `false`
   - Their `assignedQuestionId` is cleared
   - **Unselected teams are permanently deleted** from the database
   - Current round is incremented
   - Success message shows: "Advanced X teams to Round Y. Z teams deleted."

3. **If "Try Again" is clicked**:
   - Current round is reset (all questions unlocked, team spins reset)
   - Selection is cleared
   - Teams remain in the current round

## Key Features

### Selection Persistence
- Selection state is maintained while navigating between tabs
- Selection is cleared when:
  - Round is reset
  - All rounds are reset
  - Round is completed and teams advance

### Visual Indicators
- **Checkboxes**: Show which teams are selected
- **Select All checkbox**: Shows indeterminate state when some (but not all) teams are selected
- **Green badges**: Display selected team names in Round Control tab
- **Count display**: Shows "X of Y teams selected"
- **Warning message**: Red alert shows how many teams will be deleted

### Safety Measures
- Cannot advance to next round without selecting at least one team
- Clear warning message about team deletion before confirmation
- Two-step confirmation process (open dialog → confirm action)
- Cancel option available at any point

## Differences from Previous System

### Before
- Admin entered a number of teams to advance
- System automatically selected top N teams based on marks
- Non-advancing teams remained in the current round

### After
- Admin manually selects specific teams using checkboxes
- Selection is independent of marks/scores
- **Unselected teams are permanently deleted**
- No automatic ranking - full manual control

## Database Impact

### Teams
- Selected teams: Moved to next round with reset state
- Unselected teams: **Permanently deleted** from the database

### Questions
- Questions remain unchanged
- Will be available for the next round's teams

## Admin Workflow

1. **Add teams** to the current round
2. **Add questions** for the current round
3. **Let teams spin** and get assigned questions
4. **Review and mark** teams (optional, in Marks tab)
5. **Go to Teams tab** and select which teams should advance
6. **Go to Round Control tab** and review selection
7. **Click "Complete Round & Advance Selected Teams"**
8. **Confirm** in the dialog
9. Selected teams move to next round, unselected teams are deleted

## Important Notes

- ⚠️ **Team deletion is permanent** - once deleted, teams cannot be recovered
- Selection only appears in Rounds 1 and 2 (not in Round 3, the final round)
- Admin should carefully review selections before confirming round completion
- The system provides multiple warnings before deleting teams
