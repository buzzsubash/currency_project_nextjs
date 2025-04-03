// pages/404.tsx
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Custom404() {
  return (
    <Layout
      title="404 - Page Not Found | Currency Converter"
      description="The page you are looking for does not exist."
    >
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-8">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you are looking for doesn&#39;t exist or has been moved.</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
}