# Marks & Export Feature Guide

## Overview
The UXcellence app now includes a comprehensive **Marks Sheet** system that allows admins to:
- ✅ Assign marks (0-100) to teams
- ✅ Add feedback/reasons for each team
- ✅ Export results to PDF, CSV, and Excel formats
- ✅ View marks for any round
- ✅ Track scoring statistics

## How to Use

### 1. Accessing the Marks Sheet
1. Log in as Admin (username: "UXcellence")
2. Navigate to the **"Marks"** tab in the dashboard
3. Select the round you want to mark using the dropdown

### 2. Adding Marks to Teams

**For each team:**
1. Click the **"Edit"** button in the Actions column
2. Enter marks (0-100) in the Marks field
3. Add feedback or reason in the Reason box
4. Click **"Save"** (green button) to save or **"Cancel"** to discard

**Visual Indicators:**
- 🟢 **Green** (70-100): Excellent performance
- 🟡 **Yellow** (50-69): Good performance  
- 🔴 **Red** (0-49): Needs improvement
- ⚪ **Gray (N/A)**: Not yet marked
- 🟡 **Yellow dot**: Unmarked teams have a yellow indicator

### 3. Viewing Statistics

The summary panel at the bottom shows:
- **Total Teams**: Number of teams in the selected round
- **Marked**: How many teams have been evaluated
- **Average Score**: Mean score of all marked teams

### 4. Exporting Results

**Available Formats:**
- 📄 **PDF**: Professional report with formatted table
- 📊 **CSV**: Compatible with Excel, Google Sheets, Numbers
- 📈 **Excel**: Spreadsheet format (.xls)

**To Export:**
1. Select the round you want to export
2. Click the corresponding export button:
   - Red button = PDF
   - Green button = CSV
   - Blue button = Excel
3. File downloads automatically with format: `UXcellence_Round{X}_{RoundName}.{ext}`

**Export Contents:**
Each export includes:
- Team ranking (#)
- Team name
- Assigned question
- Marks scored
- Feedback/reason

### 5. Round-by-Round Tracking

- Each round has its own marks sheet
- Marks are preserved when teams advance to next rounds
- You can view historical data from previous rounds
- Use the round selector dropdown to switch between rounds

## Data Persistence

All marks and feedback are:
- ✅ Automatically saved to the database
- ✅ Synced across all devices
- ✅ Preserved even after browser refresh
- ✅ Accessible to all admin users

## Best Practices

1. **Complete Evaluation**: Mark all teams before advancing to the next round
2. **Detailed Feedback**: Use the reason field to provide constructive feedback
3. **Regular Exports**: Export results after each round for record-keeping
4. **Consistent Scoring**: Use a rubric to ensure fair marking across teams

## Technical Details

- **Marks Range**: 0-100 (integer values)
- **Reason Field**: Unlimited text (supports line breaks)
- **Auto-save**: Changes saved immediately to database
- **Export Libraries**: 
  - PDF: jsPDF with autoTable
  - CSV/Excel: Native browser download
