# Git Setup and Repository Connection Guide

## Step 1: Install Git

### Download and Install Git for Windows

1. **Download Git:**
   - Go to: https://git-scm.com/download/win
   - Download the latest version for Windows
   - Run the installer with default settings

2. **Verify Installation:**
   ```bash
   git --version
   ```

### Alternative: Install via Chocolatey (if you have it)
```bash
choco install git
```

### Alternative: Install via Winget (Windows Package Manager)
```bash
winget install --id Git.Git -e --source winget
```

## Step 2: Configure Git (First Time Setup)

After installing Git, configure your user information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Connect to GitHub Repository

Once Git is installed, run these commands in PowerShell from the project directory:

### Initialize and Setup Repository
```bash
# Initialize Git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Mr Quickie website with complete development setup"

# Add remote repository
git remote add origin https://github.com/VictorBagz/mrquickie.git

# Set default branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Authentication Options

### Option 1: GitHub Personal Access Token (Recommended)
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate new token with repo permissions
3. Use token as password when prompted

### Option 2: GitHub CLI (Recommended for easier setup)
```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login

# Push repository
git push -u origin main
```

### Option 3: SSH Key Setup
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub account
cat ~/.ssh/id_ed25519.pub
```

## Step 5: Verify Connection

After successful setup, verify the connection:

```bash
# Check remote URL
git remote -v

# Check status
git status

# View commit history
git log --oneline
```

## Future Git Workflow

### Making Changes
```bash
# Check what changed
git status

# Add specific files
git add filename.ext

# Or add all changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

### Pulling Updates
```bash
# Pull latest changes
git pull origin main
```

### Creating Branches
```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Push new branch
git push -u origin feature/new-feature
```

## Troubleshooting

### If Git commands don't work:
1. Restart PowerShell/Terminal after Git installation
2. Add Git to PATH manually if needed
3. Use Git Bash instead of PowerShell

### If authentication fails:
1. Use Personal Access Token instead of password
2. Enable two-factor authentication on GitHub
3. Use GitHub CLI for easier authentication

### If push is rejected:
```bash
# Force push (use carefully)
git push --force-with-lease origin main
```

## Project Structure in Repository

```
mrquickie/
├── index.html              # Main website file
├── styles.css              # Stylesheet
├── scripts.js              # JavaScript functionality
├── package.json            # NPM dependencies
├── README.md               # Project documentation
├── .gitignore             # Git ignore rules
├── .eslintrc.json         # JavaScript linting
├── .stylelintrc.json      # CSS linting
├── .prettierrc.json       # Code formatting
├── install.ps1            # PowerShell installer
├── install.bat            # Batch installer
├── git-setup.md           # This file
└── .vscode/               # VS Code configuration
    ├── settings.json      # Editor settings
    ├── extensions.json    # Recommended extensions
    └── launch.json        # Debug configurations
```

## Repository Features

The GitHub repository at https://github.com/VictorBagz/mrquickie.git will include:

- ✅ Complete Mr Quickie website code
- ✅ Modern development environment setup
- ✅ Automated build and deployment scripts
- ✅ Code quality tools (ESLint, Prettier, Stylelint)
- ✅ VS Code configuration and extensions
- ✅ Comprehensive documentation
- ✅ Professional README with setup instructions

## Next Steps After Git Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development:**
   ```bash
   npm run dev
   ```

3. **Open in VS Code:**
   ```bash
   code .
   ```

4. **Enable GitHub Actions (Optional):**
   - Automated testing on pull requests
   - Automatic deployment to GitHub Pages
   - Code quality checks

## Collaboration Workflow

Once connected to GitHub, team members can:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VictorBagz/mrquickie.git
   cd mrquickie
   npm install
   ```

2. **Create feature branches:**
   ```bash
   git checkout -b feature/new-feature
   ```

3. **Submit pull requests for code review**

4. **Deploy automatically via GitHub Actions**

---

**Remember:** After installing Git, restart your terminal/PowerShell and then run the connection commands from Step 3.
