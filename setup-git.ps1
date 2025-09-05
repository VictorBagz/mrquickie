# Git Setup and GitHub Connection Script for Mr Quickie Project
# This script will install Git (if needed) and connect to the GitHub repository

param(
    [string]$GitHubUrl = "https://github.com/VictorBagz/mrquickie.git",
    [string]$BranchName = "main"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Git Setup & GitHub Connection" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository: $GitHubUrl" -ForegroundColor Yellow
Write-Host ""

# Function to check if command exists
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Function to install Git using winget
function Install-GitWithWinget {
    Write-Host "Attempting to install Git using Windows Package Manager..." -ForegroundColor Cyan
    try {
        winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
        return $?
    }
    catch {
        return $false
    }
}

# Function to install Git using Chocolatey
function Install-GitWithChocolatey {
    Write-Host "Attempting to install Git using Chocolatey..." -ForegroundColor Cyan
    try {
        choco install git -y
        return $?
    }
    catch {
        return $false
    }
}

# Check if Git is installed
if (-not (Test-Command "git")) {
    Write-Host "⚠️  Git is not installed on this system." -ForegroundColor Yellow
    Write-Host ""
    
    $installGit = Read-Host "Would you like to install Git automatically? (y/n)"
    
    if ($installGit -eq "y" -or $installGit -eq "Y" -or $installGit -eq "yes") {
        Write-Host ""
        Write-Host "Installing Git..." -ForegroundColor Cyan
        
        # Try winget first
        if (Test-Command "winget") {
            Write-Host "✅ Windows Package Manager found" -ForegroundColor Green
            if (Install-GitWithWinget) {
                Write-Host "✅ Git installed successfully via winget" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Failed to install Git via winget" -ForegroundColor Red
            }
        }
        # Try Chocolatey if winget fails
        elseif (Test-Command "choco") {
            Write-Host "✅ Chocolatey found" -ForegroundColor Green
            if (Install-GitWithChocolatey) {
                Write-Host "✅ Git installed successfully via Chocolatey" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Failed to install Git via Chocolatey" -ForegroundColor Red
            }
        }
        else {
            Write-Host "❌ No package manager found (winget or choco)" -ForegroundColor Red
            Write-Host ""
            Write-Host "Please install Git manually:" -ForegroundColor Yellow
            Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor White
            Write-Host "2. Run the installer with default settings" -ForegroundColor White
            Write-Host "3. Restart PowerShell and run this script again" -ForegroundColor White
            Read-Host "Press Enter to exit"
            exit 1
        }
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Check if Git is now available
        if (-not (Test-Command "git")) {
            Write-Host ""
            Write-Host "❌ Git installation may have failed or requires a restart." -ForegroundColor Red
            Write-Host "Please restart PowerShell and try again." -ForegroundColor Yellow
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
    else {
        Write-Host ""
        Write-Host "Git installation cancelled." -ForegroundColor Yellow
        Write-Host "Please install Git manually and run this script again." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Download Git from: https://git-scm.com/download/win" -ForegroundColor Cyan
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Verify Git installation
Write-Host "✅ Git is available" -ForegroundColor Green
$gitVersion = git --version
Write-Host "Version: $gitVersion" -ForegroundColor White
Write-Host ""

# Check if Git is already initialized
if (Test-Path ".git") {
    Write-Host "⚠️  Git repository already exists" -ForegroundColor Yellow
    $reinitialize = Read-Host "Would you like to reinitialize and connect to GitHub? (y/n)"
    
    if ($reinitialize -ne "y" -and $reinitialize -ne "Y" -and $reinitialize -ne "yes") {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 0
    }
    
    Write-Host "Removing existing Git repository..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git" -ErrorAction SilentlyContinue
}

# Configure Git if not already configured
$gitUserName = git config --global user.name 2>$null
$gitUserEmail = git config --global user.email 2>$null

if (-not $gitUserName -or -not $gitUserEmail) {
    Write-Host "⚙️  Git configuration needed" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not $gitUserName) {
        $userName = Read-Host "Enter your Git username"
        git config --global user.name "$userName"
        Write-Host "✅ Git username configured" -ForegroundColor Green
    }
    
    if (-not $gitUserEmail) {
        $userEmail = Read-Host "Enter your Git email"
        git config --global user.email "$userEmail"
        Write-Host "✅ Git email configured" -ForegroundColor Green
    }
    Write-Host ""
}

Write-Host "Git Configuration:" -ForegroundColor Cyan
Write-Host "Username: $(git config --global user.name)" -ForegroundColor White
Write-Host "Email: $(git config --global user.email)" -ForegroundColor White
Write-Host ""

# Initialize Git repository
Write-Host "🔄 Initializing Git repository..." -ForegroundColor Cyan
try {
    git init
    if ($LASTEXITCODE -ne 0) {
        throw "Git init failed"
    }
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to initialize Git repository" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add all files
Write-Host "📁 Adding files to Git..." -ForegroundColor Cyan
try {
    git add .
    if ($LASTEXITCODE -ne 0) {
        throw "Git add failed"
    }
    Write-Host "✅ Files added to Git staging area" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to add files to Git" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Cyan
try {
    git commit -m "Initial commit: Mr Quickie website with complete development setup

- Complete HTML5, CSS3, and JavaScript website
- Responsive design with mobile-first approach
- Interactive sliders and animations
- WooCommerce integration ready
- Complete development environment setup
- ESLint, Prettier, and Stylelint configuration
- VS Code settings and recommended extensions
- NPM scripts for development and production
- Documentation and setup guides"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Git commit failed"
    }
    Write-Host "✅ Initial commit created" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to create initial commit" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add remote repository
Write-Host "🔗 Adding remote repository..." -ForegroundColor Cyan
try {
    git remote add origin $GitHubUrl
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to add remote repository"
    }
    Write-Host "✅ Remote repository added: $GitHubUrl" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to add remote repository" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Set default branch
Write-Host "🌿 Setting default branch to $BranchName..." -ForegroundColor Cyan
try {
    git branch -M $BranchName
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to set default branch"
    }
    Write-Host "✅ Default branch set to $BranchName" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to set default branch" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  You may be prompted for GitHub credentials" -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin $BranchName
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to push to GitHub"
    }
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "This might be due to authentication issues. Try one of these:" -ForegroundColor Yellow
    Write-Host "1. Use GitHub Personal Access Token as password" -ForegroundColor White
    Write-Host "2. Install GitHub CLI: winget install GitHub.cli" -ForegroundColor White
    Write-Host "3. Set up SSH keys for GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "See git-setup.md for detailed authentication instructions" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To retry pushing manually:" -ForegroundColor Cyan
    Write-Host "git push -u origin $BranchName" -ForegroundColor Green
    Write-Host ""
}

# Verify connection
Write-Host ""
Write-Host "🔍 Verifying repository connection..." -ForegroundColor Cyan
try {
    $remoteUrl = git remote get-url origin
    Write-Host "✅ Remote URL: $remoteUrl" -ForegroundColor Green
    
    $currentBranch = git branch --show-current
    Write-Host "✅ Current branch: $currentBranch" -ForegroundColor Green
    
    $commitCount = git rev-list --count HEAD
    Write-Host "✅ Commits: $commitCount" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Could not verify all repository details" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   🎉 Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Repository Details:" -ForegroundColor Cyan
Write-Host "• GitHub URL: $GitHubUrl" -ForegroundColor White
Write-Host "• Local Path: $(Get-Location)" -ForegroundColor White
Write-Host "• Branch: $BranchName" -ForegroundColor White
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Visit your repository: $GitHubUrl" -ForegroundColor White
Write-Host "2. Install dependencies: npm install" -ForegroundColor White
Write-Host "3. Start development: npm run dev" -ForegroundColor White
Write-Host "4. Open in VS Code: code ." -ForegroundColor White
Write-Host ""

Write-Host "Future Git Commands:" -ForegroundColor Cyan
Write-Host "• git status              # Check file changes" -ForegroundColor White
Write-Host "• git add .               # Stage all changes" -ForegroundColor White
Write-Host "• git commit -m 'msg'     # Commit changes" -ForegroundColor White
Write-Host "• git push                # Push to GitHub" -ForegroundColor White
Write-Host "• git pull                # Pull latest changes" -ForegroundColor White
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "• README.md               # Project overview" -ForegroundColor White
Write-Host "• git-setup.md            # Detailed Git instructions" -ForegroundColor White
Write-Host "• package.json            # NPM scripts and dependencies" -ForegroundColor White
Write-Host ""

$openRepo = Read-Host "Would you like to open the GitHub repository in your browser? (y/n)"
if ($openRepo -eq "y" -or $openRepo -eq "Y" -or $openRepo -eq "yes") {
    Start-Process $GitHubUrl
}

Write-Host ""
Write-Host "🎉 Git setup complete! Your project is now connected to GitHub." -ForegroundColor Green
Read-Host "Press Enter to exit"
