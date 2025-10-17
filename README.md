# Spin Wheel Application

An interactive spin wheel application built with React, TypeScript, and Vite. This application features both participant and admin dashboards for managing and participating in spin wheel activities.

## 🚀 Live Demo

Check out the live demo: [https://sage-fudge-7d6536.netlify.app](https://sage-fudge-7d6536.netlify.app)

## ✨ Features

- Interactive spin wheel with smooth animations
- User authentication (Admin/Participant)
- Admin dashboard for managing questions and rounds
- Real-time updates using Supabase
- Responsive design with Tailwind CSS

## 🛠️ Tech Stack

- ⚡ [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- ⚛️ [React 18](https://reactjs.org/) - A JavaScript library for building user interfaces
- 📘 [TypeScript](https://www.typescriptlang.org/) - TypeScript is a typed superset of JavaScript
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- 🔐 [Supabase](https://supabase.com/) - Open source Firebase alternative
- 🚀 [Netlify](https://www.netlify.com/) - Cloud hosting and serverless backend

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shanmugakarthik05/spin-wheel.git
   cd spin-wheel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── shared/         # Shared components
├── lib/                # Utility functions and configurations
└── App.tsx             # Main application component
```

## 🌐 Deployment

The application is automatically deployed to Netlify on every push to the `main` branch.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Shanmugakarthik
