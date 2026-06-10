import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_NAMES = {
  '/':            'Home',
  '/about':       'About',
  '/products':    'Products',
  '/leadership':  'Leadership',
  '/achievements':'Achievements',
  '/contact':     'Contact',
  '/shop':        'Shop',
};

export function usePageView() {
  const { pathname } = useLocation();
  useEffect(() => {
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: PAGE_NAMES[pathname] || pathname, path: pathname })
    }).catch(() => {});
  }, [pathname]);
}
