/**
 * SEO Metadata configuration for different pages
 */

export const siteMetadata = {
  title: 'Employee Intelligence',
  description: 'Real-time performance & engagement analytics platform for your workforce',
  url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  twitter: '@employeeintel',
  locale: 'en_US',
  author: {
    name: 'Employee Intelligence',
    email: 'support@example.com',
  },
  keywords: [
    'employee analytics',
    'performance tracking',
    'engagement metrics',
    'workforce intelligence',
    'HR analytics',
  ],
};

export const pageMetadata = {
  '/': {
    title: 'Employee Intelligence - Performance Analytics',
    description: 'Monitor employee performance and engagement in real-time',
  },
  '/dashboard': {
    title: 'Dashboard - Employee Intelligence',
    description: 'View your performance metrics and analytics dashboard',
  },
  '/employees': {
    title: 'Employees - Employee Intelligence',
    description: 'Manage and view employee profiles and performance data',
  },
  '/feedback': {
    title: 'Feedback - Employee Intelligence',
    description: 'Share and view peer feedback',
  },
  '/risk': {
    title: 'Risk Analysis - Employee Intelligence',
    description: 'Identify flight risk and retention metrics',
  },
  '/pay-fairness': {
    title: 'Pay Fairness - Employee Intelligence',
    description: 'Analyze salary equity and compensation fairness',
  },
};

/**
 * Get metadata for a specific pathname
 */
export function getPageMetadata(pathname: string) {
  const metadata = pageMetadata[pathname as keyof typeof pageMetadata];
  return metadata || {
    title: siteMetadata.title,
    description: siteMetadata.description,
  };
}

/**
 * Generate OpenGraph metadata object
 */
export function generateOpenGraph(
  title: string,
  description: string,
  image?: string,
  pathname?: string
) {
  return {
    title,
    description,
    url: `${siteMetadata.url}${pathname || '/'}`,
    type: 'website' as const,
    images: [
      {
        url: image || `${siteMetadata.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCard(title: string, description: string, image?: string) {
  return {
    card: 'summary_large_image' as const,
    title,
    description,
    images: [image || `${siteMetadata.url}/twitter-image.png`],
    creator: siteMetadata.twitter,
  };
}

/**
 * Generate structured data for Schema.org
 */
export function generateStructuredData(
  type: 'Organization' | 'WebSite' | 'WebPage',
  data: Record<string, unknown>
) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  return { ...baseData, ...data };
}
