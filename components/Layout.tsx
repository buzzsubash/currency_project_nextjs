import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "SGD to MYR - Convert Singapore Dollar to Malaysian Ringgit | Real-Time Rates - Sgd.to",
  description = "Quickly convert SGD to MYR with our real-time currency converter. Get accurate Singapore Dollar to Malaysian Ringgit rates. Start converting now!"
}) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />.
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" 
        />
      </Head>

      <nav className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between py-3">
            <Link href="/" className="text-xl font-bold text-white no-underline">
              SGD.to
            </Link>
            
            <button 
              className="lg:hidden border border-gray-500 rounded px-3 py-1 text-white" 
              id="navbar-toggler"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">
                <i className="fas fa-bars"></i>
              </span>
            </button>
            
            <div className="hidden w-full lg:block lg:w-auto" id="navbar-content">
              <ul className="flex flex-col lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <Link href="/" className="block py-2 px-3 text-gray-400 hover:text-white no-underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="block py-2 px-3 text-gray-400 hover:text-white no-underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="block py-2 px-3 text-gray-400 hover:text-white no-underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="block py-2 px-3 text-gray-400 hover:text-white no-underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">SGD.to</h3>
              <p className="text-gray-400">
                Your reliable source for real-time currency conversion.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white no-underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white no-underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white no-underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white no-underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SGD.to. All rights reserved.</p>
          </div>
        </div>
      </footer>

<script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Run immediately or on DOMContentLoaded, whichever happens first
              function setupNavToggle() {
                const navbarToggler = document.getElementById('navbar-toggler');
                const navbarContent = document.getElementById('navbar-content');
                
                if (navbarToggler && navbarContent) {
                  navbarToggler.addEventListener('click', function() {
                    navbarContent.classList.toggle('hidden');
                  });
                }
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', setupNavToggle);
              } else {
                setupNavToggle();
              }
            })();
          `,
        }}
      />
    </>
  );
};

export default Layout;