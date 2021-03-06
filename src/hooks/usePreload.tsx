import { ReactElement, useEffect, useState } from 'react';
import logo from '../assets/img/logo.png';

const images = [logo];

const load = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
};

const loadAll = (urls: string[]) => Promise.all(urls.map(load));

const timeout = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const withPreload = (Component: React.FC, time: number): React.FC => {
  return (): ReactElement => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      Promise.race([loadAll(images), timeout(time)]).then(() => {
        setLoaded(true);
      });
    }, []);

    if (!loaded) {
      return (
        <div className="initial-loading">
          <img src="/loading-dragon.gif" />
        </div>
      );
    }

    return <Component />;
  };
};
