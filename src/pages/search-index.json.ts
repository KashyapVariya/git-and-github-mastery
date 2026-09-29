import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { glossary } from '../data/glossary';
import { cheatsheet } from '../data/cheatsheet';
import { primaryTabs, url } from '../lib/nav';

export const prerender = true;

export const GET: APIRoute = async () => {
  const topics = await getCollection('topics', ({ data }) => !data.draft);
  const fixes = await getCollection('fixes');

  const entries = [
    ...primaryTabs.map((t) => ({
      type: 'page' as const,
      title: t.label,
      description: t.hint,
      url: url(t.href),
      tags: [t.slug],
    })),
    ...topics.map((t) => ({
      type: 'topic' as const,
      title: t.data.title,
      description: t.data.summary,
      url: url(`/${t.data.primaryTab}/${t.data.subtab}/${t.id.split('/').pop()}`),
      tags: [...t.data.tags, t.data.category, t.data.level],
      level: t.data.level,
    })),
    ...fixes.map((f) => ({
      type: 'fix' as const,
      title: f.data.title,
      description: f.data.summary,
      url: url(`/fix-it/${f.id.split('/').pop()}`),
      tags: f.data.tags,
    })),
    ...glossary.map((g) => ({
      type: 'glossary' as const,
      title: g.term,
      description: g.definition,
      url: url('/resources/glossary'),
      tags: [],
    })),
    ...cheatsheet.flatMap((cat) =>
      cat.commands.map((c) => ({
        type: 'command' as const,
        title: c.command,
        description: c.description,
        url: url(`/cheat-sheet#${cat.id}`),
        tags: [cat.title],
      })),
    ),
  ];

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  });
};
