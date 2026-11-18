import { AppProvider, useApp } from './lib/store';
import { useRoute } from './lib/router';
import { hasBackend } from './config';
import { Enrol } from './screens/Enrol';
import { Today } from './screens/Today';
import { Brush } from './screens/Brush';
import { Done } from './screens/Done';
import { Questionnaire } from './screens/Questionnaire';
import { Placeholder } from './screens/Placeholder';

// ?demo in the address shows the app without joining (nothing is uploaded)
const demoOnly = new URLSearchParams(window.location.search).has('demo');

function Screens() {
  const { path, params } = useRoute();
  const { s } = useApp();
  if ((hasBackend() || path === '/join') && !s.auth && !demoOnly) return <Enrol />;
  switch (path) {
    case '/brush': return <Brush />;
    case '/done': return <Done kind={params.get('kind') || 'brush'} />;
    case '/q': return <Questionnaire key={params.get('k') || ''} instr={params.get('i') || 'jhab'} rkey={params.get('k') || 'hab_0'} />;
    case '/learn': return <Placeholder tab="learn" />;
    case '/journey': return <Placeholder tab="journey" />;
    case '/rewards': return <Placeholder tab="rewards" />;
    case '/grownups': return <Placeholder tab="today" />;
    default: return <Today />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  );
}
