/**
 * Name Generator Main Class
 */

import { NameDialog } from './name-dialog.js';

export class NameGenerator {
  static MODULE_NAME = "name-generator";

  constructor() {
    this.dialog = null;
    console.log('Name Generator | Instance created');
  }

  /**
   * Open the name generator dialog
   */
  openDialog() {
    console.log('Name Generator | Opening dialog');
    try {
      if (this.dialog) {
        this.dialog.close();
      }
      this.dialog = new NameDialog();
      this.dialog.render(true);
      console.log('Name Generator | Dialog opened successfully');
    } catch (error) {
      console.error('Name Generator | Error opening dialog:', error);
      ui.notifications.error('Error opening Name Generator dialog');
    }
  }

  /**
   * Send selected name to chat
   */
  static async sendNameToChat(name, nation, gender = null) {
    try {
      const nationName = game.i18n.localize(`NAME_GENERATOR.Nations.${nation}`);
      const genderText = gender ? game.i18n.localize(`NAME_GENERATOR.${gender.charAt(0).toUpperCase() + gender.slice(1)}`) : '';
      
      const message = game.i18n.format('NAME_GENERATOR.NameSentToChat', {
        name: name,
        nation: nationName
      });

      const genderIcon = gender === 'male' ? 'fas fa-mars' : gender === 'female' ? 'fas fa-venus' : 'fas fa-user';

      const chatContent = `
        <div class="name-generator-chat-result">
          <div class="name-result-header">
            <i class="fas fa-user"></i>
            <h3>${game.i18n.localize('NAME_GENERATOR.ModuleTitle')}</h3>
          </div>
          <div class="name-result-content">
            <div class="selected-name">
              <i class="${genderIcon}"></i>
              ${name}
            </div>
            <div class="nation-info">${nationName}${genderText ? ` - ${genderText}` : ''}</div>
          </div>
        </div>
      `;

      await ChatMessage.create({
        content: chatContent,
        whisper: []
      });

      ui.notifications.info(message);
      console.log('Name Generator | Name sent to chat:', name, nation, gender);
    } catch (error) {
      console.error('Name Generator | Error sending name to chat:', error);
      ui.notifications.error('Error sending name to chat');
    }
  }

  /**
   * Apply selected name to the selected token and its actor
   */
  static async applyNameToActorAndToken(name) {
    try {
      const selectedToken = canvas.tokens.controlled[0];
      if (!selectedToken) {
        ui.notifications.warn("No token selected.");
        return;
      }

      const actor = selectedToken.actor;
      if (!actor) {
        ui.notifications.warn("Selected token has no actor.");
        return;
      }

      // Update actor name
      await actor.update({ name });

      // Update token name (optional, you can remove this if not desired)
      await selectedToken.document.update({ name });

      ui.notifications.info(`Name '${name}' applied to actor and token.`);
      console.log('Name Generator | Name applied:', name);
    } catch (error) {
      console.error('Name Generator | Error applying name to actor/token:', error);
      ui.notifications.error('Error applying name to actor/token');
    }
  }

  /**
   * Get the module's API from game.modules
   * This is a convenience method for other modules to interact with this one
   */
  static getAPI() {
    const module = game.modules.get('name-generator');
    return module ? module.api : null;
  }
}

