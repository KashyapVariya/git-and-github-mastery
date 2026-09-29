export type CheatCommand = {
  command: string;
  description: string;
};

export type CheatCategory = {
  id: string;
  title: string;
  commands: CheatCommand[];
};

export const cheatsheet: CheatCategory[] = [
  {
    id: 'setup',
    title: 'Setup & Config',
    commands: [
      { command: 'git config --global user.name "Your Name"', description: 'Set the name attached to your commits.' },
      { command: 'git config --global user.email "you@example.com"', description: 'Set the email attached to your commits.' },
      { command: 'git config --global init.defaultBranch main', description: 'Make new repos start on a branch named main.' },
      { command: 'git config --global core.editor "code --wait"', description: 'Set the editor Git opens for messages.' },
      { command: 'git config --list --show-origin', description: 'Show every active setting and which file it came from.' },
      { command: 'git config --global alias.st status', description: 'Create a shortcut: git st runs git status.' },
    ],
  },
  {
    id: 'starting',
    title: 'Starting a Repository',
    commands: [
      { command: 'git init', description: 'Turn the current folder into a new Git repository.' },
      { command: 'git clone <url>', description: 'Download a full copy of a remote repository.' },
      { command: 'git clone --depth 1 <url>', description: 'Shallow clone: only the latest commit, faster for CI.' },
      { command: 'git clone --filter=blob:none <url>', description: 'Partial clone: skip file contents until needed.' },
    ],
  },
  {
    id: 'staging',
    title: 'Staging & Committing',
    commands: [
      { command: 'git status', description: 'Show what changed and what is staged.' },
      { command: 'git add <file>', description: 'Stage a specific file.' },
      { command: 'git add .', description: 'Stage every change in the current folder.' },
      { command: 'git add -p', description: 'Interactively stage changes hunk by hunk.' },
      { command: 'git commit -m "message"', description: 'Save staged changes as a new commit.' },
      { command: 'git commit --amend', description: 'Rewrite the most recent commit (message and/or staged changes).' },
      { command: 'git commit --amend --no-edit', description: 'Add staged changes to the last commit, keep its message.' },
    ],
  },
  {
    id: 'branches',
    title: 'Branches',
    commands: [
      { command: 'git branch', description: 'List local branches.' },
      { command: 'git branch <name>', description: 'Create a new branch without switching to it.' },
      { command: 'git switch <name>', description: 'Switch to an existing branch.' },
      { command: 'git switch -c <name>', description: 'Create a branch and switch to it in one step.' },
      { command: 'git branch -d <name>', description: 'Delete a branch that is fully merged.' },
      { command: 'git branch -D <name>', description: 'Force-delete a branch, merged or not.' },
      { command: 'git branch -m <new-name>', description: 'Rename the current branch.' },
      { command: 'git merge <branch>', description: 'Merge another branch into your current branch.' },
    ],
  },
  {
    id: 'history',
    title: 'Inspecting History',
    commands: [
      { command: 'git log', description: 'Show commit history, newest first.' },
      { command: 'git log --oneline --graph --all', description: 'Compact, visual history of every branch.' },
      { command: 'git show <commit>', description: 'Show the full diff and metadata of one commit.' },
      { command: 'git diff', description: 'Show unstaged changes.' },
      { command: 'git diff --staged', description: 'Show staged changes not yet committed.' },
      { command: 'git blame <file>', description: 'Show who last changed each line and in which commit.' },
      { command: 'git log -S "text"', description: 'Find commits that added or removed a string (pickaxe search).' },
    ],
  },
  {
    id: 'undo',
    title: 'Undoing Things',
    commands: [
      { command: 'git restore <file>', description: 'Discard unstaged changes to a file.' },
      { command: 'git restore --staged <file>', description: 'Unstage a file, keeping its edits.' },
      { command: 'git reset --soft HEAD~1', description: 'Undo the last commit, keep changes staged.' },
      { command: 'git reset --mixed HEAD~1', description: 'Undo the last commit, keep changes unstaged (default).' },
      { command: 'git reset --hard HEAD~1', description: 'Undo the last commit and discard its changes entirely.' },
      { command: 'git revert <commit>', description: 'Create a new commit that undoes an earlier one — safe for shared history.' },
      { command: 'git reflog', description: 'List everywhere HEAD has been, to recover “lost” commits.' },
    ],
  },
  {
    id: 'stash',
    title: 'Stashing',
    commands: [
      { command: 'git stash', description: 'Shelve uncommitted changes.' },
      { command: 'git stash -u', description: 'Also stash untracked files.' },
      { command: 'git stash list', description: 'Show all stashed entries.' },
      { command: 'git stash pop', description: 'Reapply the latest stash and remove it from the list.' },
      { command: 'git stash apply', description: 'Reapply the latest stash but keep it in the list.' },
      { command: 'git stash drop', description: 'Delete a stash entry without applying it.' },
    ],
  },
  {
    id: 'remotes',
    title: 'Remotes & Syncing',
    commands: [
      { command: 'git remote -v', description: 'List configured remotes and their URLs.' },
      { command: 'git remote add origin <url>', description: 'Connect the repo to a remote named origin.' },
      { command: 'git fetch', description: 'Download new commits without merging them.' },
      { command: 'git pull', description: 'Fetch and merge (or rebase, if configured) into your current branch.' },
      { command: 'git pull --rebase', description: 'Fetch, then replay your local commits on top instead of merging.' },
      { command: 'git push', description: 'Upload local commits to the remote branch.' },
      { command: 'git push -u origin <branch>', description: 'Push and set the branch to track that remote branch.' },
      { command: 'git push --force-with-lease', description: 'Force-push safely: fails if someone else pushed since your last fetch.' },
    ],
  },
  {
    id: 'tags',
    title: 'Tags',
    commands: [
      { command: 'git tag', description: 'List tags.' },
      { command: 'git tag v1.0.0', description: 'Create a lightweight tag on the current commit.' },
      { command: 'git tag -a v1.0.0 -m "message"', description: 'Create an annotated tag with a message and metadata.' },
      { command: 'git push origin v1.0.0', description: 'Push a single tag to the remote.' },
      { command: 'git push origin --tags', description: 'Push all local tags to the remote.' },
    ],
  },
  {
    id: 'advanced',
    title: 'Rebasing & Advanced History',
    commands: [
      { command: 'git rebase <branch>', description: 'Replay your commits on top of another branch for linear history.' },
      { command: 'git rebase -i HEAD~5', description: 'Interactively edit, squash, or reorder the last 5 commits.' },
      { command: 'git rebase --continue', description: 'Continue a rebase after resolving a conflict.' },
      { command: 'git rebase --abort', description: 'Cancel a rebase and return to the pre-rebase state.' },
      { command: 'git cherry-pick <commit>', description: 'Apply one commit from elsewhere onto the current branch.' },
      { command: 'git bisect start', description: 'Begin a binary search for the commit that introduced a bug.' },
      { command: 'git worktree add ../hotfix branch-name', description: 'Check out a branch into a second working folder.' },
    ],
  },
  {
    id: 'internals',
    title: 'Diagnostics & Internals',
    commands: [
      { command: 'git cat-file -p <hash>', description: 'Print the raw content of any Git object.' },
      { command: 'git hash-object <file>', description: 'Compute the SHA a file would get as a blob.' },
      { command: 'git rev-parse HEAD', description: 'Print the full commit hash HEAD points to.' },
      { command: 'git gc', description: 'Compress loose objects into packfiles and clean up.' },
      { command: 'git fsck', description: 'Check the repository’s object database for corruption.' },
      { command: 'git clean -nd', description: 'Preview which untracked files/folders would be removed.' },
    ],
  },
  {
    id: 'gh-cli',
    title: 'GitHub CLI (gh)',
    commands: [
      { command: 'gh auth login', description: 'Authenticate the CLI with your GitHub account.' },
      { command: 'gh repo clone owner/name', description: 'Clone a repository by owner/name.' },
      { command: 'gh pr create --fill', description: 'Open a pull request using the branch’s commits.' },
      { command: 'gh pr checkout 123', description: 'Check out a pull request locally by number.' },
      { command: 'gh pr review --approve', description: 'Approve the current pull request.' },
      { command: 'gh issue list', description: 'List open issues in the current repository.' },
      { command: 'gh workflow run <name>', description: 'Manually trigger a GitHub Actions workflow.' },
    ],
  },
];
