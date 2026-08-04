import { Helmet } from 'react-helmet-async';

const SITE = 'https://vointy.life';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
  ogType?: string;
}

const Seo = ({ title, description, path, jsonLd, noindex, ogType = 'website' }: SeoProps) => {
  const url = `${SITE}${path}`;
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
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
