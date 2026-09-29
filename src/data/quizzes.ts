export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Quiz = {
  questions: QuizQuestion[];
};

// Keyed by "<primaryTab>/<subtab>", e.g. "git/fundamentals".
export const quizzes: Record<string, Quiz> = {
  'git/fundamentals': {
    questions: [
      {
        question: 'What does `git add` actually do?',
        options: ['Creates a commit', 'Moves changes into the staging area', 'Uploads changes to GitHub', 'Creates a new branch'],
        correctIndex: 1,
        explanation: '`git add` stages changes — it prepares them to be included in the next commit, but does not commit or push anything.',
      },
      {
        question: 'Which command shows which files are staged, modified, or untracked?',
        options: ['git log', 'git diff', 'git status', 'git show'],
        correctIndex: 2,
        explanation: '`git status` is your everyday snapshot of what has changed and what is (or isn’t) staged.',
      },
      {
        question: 'What is a Git branch, really?',
        options: ['A full copy of every file', 'A movable pointer to a commit', 'A separate repository', 'A saved stash'],
        correctIndex: 1,
        explanation: 'A branch is just a lightweight, movable label pointing at a commit — creating one is nearly instant because nothing is copied.',
      },
      {
        question: 'What is the modern command for switching branches?',
        options: ['git checkout', 'git switch', 'git branch --move', 'git go'],
        correctIndex: 1,
        explanation: '`git switch` was introduced to give branch switching its own focused command; the older `git checkout` still works too.',
      },
      {
        question: 'What does `git fetch` do that `git pull` does not?',
        options: ['Nothing, they are identical', 'It downloads changes without merging them into your branch', 'It pushes your commits', 'It deletes remote branches'],
        correctIndex: 1,
        explanation: '`git fetch` only updates your remote-tracking branches; `git pull` does that AND immediately merges (or rebases) into your current branch.',
      },
    ],
  },
  'git/intermediate': {
    questions: [
      {
        question: 'You want to undo a commit that was already pushed and shared with your team. What should you use?',
        options: ['git reset --hard', 'git revert', 'git clean -fd', 'git stash'],
        correctIndex: 1,
        explanation: '`git revert` creates a new commit that undoes the old one, without rewriting history — safe for commits others may already have.',
      },
      {
        question: 'What does `git stash` do?',
        options: ['Deletes uncommitted changes permanently', 'Temporarily shelves uncommitted changes so you can switch context', 'Creates a backup branch', 'Commits with an empty message'],
        correctIndex: 1,
        explanation: 'Stashing sets your uncommitted changes aside so your working directory is clean, and lets you bring them back later with `git stash pop`.',
      },
      {
        question: 'What is the difference between a fast-forward merge and a merge commit?',
        options: [
          'There is no difference',
          'A fast-forward just moves the branch pointer forward; a merge commit combines two diverged histories with a new commit',
          'Fast-forward only works on GitHub',
          'A merge commit deletes the source branch',
        ],
        correctIndex: 1,
        explanation: 'Git fast-forwards when your branch has no new commits of its own; otherwise it needs a merge commit to combine both histories.',
      },
      {
        question: 'Which command lets you edit the most recent commit’s message or contents?',
        options: ['git commit --amend', 'git reset --soft', 'git rebase -i', 'git revert HEAD'],
        correctIndex: 0,
        explanation: '`git commit --amend` replaces the last commit with a new one — perfect for a forgotten file or a typo in the message.',
      },
      {
        question: 'What does `git restore --staged <file>` do?',
        options: ['Deletes the file', 'Unstages a file, keeping its edits', 'Discards all edits to the file', 'Creates a new commit'],
        correctIndex: 1,
        explanation: 'It moves a file out of the staging area without touching its actual content — the opposite of `git add`.',
      },
    ],
  },
  'git/advanced': {
    questions: [
      {
        question: 'What does interactive rebase (`git rebase -i`) let you do that a normal rebase does not?',
        options: [
          'Nothing extra',
          'Reorder, squash, reword, or drop individual commits as they’re replayed',
          'Merge two unrelated repositories',
          'Push directly to a protected branch',
        ],
        correctIndex: 1,
        explanation: 'Interactive rebase opens an editable list of commits, letting you reshape history commit by commit before it’s replayed.',
      },
      {
        question: 'What does `git cherry-pick <commit>` do?',
        options: ['Deletes a commit', 'Applies one specific commit’s changes onto your current branch', 'Merges two branches', 'Renames a commit'],
        correctIndex: 1,
        explanation: 'Cherry-picking grabs just one commit’s changes and replays them as a new commit on your current branch.',
      },
      {
        question: 'What is `git bisect` used for?',
        options: ['Splitting a branch in two', 'Binary-searching history to find the commit that introduced a bug', 'Comparing two remotes', 'Deleting half your commits'],
        correctIndex: 1,
        explanation: '`git bisect` repeatedly checks out midpoint commits between a known-good and known-bad commit until it isolates the exact one that broke things.',
      },
      {
        question: 'Why is `git push --force-with-lease` generally safer than `git push --force`?',
        options: [
          'It’s not actually safer',
          'It fails if the remote has commits you haven’t fetched yet, avoiding accidentally overwriting someone else’s work',
          'It only works on your own branches',
          'It automatically resolves conflicts',
        ],
        correctIndex: 1,
        explanation: '`--force-with-lease` refuses to push if the remote branch has moved since your last fetch, protecting against silently discarding a teammate’s commits.',
      },
      {
        question: 'What does `git worktree add` let you do?',
        options: [
          'Add a folder to .gitignore',
          'Check out a different branch into a second working directory, without cloning again',
          'Create a new remote',
          'Merge two commits',
        ],
        correctIndex: 1,
        explanation: 'A worktree gives you an additional checkout of the same repository in another folder — handy for working on two branches at once.',
      },
    ],
  },
  'git/expert': {
    questions: [
      {
        question: 'What are the four core Git object types?',
        options: ['File, folder, branch, tag', 'Blob, tree, commit, tag', 'Index, ref, log, pack', 'Stage, commit, push, pull'],
        correctIndex: 1,
        explanation: 'A blob stores file content, a tree stores a directory listing, a commit stores a snapshot pointer plus metadata, and a tag names a specific commit.',
      },
      {
        question: 'What does HEAD normally point to?',
        options: ['The very first commit', 'The branch you currently have checked out', 'The remote repository', 'The staging area'],
        correctIndex: 1,
        explanation: 'HEAD usually points at a branch reference, which in turn points at a commit — that’s how Git knows what "current" means.',
      },
      {
        question: 'What is a packfile?',
        options: ['A single deleted file', 'A compressed bundle of many Git objects, used to save space and speed up transfers', 'A configuration file', 'A type of branch'],
        correctIndex: 1,
        explanation: 'Git periodically compresses loose objects into packfiles during garbage collection, dramatically shrinking the .git folder.',
      },
      {
        question: 'What is the difference between "plumbing" and "porcelain" commands?',
        options: [
          'There is no real difference',
          'Plumbing commands are low-level building blocks (like cat-file); porcelain commands are the friendly, everyday ones (like commit)',
          'Plumbing only works on Linux',
          'Porcelain commands are deprecated',
        ],
        correctIndex: 1,
        explanation: 'Porcelain commands are what you use daily; plumbing commands are the internal primitives porcelain is built from, useful for scripting.',
      },
      {
        question: 'What does a Git hook let you do?',
        options: [
          'Attach a file to a commit',
          'Run a custom script automatically at a specific point, like before a commit or push',
          'Connect two remotes',
          'Rename a branch',
        ],
        correctIndex: 1,
        explanation: 'Hooks live in .git/hooks and fire automatically — commonly used to run linters or tests before allowing a commit or push.',
      },
    ],
  },
  'github/basics': {
    questions: [
      {
        question: 'What is the difference between an SSH key and a personal access token?',
        options: [
          'They are the same thing',
          'An SSH key authenticates Git operations over SSH; a token authenticates over HTTPS (and the GitHub API)',
          'Tokens are only for mobile apps',
          'SSH keys expire every day',
        ],
        correctIndex: 1,
        explanation: 'Both prove who you are, but for different transport methods — SSH keys for `git@github.com:...` URLs, tokens for `https://github.com/...` URLs and API calls.',
      },
      {
        question: 'What happens when you fork a repository?',
        options: [
          'The original repository is deleted',
          'You get your own copy of it under your account, which you can freely change',
          'You automatically get write access to the original',
          'It merges into your existing repositories',
        ],
        correctIndex: 1,
        explanation: 'Forking creates an independent copy in your namespace, so you can experiment or contribute without needing write access to the original.',
      },
      {
        question: 'Why does GitHub recommend enabling two-factor authentication?',
        options: [
          'It’s required to create any repository',
          'It adds a second proof of identity beyond your password, protecting your account if the password leaks',
          'It speeds up cloning',
          'It’s only relevant for organizations',
        ],
        correctIndex: 1,
        explanation: '2FA means a leaked password alone isn’t enough to access your account — a huge boost in account security.',
      },
      {
        question: 'What does a repository’s visibility setting (public/private) control?',
        options: [
          'Whether it has a README',
          'Who can see the repository at all',
          'Whether Issues are enabled',
          'The default branch name',
        ],
        correctIndex: 1,
        explanation: 'Public repositories are visible to anyone; private ones are visible only to people explicitly given access.',
      },
      {
        question: 'What is a README.md file for?',
        options: [
          'It configures GitHub Actions',
          'It’s the front page of your repository — an introduction rendered automatically on the repo’s homepage',
          'It stores secrets',
          'It lists all contributors automatically',
        ],
        correctIndex: 1,
        explanation: 'GitHub automatically renders README.md on the repository’s main page — it’s usually the first thing a visitor reads.',
      },
    ],
  },
  'github/collaboration': {
    questions: [
      {
        question: 'What is a draft pull request for?',
        options: [
          'A PR that has been rejected',
          'Signaling the PR isn’t ready for review yet, while still running checks and staying visible to the team',
          'A private PR only you can see',
          'A PR that can’t be merged, ever',
        ],
        correctIndex: 1,
        explanation: 'Draft PRs let you share work-in-progress and get early CI feedback without triggering a formal review request.',
      },
      {
        question: 'What does a squash merge do?',
        options: [
          'Deletes the pull request',
          'Combines all commits from the branch into a single commit on the target branch',
          'Rejects the merge if there are conflicts',
          'Automatically deletes the source branch’s history everywhere',
        ],
        correctIndex: 1,
        explanation: 'Squash merging keeps the target branch’s history tidy — one clean commit per PR instead of every intermediate commit.',
      },
      {
        question: 'What does a CODEOWNERS file do?',
        options: [
          'Lists repository administrators only',
          'Automatically requests specific people or teams as reviewers when matching files change',
          'Blocks certain files from being edited',
          'Assigns issues automatically',
        ],
        correctIndex: 1,
        explanation: 'CODEOWNERS maps file paths to reviewers, so the right people get pulled into a PR automatically based on what changed.',
      },
      {
        question: 'What is a "suggested change" in a GitHub code review?',
        options: [
          'A private note only the author can see',
          'An inline edit a reviewer proposes that the author can accept with one click',
          'A required change that blocks merging automatically',
          'A comment that closes the PR',
        ],
        correctIndex: 1,
        explanation: 'Suggested changes let a reviewer propose exact replacement text inline, which the PR author can commit directly if they agree.',
      },
      {
        question: 'What are GitHub Issues primarily used for?',
        options: [
          'Hosting code',
          'Tracking bugs, tasks, and discussions, separately from the actual code changes',
          'Running automated tests',
          'Storing secrets',
        ],
        correctIndex: 1,
        explanation: 'Issues are GitHub’s lightweight tracker for anything that needs discussion or follow-up, linked to but distinct from code changes.',
      },
    ],
  },
  'github/project-management': {
    questions: [
      {
        question: 'What is a GitHub Projects board used for?',
        options: [
          'Hosting a static website',
          'Visually planning and tracking work — issues and PRs organized into views like a board, table, or roadmap',
          'Storing release binaries',
          'Running CI/CD workflows',
        ],
        correctIndex: 1,
        explanation: 'Projects gives you flexible views (board/table/roadmap) over your issues and PRs, with custom fields for planning.',
      },
      {
        question: 'What does writing "Closes #42" in a pull request description do?',
        options: [
          'Nothing automatic',
          'Automatically closes issue #42 when the pull request is merged',
          'Deletes issue #42',
          'Assigns issue #42 to the PR author',
        ],
        correctIndex: 1,
        explanation: 'GitHub recognizes closing keywords like "Closes", "Fixes", and "Resolves" and closes the linked issue automatically on merge.',
      },
      {
        question: 'What is a milestone used for?',
        options: [
          'Marking a single commit',
          'Grouping issues and pull requests around a shared goal or deadline, with progress tracking',
          'Protecting a branch',
          'Triggering a workflow',
        ],
        correctIndex: 1,
        explanation: 'Milestones bundle related issues/PRs so you can track progress toward a release or goal at a glance.',
      },
      {
        question: 'What triggers a GitHub notification by default?',
        options: [
          'Only when you push code',
          'Being mentioned, assigned, or participating in a thread you’re watching',
          'Every commit on every repository you’ve ever viewed',
          'Nothing — notifications must be manually requested each time',
        ],
        correctIndex: 1,
        explanation: 'GitHub notifies you based on participation and mentions, plus anything you’re explicitly watching.',
      },
      {
        question: 'What is a saved reply for?',
        options: [
          'Auto-merging pull requests',
          'Reusing a canned response text in issues and PR comments without retyping it',
          'Saving draft commits',
          'Scheduling a comment for later',
        ],
        correctIndex: 1,
        explanation: 'Saved replies are personal templates for text you type often — handy for maintainers answering similar questions repeatedly.',
      },
    ],
  },
  'github/automation-cicd': {
    questions: [
      {
        question: 'What is the top-level key in a workflow YAML file that defines what triggers it?',
        options: ['jobs', 'on', 'steps', 'runs-on'],
        correctIndex: 1,
        explanation: 'The `on` key defines the events (push, pull_request, schedule, etc.) that trigger the workflow.',
      },
      {
        question: 'What is a matrix build used for?',
        options: [
          'Encrypting secrets',
          'Running the same job across multiple combinations of variables, like several OS/version pairs, in parallel',
          'Merging multiple workflows into one',
          'Caching dependencies',
        ],
        correctIndex: 1,
        explanation: 'A matrix expands one job definition into many parallel runs — perfect for testing across Node versions or operating systems.',
      },
      {
        question: 'What are GitHub Actions secrets for?',
        options: [
          'Public configuration values',
          'Storing sensitive values (API keys, tokens) encrypted, exposed to workflows only at runtime',
          'Hiding entire workflow files',
          'Encrypting commit messages',
        ],
        correctIndex: 1,
        explanation: 'Secrets keep credentials out of your code while still letting workflows use them securely at runtime.',
      },
      {
        question: 'What does an "environment" with required reviewers do in GitHub Actions?',
        options: [
          'Nothing functional, it’s just a label',
          'Pauses a deployment job until an approved reviewer manually approves it',
          'Automatically deploys to production on every push',
          'Deletes old deployments',
        ],
        correctIndex: 1,
        explanation: 'Environments with protection rules let you require manual approval before a job (like a production deploy) proceeds.',
      },
      {
        question: 'What is a reusable workflow (`workflow_call`) for?',
        options: [
          'Running a workflow twice by accident',
          'Letting one workflow call another as a component, avoiding duplicated YAML across repositories',
          'Caching node_modules',
          'Restarting a failed job',
        ],
        correctIndex: 1,
        explanation: 'Reusable workflows let you define common CI/CD logic once and call it from multiple workflows or repositories.',
      },
    ],
  },
  'github/security': {
    questions: [
      {
        question: 'What does secret scanning with push protection do?',
        options: [
          'Encrypts all commits',
          'Detects known secret formats and blocks a push before the secret ever reaches GitHub',
          'Deletes secrets after they’re found',
          'Only scans public repositories',
        ],
        correctIndex: 1,
        explanation: 'Push protection stops a likely secret at push-time, before it’s exposed in the repository’s history at all.',
      },
      {
        question: 'What does Dependabot do?',
        options: [
          'Reviews pull requests for style issues',
          'Opens automatic pull requests to update dependencies and flag known vulnerabilities',
          'Deploys your application',
          'Manages team permissions',
        ],
        correctIndex: 1,
        explanation: 'Dependabot watches your dependency manifests and proactively proposes updates, especially for known security issues.',
      },
      {
        question: 'What is CodeQL used for?',
        options: [
          'Formatting code',
          'Semantic analysis of your source code to automatically find security vulnerabilities',
          'Running unit tests',
          'Managing releases',
        ],
        correctIndex: 1,
        explanation: 'CodeQL treats code as queryable data, letting GitHub’s code scanning find patterns that indicate real vulnerabilities.',
      },
      {
        question: 'Why would a GitHub Actions workflow use OIDC instead of a stored cloud secret?',
        options: [
          'OIDC is faster to type',
          'It exchanges a short-lived token at runtime instead of storing a long-lived credential in the repository',
          'OIDC disables all authentication',
          'It only works with GitHub Pages',
        ],
        correctIndex: 1,
        explanation: 'OpenID Connect lets workflows request short-lived cloud credentials on demand, removing the need to store long-lived secrets at all.',
      },
      {
        question: 'What is a branch protection rule (or ruleset) most commonly used for?',
        options: [
          'Hiding a branch from collaborators',
          'Requiring things like passing checks or approved reviews before changes can be merged into a branch',
          'Automatically deleting old branches',
          'Renaming branches',
        ],
        correctIndex: 1,
        explanation: 'Branch protection enforces your team’s quality bar — no merging without green checks or the required approvals.',
      },
    ],
  },
  'github/admin-teams': {
    questions: [
      {
        question: 'What is the main difference between a GitHub App and an OAuth App?',
        options: [
          'There is no difference',
          'GitHub Apps get fine-grained, installation-based permissions and act as their own identity; OAuth Apps act as the authorizing user',
          'OAuth Apps are always free',
          'GitHub Apps cannot access the API',
        ],
        correctIndex: 1,
        explanation: 'GitHub Apps are the more modern, more secure integration model — scoped permissions per installation rather than broad user-level access.',
      },
      {
        question: 'What is a webhook?',
        options: [
          'A type of branch',
          'An HTTP callback GitHub sends to a URL you configure whenever a chosen event happens',
          'A GitHub Actions runner',
          'A security scanning tool',
        ],
        correctIndex: 1,
        explanation: 'Webhooks push real-time event data to an external service — the backbone of many third-party GitHub integrations.',
      },
      {
        question: 'What is a Codespace?',
        options: [
          'A local-only virtual machine',
          'A cloud-hosted, configurable dev environment you can open directly from a repository',
          'A type of GitHub organization',
          'A CI/CD runner',
        ],
        correctIndex: 1,
        explanation: 'Codespaces spins up a ready-to-code cloud environment (often defined by a dev container) right from your browser or editor.',
      },
      {
        question: 'In a GitHub organization, what do teams primarily provide?',
        options: [
          'A chat feature',
          'A way to group people and manage their repository access and permissions together',
          'A billing plan',
          'A code review bot',
        ],
        correctIndex: 1,
        explanation: 'Teams let you grant and manage repository permissions for groups of people at once, instead of one by one.',
      },
      {
        question: 'What does the `gh` CLI let you do that the website also does?',
        options: [
          'Nothing, it’s a completely different product',
          'Perform GitHub actions like creating PRs, checking out reviews, and managing issues, from the terminal',
          'Only view repository statistics',
          'Only manage organization billing',
        ],
        correctIndex: 1,
        explanation: 'The GitHub CLI brings core GitHub workflows into your terminal — creating PRs, reviewing, managing issues — without leaving the command line.',
      },
    ],
  },
  'github/open-source': {
    questions: [
      {
        question: 'What is the typical first step to contribute to an open-source project you don’t have write access to?',
        options: ['Email the maintainer your code as a zip file', 'Fork the repository', 'Delete the main branch', 'Open a support ticket'],
        correctIndex: 1,
        explanation: 'Forking gives you your own copy to work in, which you then propose merging back via a pull request.',
      },
      {
        question: 'How do you keep a fork up to date with the original repository?',
        options: [
          'Delete and re-fork it every time',
          'Add the original as a remote (commonly called "upstream"), fetch it, and merge or rebase onto it',
          'It updates automatically forever',
          'You can’t — forks are permanently frozen',
        ],
        correctIndex: 1,
        explanation: 'Adding an `upstream` remote lets you regularly pull in the original project’s new commits and stay in sync.',
      },
      {
        question: 'What is a "good first issue" label typically used for?',
        options: [
          'The most urgent bug in the project',
          'Marking beginner-friendly tasks that are a good entry point for new contributors',
          'Issues that will never be fixed',
          'Issues only maintainers can work on',
        ],
        correctIndex: 1,
        explanation: 'Maintainers tag approachable, well-scoped issues this way specifically to help newcomers find a place to start.',
      },
      {
        question: 'What is a CODE_OF_CONDUCT.md file for?',
        options: [
          'Listing coding style rules',
          'Setting expectations for respectful behavior within the project community',
          'Configuring CI/CD',
          'Licensing the code',
        ],
        correctIndex: 1,
        explanation: 'A code of conduct establishes community norms and how violations are handled — separate from technical contribution rules.',
      },
      {
        question: 'What is GitHub Sponsors?',
        options: [
          'A code review tool',
          'A built-in way for people to financially support open-source maintainers and projects directly through GitHub',
          'A CI/CD runner provider',
          'A project management board',
        ],
        correctIndex: 1,
        explanation: 'Sponsors lets supporters fund the developers and projects they rely on, directly through GitHub, often on a recurring basis.',
      },
    ],
  },
};
