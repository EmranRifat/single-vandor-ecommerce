import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../components/providers';
import Navbar from '../components/navbar';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopHub - Your One-Stop E-commerce Store',
  description: 'Discover amazing products at great prices. Shop electronics, fashion, home & living, and sports equipment.',
  openGraph: {
    images: [
      {
        url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <Providers>
          <Navbar />
          {children}
        </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
