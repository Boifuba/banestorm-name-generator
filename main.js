/**
 * Banestorm Name Generator Module for FoundryVTT v13
 * Main module file - simplified
 */

import { NameGeneratorDialog } from './name-generator-dialog.js';

/**
 * Name Generator Main Class
 */
class NameGenerator {
  static MODULE_NAME = "banestorm-name-generator";

  /**
   * Open the name generator dialog
   */
  static openDialog() {
    try {
      NameGeneratorDialog.show();
    } catch (error) {
      console.error('Name Generator | Error opening dialog:', error);
      ui.notifications.error('Error opening Name Generator dialog');
    }
  }
}

// Module initialization
Hooks.once('init', async () => {
  console.log('Banestorm Name Generator | Initializing...');
  
  const module = game.modules.get('banestorm-name-generator');
  if (!module) {
    console.error('Name Generator | Module not found in game.modules');
    return;
  }
  
  module.api = {
    NameGenerator: NameGenerator,
    NameGeneratorDialog: NameGeneratorDialog,
    openDialog: () => NameGenerator.openDialog()
  };
  
  // Define global functions after module initialization
  window.openNameGenerator = function() {
    NameGenerator.openDialog();
  };

  window.nameGeneratorOpen = window.openNameGenerator;
  window.showNameGenerator = window.openNameGenerator;
  
  console.log('Name Generator | Global functions registered');
});

Hooks.once('ready', () => {
  console.log('Banestorm Name Generator | Ready!');
  ui.notifications.info('Banestorm Name Generator loaded successfully!');
});

// Export for other modules
export { NameGenerator, NameGeneratorDialog };