# Mr Quickie Website

A modern, responsive business website for Mr Quickie shoe repair and services company. Built with clean HTML5, CSS3, and JavaScript with interactive features including sliders, animations, and mobile-responsive design.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Visual Studio Code** - [Download here](https://code.visualstudio.com/)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd C:\Users\ADMIN\Desktop\MRQUICKIE
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## 📦 Dependencies & Tech Stack

### Core Technologies
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality
- **jQuery** - DOM manipulation and AJAX
- **Revolution Slider** - Hero banner slider

### Development Dependencies
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Stylelint** - CSS linting
- **Live Server** - Development server with hot reload
- **Clean CSS** - CSS minification
- **UglifyJS** - JavaScript minification

### Runtime Dependencies
- **jQuery** (v3.7.1) - DOM manipulation
- **Slick Carousel** - Product and content sliders
- **AOS** - Animate On Scroll library
- **GSAP** - Advanced animations
- **Locomotive Scroll** - Smooth scrolling
- **Vanilla LazyLoad** - Image lazy loading
- **Intersection Observer** - Viewport detection

## 🛠️ Development Setup

### VS Code Extensions (Auto-install)

The project includes a `.vscode/extensions.json` file that will prompt you to install recommended extensions:

**Essential Extensions:**
- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **Stylelint** - CSS linter
- **Live Server** - Development server
- **Auto Rename Tag** - HTML tag renaming
- **HTML CSS Support** - IntelliSense for CSS
- **Path Intellisense** - File path completion

**Additional Recommended:**
- **Bracket Pair Colorizer** - Visual bracket matching
- **Color Highlight** - CSS color visualization
- **Better Comments** - Enhanced comment styling
- **Thunder Client** - API testing
- **GitLens** - Enhanced Git capabilities

### Project Structure

```
MRQUICKIE/
├── index.html              # Main HTML file
├── styles.css              # Main stylesheet
├── scripts.js              # Main JavaScript file
├── package.json            # NPM dependencies and scripts
├── .eslintrc.json         # ESLint configuration
├── .stylelintrc.json      # Stylelint configuration
├── .prettierrc.json       # Prettier configuration
├── .gitignore             # Git ignore rules
├── .vscode/               # VS Code settings
│   ├── settings.json      # Editor settings
│   ├── extensions.json    # Recommended extensions
│   └── launch.json        # Debug configurations
├── dist/                  # Production build (generated)
├── images/                # Image assets
└── README.md              # This file
```

## 🎯 Available Scripts

### Development
- **`npm run dev`** - Start development server with live reload
- **`npm start`** - Alias for `npm run dev`
- **`npm run serve`** - Alternative HTTP server on port 8080

### Building & Optimization
- **`npm run build`** - Build production files (minified CSS and JS)
- **`npm run minify-css`** - Minify CSS files
- **`npm run minify-js`** - Minify JavaScript files
- **`npm run optimize-images`** - Optimize image files

### Code Quality
- **`npm run lint-css`** - Lint CSS files
- **`npm run lint-js`** - Lint JavaScript files
- **`npm run fix-js`** - Auto-fix JavaScript issues
- **`npm run format`** - Format all files with Prettier

### Development Workflow
- **`npm run watch`** - Watch files and auto-rebuild
- **`npm run watch:css`** - Watch CSS files only
- **`npm run watch:js`** - Watch JavaScript files only
- **`npm run clean`** - Clean build directory

## 🎨 Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Flexible grid system
- Responsive typography

### Interactive Elements
- **Hero Slider** - Revolution Slider with smooth transitions
- **Product Carousel** - Showcases featured products
- **Image Gallery** - Before/after work samples
- **Video Section** - Embedded YouTube videos
- **Mobile Menu** - Collapsible navigation
- **Search Functionality** - Live search with AJAX
- **Scroll Animations** - AOS and GSAP powered

### Performance Optimizations
- **Lazy Loading** - Images load as needed
- **Code Splitting** - Optimized loading
- **Minification** - Compressed CSS and JS
- **Caching** - Browser cache optimization
- **SEO Optimized** - Semantic HTML and meta tags

## 🔧 Configuration

### Environment Setup

1. **Configure Live Server:**
   ```json
   {
     "liveServer.settings.port": 3000,
     "liveServer.settings.root": "/",
     "liveServer.settings.CustomBrowser": "chrome"
   }
   ```

2. **Configure ESLint:**
   - Rules are set in `.eslintrc.json`
   - Integrates with Prettier
   - WordPress/jQuery globals included

3. **Configure Stylelint:**
   - Rules are set in `.stylelintrc.json`
   - Standard CSS rules with flexibility for custom properties

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Internet Explorer 11+

## 🚀 Deployment

### Build for Production

1. **Create production build:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder to your web server**

### Deployment Options

**Static Hosting:**
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

**Traditional Hosting:**
- Upload `dist/` contents to your web server
- Ensure server supports HTML5 pushState (for SPA routing)

## 🔍 Debugging

### VS Code Debugging

1. **Press F5** to start debugging
2. **Set breakpoints** in JavaScript files
3. **Use Chrome DevTools** integration

### Browser DevTools

1. **Open DevTools** (F12)
2. **Check Console** for errors
3. **Use Network Tab** for performance
4. **Mobile Simulation** for responsive testing

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use alternative port
npm run serve
```

**Node Version Issues:**
```bash
# Check Node version
node --version
# Use Node Version Manager if needed
nvm use 16
```

## 📱 Mobile Development

### Testing on Mobile Devices

1. **Connect device to same network**
2. **Find your IP address:**
   ```bash
   ipconfig
   ```
3. **Access via mobile browser:**
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

### Mobile-Specific Features
- Touch-friendly navigation
- Swipe gestures for sliders
- Optimized images for retina displays
- Progressive Web App capabilities

## 🤝 Contributing

### Code Style Guidelines

1. **Use Prettier** for formatting
2. **Follow ESLint** rules
3. **Write semantic HTML**
4. **Use CSS custom properties** for theming
5. **Comment complex JavaScript** functions

### Git Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. **Push and create PR:**
   ```bash
   git push origin feature/new-feature
   ```

## 📞 Support

### Getting Help

- **Check the Issues** section for common problems
- **Review the documentation** in this README
- **Check browser console** for JavaScript errors
- **Validate HTML/CSS** using online validators

### Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)
- [WordPress Developer Resources](https://developer.wordpress.org/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **WordPress** - Content management inspiration
- **WooCommerce** - E-commerce integration
- **BeTheme** - Design system inspiration
- **Revolution Slider** - Slider functionality
- **Font Awesome** - Icon library

---

**Happy Coding! 🎉**

For any questions or issues, please refer to the documentation above or check the project's issue tracker.
