
import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher'; // Import the ThemeSwitcher

const AppHeader = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">SmartNote AI</h1>
        <ThemeSwitcher /> {/* Add the ThemeSwitcher component */}
      </div>
    </header>
  );
};

export default AppHeader;
