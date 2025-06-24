/**
 * Name Generator Module for FoundryVTT
 * Main initialization file
 */

import { NameGenerator } from './name-generator.js';

// Define the global function immediately at the top level
// This ensures it's available as soon as the script loads
window.openNameGenerator = function() {
  console.log('Name Generator | Global function called');
  
  // Try to get the module API first
  const module = game.modules?.get('name-generator');
  if (module && module.api && module.api.instance) {
    console.log('Name Generator | Using module API instance');
    module.api.instance.openDialog();
    return;
  }
  
  // Fallback: create a new instance directly
  console.log('Name Generator | Creating fallback instance');
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

console.log('Name Generator | Global functions defined at script load');

Hooks.once('init', async () => {
  console.log('Name Generator | Initializing module');
  
  // Get the module instance from game.modules
  const module = game.modules.get('name-generator');
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
  
  console.log('Name Generator | Module API initialized');
});

Hooks.once('ready', () => {
  console.log('Name Generator | Module ready');
  
  const module = game.modules.get('name-generator');
  if (!module || !module.api) {
    console.error('Name Generator | Module API not initialized');
    return;
  }
  
  // Create the generator instance
  module.api.instance = new NameGenerator();
  
  console.log('Name Generator | Module ready with API:', {
    moduleFound: !!module,
    apiAvailable: !!(module && module.api),
    instanceCreated: !!(module && module.api && module.api.instance),
    globalFunctionAvailable: typeof window.openNameGenerator === 'function'
  });
  
  // Add control button to token controls
  Hooks.on('getSceneControlButtons', (controls) => {
    const tokenControls = controls.find(c => c.name === 'token');
    if (tokenControls) {
      tokenControls.tools.push({
        name: 'name-generator',
        title: game.i18n.localize('NAME_GENERATOR.ButtonTitle') || 'Name Generator',
        icon: 'fas fa-users',
        button: true,
        onClick: () => {
          const module = game.modules.get('name-generator');
          if (module && module.api) {
            module.api.openDialog();
          } else {
            // Fallback to global function
            window.openNameGenerator();
          }
        }
      });
    }
  });
  
  // Test the module API
  setTimeout(() => {
    const module = game.modules.get('name-generator');
    console.log('Name Generator | Final status check:', {
      moduleExists: !!module,
      apiExists: !!(module && module.api),
      instanceExists: !!(module && module.api && module.api.instance),
      canOpenDialog: !!(module && module.api && typeof module.api.openDialog === 'function'),
      globalFunctionExists: typeof window.openNameGenerator === 'function',
      alternativeFunctionsExist: {
        nameGeneratorOpen: typeof window.nameGeneratorOpen === 'function',
        showNameGenerator: typeof window.showNameGenerator === 'function'
      }
    });
  }, 1000);
});