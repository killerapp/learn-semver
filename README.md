# Semantic Version Visualizer

[![Deploy to Cloudflare Pages](https://github.com/killerapp/learn-semver/actions/workflows/deploy.yml/badge.svg)](https://github.com/killerapp/learn-semver/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://semver.agenticinsights.com)

An interactive tool to learn and understand [Semantic Versioning](https://semver.org) through visual demonstrations.

🚀 **Live Demo**: [semver.agenticinsights.com](https://semver.agenticinsights.com)

## Why Interactive Learning?

Instead of traditional presentations or static documentation, this project demonstrates the power of **interactive learning experiences**. By leveraging modern web technologies and AI assistance, complex concepts like semantic versioning can be transformed into engaging, hands-on tools that make learning intuitive and memorable.

This project was rapidly prototyped using:
- **AI-powered development** for quick iteration and component selection
- **Modern React libraries** (shadcn/ui, Magic UI) for polished UI
- **TypeScript** for type-safe development
- **Cloudflare Pages** for instant global deployment

The result? A fully functional learning tool deployed in hours, not weeks.

## Features

### 🎯 Interactive Learning
- **Visual Commit Stream**: Watch commits flow and affect version numbers in real-time
- **Commit Type Buttons**: Add different types of commits to see their impact:
  - 🔴 **Breaking Changes** → Major version bump (X.0.0)
  - 🟢 **Features** → Minor version bump (x.X.0)
  - 🔵 **Fixes** → Patch version bump (x.x.X)
  - Plus docs, style, refactor, test, and chore commits

### ✨ Modern UI/UX
- Built with **shadcn/ui** and **Magic UI** components
- Smooth animations with Framer Motion
- Dark/Light theme support
- Sound effects for interactions
- Particle effects and confetti celebrations

### 💾 Data Persistence
- **Local Storage**: Automatically saves your work
- **Import/Export**: Backup and share your version history
- **Release History**: Track all your releases over time

### 📚 Educational Resources
- Tooltips explaining each commit type's impact
- Links to semver.org and other learning resources
- Visual feedback showing version progression

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/killerapp/learn-semver.git
cd learn-semver

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

✅ **Currently deployed on Cloudflare Pages** at [semver.agenticinsights.com](https://semver.agenticinsights.com)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying your own instance.

### Quick Deploy to Cloudflare Pages

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

The project is configured for static export with:
- **Next.js static export** (`output: 'export'`)
- **Cloudflare Pages** project name: `learn-semver`
- **Custom domain**: Configured via Cloudflare DNS

## How It Works

### Semantic Versioning Rules

Given a version number **MAJOR.MINOR.PATCH**, increment the:

1. **MAJOR** version when you make incompatible API changes
2. **MINOR** version when you add functionality in a backwards compatible manner
3. **PATCH** version when you make backwards compatible bug fixes

### Commit Types

| Type | Description | Version Impact |
|------|-------------|----------------|
| 🔴 `breaking` | Breaking changes | Major (X.0.0) |
| 🟢 `feat` | New features | Minor (x.X.0) |
| 🔵 `fix` | Bug fixes | Patch (x.x.X) |
| 📝 `docs` | Documentation | No change |
| 🎨 `style` | Code style | No change |
| 🔧 `refactor` | Code refactoring | No change |
| 🧪 `test` | Tests | No change |
| 📦 `chore` | Maintenance | No change |

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with Turbopack
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) + [Magic UI](https://magicui.design)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Language**: TypeScript
- **Deployment**: Cloudflare Pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap

- [x] Core visualization functionality
- [x] Sound effects and animations
- [x] Data persistence
- [x] Import/Export functionality
- [ ] Git integration for real commits
- [ ] Customizable commit types
- [ ] Pre-release version support
- [ ] Team collaboration features

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Built with ❤️ by [Agentic Insights](https://agenticinsights.com)

Special thanks to:
- [Semantic Versioning Specification](https://semver.org)
- [Conventional Commits](https://www.conventionalcommits.org)
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Magic UI](https://magicui.design) for additional components

## Support

For questions or support, please:
- Open an [issue](https://github.com/killerapp/learn-semver/issues)
- Visit [Agentic Insights](https://agenticinsights.com)

---

*Learn semantic versioning the visual way!* 🚀