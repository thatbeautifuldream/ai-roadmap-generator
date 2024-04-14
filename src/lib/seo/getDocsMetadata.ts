import { Metadata } from 'next';
import { toSiteURL } from '../helpers';

export function getDocsMetadata({
  title,
  keywords,
  description,
  path,
}: {
  title: string;
  keywords?: Array<string> | undefined;
  description: NonNullable<Metadata['description']>;
  path: string;
}): Metadata {
  const effectiveTitle = `${title} | Nextbase Starter Kit Documentation`;
  const effectiveKeywords = [
    ...(keywords ? keywords : []),
    'documentation',
    'nextbase starter kit',
    'nextbase docs',
    'nextjs',
  ];
  return {
    title: effectiveTitle,
    keywords: effectiveKeywords,
    description,
    openGraph: {
      title: effectiveTitle,
      description: description,
      url: toSiteURL(path),
      type: 'website',
      images: [
        {
          url: `/docs-og/${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      images: [
        {
          url: `/docs-og/${encodeURIComponent(title)}`,
        },
      ],
    },
  };
}
