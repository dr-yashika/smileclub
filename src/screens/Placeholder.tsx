import { useApp } from '../lib/store';
import { NavBar, Stars, TopBar } from '../ui/components';

// Learn, Journey, Rewards and Grown-ups arrive in the next build
export function Placeholder({ tab }: { tab: 'learn' | 'journey' | 'rewards' | 'today' }) {
  const { t } = useApp();
  return (
    <div className="app">
      <Stars />
      <TopBar />
      <div className="placeholder">{t('comingSoon')}</div>
      <NavBar active={tab} />
    </div>
  );
}
