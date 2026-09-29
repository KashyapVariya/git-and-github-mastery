export type Resource = {
  title: string;
  description: string;
  url: string;
};

export type ResourceGroup = {
  id: string;
  title: string;
  items: Resource[];
};

export const resources: ResourceGroup[] = [
  {
    id: 'official-docs',
    title: 'Official documentation',
    items: [
      { title: 'Git documentation', description: 'The canonical reference for every Git command and concept.', url: 'https://git-scm.com/doc' },
      { title: 'Pro Git book', description: 'The free, official Git book — thorough and beginner-friendly.', url: 'https://git-scm.com/book' },
      { title: 'Git command reference', description: 'Full man-page style reference for every Git subcommand.', url: 'https://git-scm.com/docs' },
      { title: 'GitHub Docs', description: 'Official documentation for every GitHub feature, from repos to Actions.', url: 'https://docs.github.com' },
      { title: 'GitHub CLI manual', description: 'Full command reference for the gh command-line tool.', url: 'https://cli.github.com/manual' },
    ],
  },
  {
    id: 'interactive-learning',
    title: 'Interactive tutorials',
    items: [
      { title: 'GitHub Skills', description: 'Hands-on, GitHub-hosted courses that run inside real repositories.', url: 'https://skills.github.com' },
      { title: 'Learn Git Branching', description: 'A visual, interactive sandbox for practicing branching and rebasing.', url: 'https://learngitbranching.js.org' },
      { title: 'Atlassian Git tutorials', description: 'Clear, example-driven tutorials covering Git concepts and workflows.', url: 'https://www.atlassian.com/git/tutorials' },
      { title: 'Oh Shit, Git!?!', description: 'A friendly cheat sheet for recovering from common Git mistakes.', url: 'https://ohshitgit.com' },
    ],
  },
  {
    id: 'conventions',
    title: 'Conventions & standards',
    items: [
      { title: 'Conventional Commits', description: 'A specification for structured, machine-readable commit messages.', url: 'https://www.conventionalcommits.org' },
      { title: 'Semantic Versioning', description: 'The MAJOR.MINOR.PATCH versioning specification.', url: 'https://semver.org' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools worth knowing',
    items: [
      { title: 'GitHub Desktop', description: 'A friendly graphical Git client from GitHub.', url: 'https://desktop.github.com' },
      { title: 'Lazygit', description: 'A fast, keyboard-driven terminal UI for Git.', url: 'https://github.com/jesseduffield/lazygit' },
      { title: 'GitKraken', description: 'A visual Git client with a rich commit graph and merge tools.', url: 'https://www.gitkraken.com' },
      { title: 'Git LFS', description: 'Git extension for versioning large binary files efficiently.', url: 'https://git-lfs.com' },
      { title: 'pre-commit', description: 'A framework for managing and running Git hooks across languages.', url: 'https://pre-commit.com' },
      { title: 'git-filter-repo', description: 'The recommended modern tool for rewriting repository history.', url: 'https://github.com/newren/git-filter-repo' },
    ],
  },
];
