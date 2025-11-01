# UXcellence - Multi-Round Competition Event System

A comprehensive role-based spin wheel event system for managing multi-round design competitions with automated question assignment, team management, and scoring capabilities.

## 🎯 Quick Links

- **New User?** Start here → [Quick Start Guide](QUICK_START.md)
- **Latest Updates** → [Latest Features Summary](LATEST_FEATURES_SUMMARY.md)
- **Implementation Details** → [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

---

## 🌟 Key Features

### For Participants
- ✨ **Self-Service Team Registration** - Create your own team instantly
- 🎡 **Animated Spin Wheel** - Engaging wheel spin experience
- 🎯 **Unique Question Assignment** - No duplicate questions
- 📊 **View Marks & Feedback** - See your scores and comments
- 🌓 **Dark/Light Theme** - Comfortable viewing

### For Admins
- 👥 **Automatic Team Population** - Teams auto-appear as participants register
- ✅ **Manual Team Selection** - Choose specific teams to advance
- 📝 **Question Management** - Add/delete questions with descriptions
- 🏆 **Comprehensive Marking** - Score teams with detailed feedback
- 🔄 **Round Control** - Complete rounds, advance teams, reset as needed
- ⚙️ **Flexible Configuration** - Customize round settings

### System Features
- 💾 **Persistent Storage** - Supabase backend integration
- 🔄 **Real-Time Sync** - Updates every 3 seconds
- 🚀 **Fast & Responsive** - Optimized performance
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Data Integrity** - Atomic operations, no data loss

---

## 🚀 Getting Started

### For Participants

1. **Create Your Team**
   - Open the application
   - Go to "Create Team" tab
   - Enter your team name
   - Click "Create Team"

2. **Login**
   - Switch to "Login" tab
   - Enter your team name
   - Start competing!

3. **Compete**
   - Spin the wheel to get your question
   - View your marks after admin review
   - Advance to next round if selected

### For Admins

1. **Login**
   - Use password: `UXcellence`

2. **Setup**
   - Add questions for each round
   - Configure round settings (optional)

3. **Manage**
   - Monitor team registrations
   - Watch teams spin the wheel
   - Mark/score team performances
   - Select teams for next round
   - Advance rounds

---

## 📚 Documentation

### User Guides
- [📖 Quick Start Guide](QUICK_START.md) - Get up and running fast
- [🎓 Team Creation Guide](TEAM_CREATION_GUIDE.md) - Self-registration details
- [✅ Team Selection Guide](TEAM_SELECTION_GUIDE.md) - Manual advancement system
- [📊 Marks Feature Guide](MARKS_FEATURE_GUIDE.md) - Scoring and feedback
- [🔄 Reset Features Guide](RESET_FEATURES_GUIDE.md) - Round reset options

### Technical Documentation
- [💾 Persistence Guide](PERSISTENCE_GUIDE.md) - Supabase backend integration
- [🔧 Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Technical details
- [📝 Latest Features Summary](LATEST_FEATURES_SUMMARY.md) - Recent updates
- [⚙️ Update Summary](UPDATE_SUMMARY.md) - Change history

---

## 🏆 Competition Structure

### Three Rounds

#### Round 1: Style Battle
- **Focus**: HTML + CSS skills
- **Max Teams**: 30 (customizable)
- **Advancement**: Admin selects teams

#### Round 2: Design Remix
- **Focus**: Creative design twist challenge
- **Max Teams**: 20 (customizable)
- **Advancement**: Admin selects teams

#### Round 3: UXcellence Grand Showdown
- **Focus**: Final design presentation & justification
- **Max Teams**: 10 (customizable)
- **Final Round**: Winners declared

---

## 🎨 Key Workflows

### Participant Journey
```
Register → Login → Spin Wheel → Get Question → 
Wait for Results → View Marks → Advance (if selected) → Repeat
```

### Admin Journey
```
Login → Monitor Registrations → Add Questions → 
Watch Spins → Mark Teams → Select Teams → 
Advance Round → Repeat → Declare Winners
```

---

## ⚡ Latest Updates

### Version 2.0 - Team Self-Registration & Manual Selection

#### What's New
1. **Team Self-Registration**
   - Participants create their own teams
   - Automatic validation (duplicates, reserved names)
   - Instant registration, no admin approval needed
   - Teams auto-populate in admin dashboard

2. **Manual Team Selection**
   - Checkbox-based team selection
   - Select specific teams to advance
   - Unselected teams are permanently deleted
   - Clear warnings before deletion

3. **Enhanced UI**
   - Two-tab login page (Login | Create Team)
   - Visual selection indicators
   - Selected team badges in Round Control
   - Team count displays

[View all updates →](LATEST_FEATURES_SUMMARY.md)

---

## 🔧 Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0
- **Components**: Shadcn/UI
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Animations**: CSS transitions

### Backend
- **Platform**: Supabase
- **Functions**: Edge Functions
- **Storage**: KV Store
- **API**: REST endpoints
- **Sync**: 3-second polling

---

## 📊 Data Flow

```
Participant Creates Team → Saves to Supabase KV Store
                          ↓
          Admin Polls /state Every 3 Seconds
                          ↓
            Team Appears in Admin Dashboard
                          ↓
         Participant Spins → Question Assignment
                          ↓
            Admin Marks Team → Saves to KV
                          ↓
       Admin Selects Teams → Checkbox Selection
                          ⬇
  Admin Completes Round → Selected Advance, Others Deleted
                          ⬇
               Repeat for Next Round
```

---

## 🛠️ Configuration

### Default Settings
```javascript
Round 1: Max 30 teams
Round 2: Max 20 teams  
Round 3: Max 10 teams
Sync Interval: 3 seconds
Marking Range: 0-100
```

### Customizable Options
- Round names and descriptions
- Maximum teams per round
- Questions and descriptions
- Marking criteria

---

## 🔒 Security

### Authentication
- Admin: Password-based ("UXcellence")
- Participants: Team name-based

### Validation
- Team name uniqueness (case-insensitive)
- Reserved name blocking
- Empty input prevention
- Duplicate detection

### Data Protection
- Supabase authentication
- API key management
- Atomic database operations

---

## 📱 Responsive Design

Works seamlessly on:
- 💻 Desktop computers
- 📱 Tablets
- 📲 Mobile phones
- 🖥️ Large displays

---

## 🎯 Use Cases

Perfect for:
- Design competitions
- UX/UI challenges
- Coding bootcamps
- Hackathons
- Educational workshops
- Team-building events
- Corporate training
- Design sprints

---

## 🌓 Theme Support

- **Light Mode**: Clean, professional appearance
- **Dark Mode**: Reduced eye strain, modern look
- **Toggle**: Available on all screens
- **Persistent**: Choice saved across sessions

---

## 📈 Performance

- ⚡ Fast load times
- 🔄 Real-time updates (3s)
- 💾 Efficient data storage
- 🚀 Optimized rendering
- 📊 Scalable architecture

---

## 🐛 Troubleshooting

### Common Issues

**Team name already exists**
- Someone already used that name
- Choose a different team name

**Cannot see team in admin dashboard**
- Wait 3-5 seconds for sync
- Refresh if needed

**Can't advance round**
- Ensure all teams have questions
- Select at least one team

**Wheel won't spin**
- Can only spin once per round
- Wait for admin to advance

[More troubleshooting →](QUICK_START.md#troubleshooting)

---

## 📞 Support

Need help?
1. Check the [Quick Start Guide](QUICK_START.md)
2. Review detailed documentation
3. Contact your event organizer
4. Check system logs (Admin)

---

## 🎉 Success Stories

Perfect for events like:
- University design competitions
- Corporate innovation challenges
- Bootcamp final projects
- Community design sprints
- Student hackathons

---

## 🔮 Future Roadmap

Planned features:
- Email authentication
- Team member management
- Advanced analytics
- CSV export
- Performance graphs
- Multi-admin support
- Question categories
- Time limits
- Live leaderboard

---

## 📄 License & Attribution

See [Attributions.md](Attributions.md) for details.

---

## 🙏 Acknowledgments

Built with:
- React & TypeScript
- Tailwind CSS
- Shadcn/UI
- Supabase
- Lucide Icons

---

## 📝 Version History

### v2.0 (Latest)
- Team self-registration
- Manual team selection
- Enhanced UI/UX
- Comprehensive documentation

### v1.0
- Basic spin wheel functionality
- Admin dashboard
- Question management
- Marking system
- Backend integration

---

## 🚦 Status

🟢 **Active Development** - Regularly updated and maintained

---

## 🌐 Getting Help

- Documentation: This README and linked guides
- Technical: [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- Quick Help: [Quick Start Guide](QUICK_START.md)

---

## 💡 Tips

### For Best Results
1. Add questions before participant registration
2. Communicate selection criteria clearly
3. Use marking system for transparency
4. Review selections before advancing
5. Keep records for final results

---

## 🎓 Learning Resources

New to the system? Read in this order:
1. [Quick Start Guide](QUICK_START.md)
2. [Team Creation Guide](TEAM_CREATION_GUIDE.md)
3. [Team Selection Guide](TEAM_SELECTION_GUIDE.md)
4. [Marks Feature Guide](MARKS_FEATURE_GUIDE.md)

---

**Built for UXcellence competitions worldwide** 🌍✨

Last Updated: November 2025
