import { Metadata } from 'next';
import { toSiteURL } from '../helpers';

export function getGeneralMetadata({
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
  const effectiveTitle = `${title} | Nextbase Starter Kit`;
  const effectiveKeywords = [
    ...(keywords ? keywords : []),
    'boilerplate',
    'nextbase starter kit',
    'nextbase boilerplate',
    'nextbase saas starter kit',
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
          url: `/general-og/${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      images: [
        {
          url: `/general-og/${encodeURIComponent(title)}`,
        },
      ],
    },
  };
}
