import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

function Toaster(props) {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        '--normal-bg': '#FFFFFF',
        '--normal-text': '#111827',
        '--normal-border': '#E2E8F0',
      }}
      {...props}
    />
  );
}

export { Toaster };
