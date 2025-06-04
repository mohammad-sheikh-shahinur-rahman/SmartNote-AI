
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Palette, Check } from 'lucide-react';

type Theme = 'default' | 'oceanic' | 'sunset';
type Mode = 'light' | 'dark';

const THEMES: { value: Theme; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'oceanic', label: 'Oceanic' },
  { value: 'sunset', label: 'Sunset' },
];

const MODES: { value: Mode; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [currentMode, setCurrentMode] = useState<Mode>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = (localStorage.getItem('app-theme') as Theme) || 'default';
    const storedMode = (localStorage.getItem('app-mode') as Mode) || 'light';
    
    setCurrentTheme(storedTheme);
    setCurrentMode(storedMode);

    applyTheme(storedTheme);
    applyMode(storedMode);
  }, []);

  const applyTheme = (theme: Theme) => {
    document.documentElement.classList.remove('theme-oceanic', 'theme-sunset');
    if (theme !== 'default') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  };

  const applyMode = (mode: Mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleThemeChange = (theme: string) => {
    const newTheme = theme as Theme;
    applyTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    setCurrentTheme(newTheme);
  };

  const handleModeChange = (mode: Mode) => {
    applyMode(mode);
    localStorage.setItem('app-mode', mode);
    setCurrentMode(mode);
  };

  if (!isMounted) {
    // Prevent rendering on the server or before hydration to avoid mismatches
    // A skeleton or null could be returned, but a simple button is fine here
    // as the actual logic runs client-side.
    return (
      <Button variant="ghost" size="icon" disabled>
        <Palette className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change theme">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={currentTheme} onValueChange={handleThemeChange}>
          {THEMES.map((theme) => (
            <DropdownMenuRadioItem key={theme.value} value={theme.value}>
              {theme.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        {MODES.map((mode) => (
          <DropdownMenuItem key={mode.value} onClick={() => handleModeChange(mode.value)}>
            <mode.icon className="mr-2 h-4 w-4" />
            <span>{mode.label}</span>
            {currentMode === mode.value && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
