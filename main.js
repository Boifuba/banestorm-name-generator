/**
 * Banestorm Name Generator Module for FoundryVTT v13
 * A comprehensive name generation system for RPG games
 * 
 * @author boifubá
 * @version 1.1.0
 * @license MIT
 */

import { NameGeneratorDialog } from './name-generator-dialog.js';

/**
 * Main Name Generator class that handles module initialization and API exposure
 * Provides centralized access to the name generation functionality
 */
class NameGenerator {
  /** Module identifier constant */
  static MODULE_NAME = "banestorm-name-generator";

  /**
   * Opens the name generator dialog window
   * Provides error handling and user notifications
   * 
   * @static
   * @memberof NameGenerator
   * @returns {void}
   */
  static openDialog() {
    try {
      // Attempt to show the dialog
      NameGeneratorDialog.show();
    } catch (error) {
      // Log error for debugging and notify user
      console.error('Name Generator | Error opening dialog:', error);
      ui.notifications.error('Error opening Name Generator dialog');
    }
  }
}

/**
 * Module initialization hook - runs once when Foundry initializes
 * Sets up module API and registers global functions for external access
 */
Hooks.once('init', async () => {
  console.log('Banestorm Name Generator | Initializing...');
  
  // Get module reference from Foundry's module registry
  const module = game.modules.get('banestorm-name-generator');
  if (!module) {
    console.error('Name Generator | Module not found in game.modules');
    return;
  }
  
  /**
   * Expose module API for other modules and macros
   * Provides programmatic access to name generation functionality
   */
  module.api = {
    NameGenerator: NameGenerator,
    NameGeneratorDialog: NameGeneratorDialog,
    openDialog: () => NameGenerator.openDialog()
  };
  
  /**
   * Register global functions for easy macro access
   * These functions provide convenient ways to open the name generator
   */
  window.openNameGenerator = function() {
    NameGenerator.openDialog();
  };

  // Alternative function names for flexibility
  window.nameGeneratorOpen = window.openNameGenerator;
  window.showNameGenerator = window.openNameGenerator;
  
  console.log('Name Generator | Global functions registered');
});

/**
 * Module ready hook - runs once when Foundry is fully loaded
 * Confirms successful module loading to users
 */
Hooks.once('ready', () => {
  console.log('Banestorm Name Generator | Ready!');
  ui.notifications.info('Banestorm Name Generator loaded successfully!');
});

// Export classes for use by other modules
export { NameGenerator, NameGeneratorDialog };