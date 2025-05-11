
import React from 'react';
import ThemeSwitcher from '@/components/settings/ThemeSwitcher';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  return (
    <ThemeSwitcher className={className} minimal={true} />
  );
};

export default ThemeToggle;
