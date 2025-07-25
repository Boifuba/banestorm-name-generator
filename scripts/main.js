/**
 * Name Generator Module for FoundryVTT
 * Main initialization file
 */

import { NameGenerator } from './name-generator.js';

// Define the global function immediately at the top level
// This ensures it's available as soon as the script loads
window.openNameGenerator = function() {
  // Try to get the module API first
  const module = game.modules?.get('banestorm-name-generator');
  if (module && module.api && module.api.instance) {
    module.api.instance.openDialog();
    return;
  }
  
  // Fallback: create a new instance directly
  try {
    const generator = new NameGenerator();
    generator.openDialog();
  } catch (error) {
    console.error('Name Generator | Error in fallback:', error);
    ui.notifications.error('Name Generator failed to open. Please try again.');
  }
};

// Also define alternative names for compatibility
window.nameGeneratorOpen = window.openNameGenerator;
window.showNameGenerator = window.openNameGenerator;

Hooks.once('init', async () => {
  // Get the module instance from game.modules
  const module = game.modules.get('banestorm-name-generator');
  if (!module) {
    console.error('Name Generator | Module not found in game.modules');
    return;
  }
  
  // Initialize the module's API on the module instance
  module.api = {
    NameGenerator: NameGenerator,
    instance: null,
    openDialog: function() {
      if (!this.instance) {
        this.instance = new NameGenerator();
      }
      this.instance.openDialog();
    }
  };
});

Hooks.once('ready', () => {
  const module = game.modules.get('banestorm-name-generator');
  if (!module || !module.api) {
    console.error('Name Generator | Module API not initialized');
    return;
  }
  
  // Create the generator instance
  module.api.instance = new NameGenerator();
});