# Step-by-Step Guide: Push Resume Autofill App to GitHub

Follow these beginner-friendly steps to push your project to GitHub.

## Step 1: Create a New Repository on GitHub

1. Go to https://github.com/ariya-shreshta
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `resume-autofill-app`
   - **Description**: "Intelligent resume parser that auto-fills form fields from PDF, DOC, DOCX, and ODT files"
   - **Visibility**: Select **"Public"** (so recruiters can see it)
   - **Initialize repository**: Leave unchecked (we already have local files)
5. Click **"Create repository"**

## Step 2: Open Git Bash in Your Project Folder

1. Navigate to your project folder: `C:\Users\Ariya_Vijaykumar\CascadeProjects\resume-autofill-app`
2. Right-click in the folder and select **"Git Bash Here"**
   - Or open Git Bash and run: `cd C:\Users\Ariya_Vijaykumar\CascadeProjects\resume-autofill-app`

## Step 3: Initialize Git (First Time Only)

If you haven't already initialized git in this folder, run:

```bash
git init
```

This creates a hidden `.git` folder that tracks your changes.

## Step 4: Configure Git (First Time Only)

Set your name and email:

```bash
git config user.name "Ariya U V"
git config user.email "ariya.shreshta105@gmail.com"
```

## Step 5: Add All Files to Git

```bash
git add .
```

This stages all files for commit. You can verify with:

```bash
git status
```

You should see all files listed as "new file" in green.

## Step 6: Create Your First Commit

```bash
git commit -m "Initial commit: Resume autofill application with multi-format parsing"
```

The message describes what you're committing. Good commit messages help others understand your changes.

## Step 7: Add Remote Repository

Connect your local folder to the GitHub repository:

```bash
git remote add origin https://github.com/ariya-shreshta/resume-autofill-app.git
```

Replace `ariya-shreshta` with your actual GitHub username if different.

Verify the connection:

```bash
git remote -v
```

You should see:
```
origin  https://github.com/ariya-shreshta/resume-autofill-app.git (fetch)
origin  https://github.com/ariya-shreshta/resume-autofill-app.git (push)
```

## Step 8: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

This:
- Renames your branch to `main` (GitHub's default)
- Pushes all commits to GitHub
- Sets `origin main` as the default push location

## Step 9: Verify on GitHub

1. Go to https://github.com/ariya-shreshta/resume-autofill-app
2. You should see all your files uploaded
3. The README.md will display automatically below the file list

## 🎉 Success!

Your project is now on GitHub! Share the link with recruiters.

---

## Future Updates: How to Push Changes

After making changes to your code:

```bash
# 1. Check what changed
git status

# 2. Stage changes
git add .

# 3. Commit with a message
git commit -m "Fixed phone number parsing"

# 4. Push to GitHub
git push
```

## Troubleshooting

### Error: "fatal: not a git repository"
**Solution**: Run `git init` in your project folder first.

### Error: "Permission denied (publickey)"
**Solution**: You need to set up SSH keys:
1. Generate SSH key: `ssh-keygen -t rsa -b 4096 -C "your-email@gmail.com"`
2. Add to GitHub: https://github.com/settings/ssh/new
3. Paste the public key from `C:\Users\YourUsername\.ssh\id_rsa.pub`

### Error: "fatal: remote origin already exists"
**Solution**: You already added the remote. Use:
```bash
git remote set-url origin https://github.com/ariya-shreshta/resume-autofill-app.git
```

### Error: "Updates were rejected because the tip of your current branch is behind"
**Solution**: Pull latest changes first:
```bash
git pull origin main
git push origin main
```

## Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `git init` | Initialize git in folder |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Create a commit |
| `git push` | Push to GitHub |
| `git pull` | Pull from GitHub |
| `git status` | See what changed |
| `git log` | See commit history |
| `git clone <url>` | Download a repo |

---

**Need help?** Check GitHub's official guide: https://docs.github.com/en/get-started/quickstart/create-a-repo
