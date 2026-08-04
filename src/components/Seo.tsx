import { Helmet } from 'react-helmet-async';

const SITE = 'https://vointy.life';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
  ogType?: string;
  image?: string;
}

const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

const Seo = ({ title, description, path, jsonLd, noindex, ogType = 'website', image }: SeoProps) => {
  const url = `${SITE}${path}`;
  const imageUrl = image?.startsWith('http') ? image : `${SITE}${image ?? '/og-image.jpg'}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
