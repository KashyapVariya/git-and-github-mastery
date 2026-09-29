export type PathTask = { title: string; href: string };
export type PathStage = {
  id: string;
  title: string;
  focus: string;
  tasks: PathTask[];
  practice: string;
};
export type LearningPlan = { id: string; title: string; tagline: string; stages: PathStage[] };

export const learningPlans: LearningPlan[] = [
  {
    id: '4-week',
    title: '4-Week Fast Track',
    tagline: 'For getting productive with Git and GitHub quickly, at a steady daily pace.',
    stages: [
      {
        id: 'week-1',
        title: 'Week 1 — Git fundamentals',
        focus: 'The mental model, and the everyday loop of status → add → commit → log.',
        tasks: [
          { title: 'What is version control?', href: '/git/fundamentals/what-is-version-control' },
          { title: 'Installing Git', href: '/git/fundamentals/installing-git' },
          { title: 'First-time setup', href: '/git/fundamentals/first-time-setup' },
          { title: 'git init', href: '/git/fundamentals/git-init' },
          { title: 'Staging with add', href: '/git/fundamentals/staging-with-add' },
          { title: 'Making commits', href: '/git/fundamentals/making-commits' },
          { title: 'Viewing history with log', href: '/git/fundamentals/viewing-history-with-log' },
        ],
        practice: 'Create a folder, run git init, and make five small commits to a text file — each with a message describing exactly what changed.',
      },
      {
        id: 'week-2',
        title: 'Week 2 — Branches & GitHub basics',
        focus: 'Branching locally, then pushing your first repository to GitHub.',
        tasks: [
          { title: 'Branching basics', href: '/git/fundamentals/branching-basics' },
          { title: 'Merging basics', href: '/git/fundamentals/merging-basics' },
          { title: 'Working with remotes', href: '/git/fundamentals/working-with-remotes' },
          { title: 'Push and pull', href: '/git/fundamentals/push-and-pull' },
          { title: 'Creating a GitHub account', href: '/github/basics/creating-a-github-account' },
          { title: 'SSH keys', href: '/github/basics/ssh-keys' },
          { title: 'Creating a repository', href: '/github/basics/creating-a-repository' },
        ],
        practice: 'Push last week’s local repo to a new GitHub repository, then create a branch, make a change, and merge it back into main.',
      },
      {
        id: 'week-3',
        title: 'Week 3 — Collaboration',
        focus: 'Pull requests, review, and recovering gracefully from mistakes.',
        tasks: [
          { title: 'Pull requests, basics', href: '/github/collaboration/pull-requests-basics' },
          { title: 'Code review on GitHub', href: '/github/collaboration/code-review-on-github' },
          { title: 'Merge methods', href: '/github/collaboration/merge-methods' },
          { title: 'Stashing changes', href: '/git/intermediate/stashing-changes' },
          { title: 'restore vs reset vs revert', href: '/git/intermediate/restore-vs-reset-vs-revert' },
          { title: 'Resolving merge conflicts', href: '/git/intermediate/resolving-merge-conflicts' },
        ],
        practice: 'Open a pull request on your GitHub repo (even solo), request a review from yourself via a second account or a friend, and merge it with squash merge.',
      },
      {
        id: 'week-4',
        title: 'Week 4 — Real workflow',
        focus: 'Conventions and just enough advanced Git to work confidently on a team.',
        tasks: [
          { title: 'GitHub Flow', href: '/workflows/github-flow' },
          { title: 'Commit message conventions', href: '/workflows/commit-message-conventions' },
          { title: 'Rebase, basics', href: '/git/advanced/rebase-basics' },
          { title: 'GitHub Actions overview', href: '/github/automation-cicd/github-actions-overview' },
        ],
        practice: 'Add a simple GitHub Actions workflow to your repo that runs on every push — even just printing "hello" — and watch it execute in the Actions tab.',
      },
    ],
  },
  {
    id: '8-week',
    title: '8-Week Deep Dive',
    tagline: 'A thorough path from your first commit to Git internals and CI/CD, at a comfortable pace.',
    stages: [
      {
        id: 'w1',
        title: 'Week 1 — Mental model',
        focus: 'How Git actually thinks about your files.',
        tasks: [
          { title: 'What is version control?', href: '/git/fundamentals/what-is-version-control' },
          { title: 'Git vs GitHub', href: '/git/fundamentals/git-vs-github' },
          { title: 'The four areas', href: '/git/fundamentals/the-four-areas' },
          { title: 'Installing Git', href: '/git/fundamentals/installing-git' },
          { title: 'First-time setup', href: '/git/fundamentals/first-time-setup' },
        ],
        practice: 'Draw the four areas (working directory, staging, repo, remote) from memory, then check it against the diagram on "The four areas."',
      },
      {
        id: 'w2',
        title: 'Week 2 — The daily loop',
        focus: 'status, add, commit, log, diff, and ignoring files.',
        tasks: [
          { title: 'git status', href: '/git/fundamentals/git-status' },
          { title: 'Staging with add', href: '/git/fundamentals/staging-with-add' },
          { title: 'Making commits', href: '/git/fundamentals/making-commits' },
          { title: 'Viewing history with log', href: '/git/fundamentals/viewing-history-with-log' },
          { title: '.gitignore basics', href: '/git/fundamentals/gitignore-basics' },
        ],
        practice: 'Build a tiny project (a few files) entirely through small, well-described commits — aim for at least 10 by the end of the week.',
      },
      {
        id: 'w3',
        title: 'Week 3 — Branching & merging',
        focus: 'Creating, switching, and combining lines of work.',
        tasks: [
          { title: 'Branching basics', href: '/git/fundamentals/branching-basics' },
          { title: 'Switching branches', href: '/git/fundamentals/switching-branches' },
          { title: 'Merging basics', href: '/git/fundamentals/merging-basics' },
          { title: 'Fast-forward vs merge commit', href: '/git/intermediate/fast-forward-vs-merge-commit' },
          { title: 'Resolving merge conflicts', href: '/git/intermediate/resolving-merge-conflicts' },
        ],
        practice: 'Intentionally create a merge conflict between two branches, then resolve it by hand.',
      },
      {
        id: 'w4',
        title: 'Week 4 — Remotes & GitHub basics',
        focus: 'Getting your work online and set up securely.',
        tasks: [
          { title: 'Working with remotes', href: '/git/fundamentals/working-with-remotes' },
          { title: 'Push and pull', href: '/git/fundamentals/push-and-pull' },
          { title: 'SSH keys', href: '/github/basics/ssh-keys' },
          { title: 'Two-factor authentication', href: '/github/basics/two-factor-authentication' },
          { title: 'Creating a repository', href: '/github/basics/creating-a-repository' },
        ],
        practice: 'Set up SSH authentication from scratch and push a repository using git@github.com instead of HTTPS.',
      },
      {
        id: 'w5',
        title: 'Week 5 — Undoing things & collaboration',
        focus: 'Fixing mistakes safely, and working through pull requests.',
        tasks: [
          { title: 'restore vs reset vs revert', href: '/git/intermediate/restore-vs-reset-vs-revert' },
          { title: 'Amending commits', href: '/git/intermediate/amending-commits' },
          { title: 'Stashing changes', href: '/git/intermediate/stashing-changes' },
          { title: 'Pull requests, basics', href: '/github/collaboration/pull-requests-basics' },
          { title: 'Code review on GitHub', href: '/github/collaboration/code-review-on-github' },
        ],
        practice: 'On a throwaway repo, deliberately make three different kinds of mistakes, then fix each one using the matching Fix It guide.',
      },
      {
        id: 'w6',
        title: 'Week 6 — Rewriting history',
        focus: 'Rebase, cherry-pick, and searching history like a pro.',
        tasks: [
          { title: 'Rebase, basics', href: '/git/advanced/rebase-basics' },
          { title: 'Interactive rebase', href: '/git/advanced/interactive-rebase' },
          { title: 'Cherry-picking', href: '/git/advanced/cherry-picking' },
          { title: 'The reflog', href: '/git/advanced/the-reflog' },
          { title: 'Bisecting bugs', href: '/git/advanced/bisecting-bugs' },
        ],
        practice: 'Use git rebase -i to squash your last five commits into one clean, well-described commit.',
      },
      {
        id: 'w7',
        title: 'Week 7 — Automation',
        focus: 'GitHub Actions, from a first workflow to real CI.',
        tasks: [
          { title: 'GitHub Actions overview', href: '/github/automation-cicd/github-actions-overview' },
          { title: 'Workflow syntax', href: '/github/automation-cicd/workflow-syntax' },
          { title: 'Events and triggers', href: '/github/automation-cicd/events-and-triggers' },
          { title: 'Secrets and variables', href: '/github/automation-cicd/secrets-and-variables' },
          { title: 'Branch protection rules', href: '/github/security/branch-protection-rules' },
        ],
        practice: 'Write a workflow that runs your project’s tests (or a simple lint check) on every pull request, and require it to pass before merging.',
      },
      {
        id: 'w8',
        title: 'Week 8 — Internals & polish',
        focus: 'What Git is doing underneath, and the conventions that make teams fast.',
        tasks: [
          { title: 'Git objects: blob, tree, commit, tag', href: '/git/expert/git-objects-blob-tree-commit-tag' },
          { title: 'Refs and HEAD', href: '/git/expert/refs-and-head' },
          { title: 'Git hooks', href: '/git/expert/git-hooks' },
          { title: 'Conventional Commits', href: '/workflows/commit-message-conventions' },
          { title: 'GitHub Flow', href: '/workflows/github-flow' },
        ],
        practice: 'Run git cat-file -p on a commit, its tree, and one of its blobs to see the raw objects Git actually stores.',
      },
    ],
  },
];
