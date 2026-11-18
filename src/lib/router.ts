import { useEffect, useState } from 'react';

// Tiny hash router: #/  #/brush  #/q/hab_0  #/done?kind=brush
export type Route = { path: string; params: URLSearchParams };

function read(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query] = raw.split('?');
  return { path: path || '/', params: new URLSearchParams(query || '') };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(read);
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function go(to: string): void {
  window.location.hash = to;
}
