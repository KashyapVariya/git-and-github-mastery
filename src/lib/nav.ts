export type PrimaryTab = {
  slug: string;
  label: string;
  href: string;
  hint: string;
};

export const primaryTabs: PrimaryTab[] = [
  { slug: 'start-here', label: 'Start Here', href: '/', hint: 'Orientation & setup' },
  { slug: 'git', label: 'Git', href: '/git/fundamentals', hint: 'The tool itself' },
  { slug: 'github', label: 'GitHub', href: '/github/basics', hint: 'Hosting & collaboration' },
  { slug: 'workflows', label: 'Workflows', href: '/workflows', hint: 'Team conventions' },
  { slug: 'fix-it', label: 'Fix It', href: '/fix-it', hint: 'Troubleshooting' },
  { slug: 'cheat-sheet', label: 'Cheat Sheet', href: '/cheat-sheet', hint: 'Every command' },
  { slug: 'playground', label: 'Playground', href: '/playground', hint: 'Try it live' },
  { slug: 'learning-path', label: 'Learning Path', href: '/learning-path', hint: 'Guided plans' },
  { slug: 'resources', label: 'Resources', href: '/resources', hint: 'Docs & glossary' },
];

export type SubTab = {
  slug: string;
  label: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
};

export const gitSubtabs: SubTab[] = [
  { slug: 'fundamentals', label: 'Fundamentals', level: 'beginner' },
  { slug: 'intermediate', label: 'Intermediate', level: 'intermediate' },
  { slug: 'advanced', label: 'Advanced', level: 'advanced' },
  { slug: 'expert', label: 'Expert / Internals', level: 'expert' },
];

export const githubSubtabs: SubTab[] = [
  { slug: 'basics', label: 'Basics' },
  { slug: 'collaboration', label: 'Collaboration' },
  { slug: 'project-management', label: 'Project Management' },
  { slug: 'automation-cicd', label: 'Automation & CI/CD' },
  { slug: 'security', label: 'Security' },
  { slug: 'admin-teams', label: 'Admin & Teams' },
  { slug: 'open-source', label: 'Open Source' },
];

export function subtabsFor(primaryTab: string): SubTab[] {
  if (primaryTab === 'git') return gitSubtabs;
  if (primaryTab === 'github') return githubSubtabs;
  return [];
}

export function subtabLabel(primaryTab: string, subtab: string): string {
  const tabs = subtabsFor(primaryTab);
  return tabs.find((t) => t.slug === subtab)?.label ?? subtab;
}

/** Prefix a root-relative path with the configured Astro `base`. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}
