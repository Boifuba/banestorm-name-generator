/**
 * Name Generator Dialog Class
 */

import { NAME_DATA } from './name-data.js';
import { NameGenerator } from './name-generator.js';

export class NameDialog extends Dialog {
  constructor() {
    const content = `
      <div class="name-generator-form">
        <div class="name-generator-form-header">
          <i class="fas fa-users"></i>
          <h2>${game.i18n.localize('NAME_GENERATOR.DialogTitle')}</h2>
        </div>
        
        <form class="name-generator-dialog-form">
          <div class="name-generator-form-section">
            <div class="name-generator-form-group">
              <label for="nation-select">
                <i class="fas fa-flag"></i>
                ${game.i18n.localize('NAME_GENERATOR.SelectNation')}
              </label>
              <select id="nation-select" name="nation" class="name-generator-nation-select">
                ${Object.keys(NAME_DATA).map(nation => 
                  `<option value="${nation}">${game.i18n.localize(`NAME_GENERATOR.Nations.${nation}`)}</option>`
                ).join('')}
              </select>
            </div>

            <div class="name-generator-form-group">
              <label>
                <i class="fas fa-venus-mars"></i>
                ${game.i18n.localize('NAME_GENERATOR.SelectGender')}
              </label>
              <div class="name-generator-gender-options">
                <div class="name-generator-radio-group">
                  <input type="radio" id="gender-both" name="gender" value="both" checked>
                  <label for="gender-both" class="name-generator-radio-label">
                    <span class="name-generator-radio-button"></span>
                    <i class="fas fa-users"></i>
                    ${game.i18n.localize('NAME_GENERATOR.Both')}
                  </label>
                </div>
                <div class="name-generator-radio-group">
                  <input type="radio" id="gender-male" name="gender" value="male">
                  <label for="gender-male" class="name-generator-radio-label">
                    <span class="name-generator-radio-button"></span>
                    <i class="fas fa-mars"></i>
                    ${game.i18n.localize('NAME_GENERATOR.Male')}
                  </label>
                </div>
                <div class="name-generator-radio-group">
                  <input type="radio" id="gender-female" name="gender" value="female">
                  <label for="gender-female" class="name-generator-radio-label">
                    <span class="name-generator-radio-button"></span>
                    <i class="fas fa-venus"></i>
                    ${game.i18n.localize('NAME_GENERATOR.Female')}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="name-generator-names-container">
            <div class="name-generator-names-list" id="names-list">
              <div class="name-generator-no-names">${game.i18n.localize('NAME_GENERATOR.GenerateNames')}</div>
            </div>
          </div>

          <div class="name-generator-selected-name" id="selected-name-section" style="display: none;">
            <div class="selected-name-display">
              <span id="selected-name-text"></span>
            </div>
            <button type="button" id="apply-name-btn" class="name-generator-apply-btn">
              <i class="fas fa-check"></i>
              ${game.i18n.localize('NAME_GENERATOR.ApplyName')}
            </button>
          </div>
        </form>
      </div>
    `;

    super({
      title: game.i18n.localize('NAME_GENERATOR.DialogTitle'),
      content: content,
      buttons: {
        generate: {
          icon: '<i class="fas fa-dice"></i>',
          label: game.i18n.localize('NAME_GENERATOR.GenerateNames'),
          callback: (html) => {
            this._generateNames(html);
            return false; // Prevent dialog from closing
          },
        },
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close",
        },
      },
      default: "generate",
      classes: ["name-generator-dialog"],
      resizable: true,
      close: () => {}
    });

    this.currentNation = Object.keys(NAME_DATA)[0];
    this.currentGender = 'both';
    this.selectedName = null;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Handle nation selection change
    html.find('#nation-select').on('change', (event) => {
      this.currentNation = event.target.value;
      this._generateNames(html);
    });

    // Handle gender selection change
    html.find('input[name="gender"]').on('change', (event) => {
      this.currentGender = event.target.value;
      this._generateNames(html);
    });

    // Override the generate button to prevent closing
    html.find('button[data-button="generate"]').off('click').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this._generateNames(html);
    });

    // Handle apply name button
    html.find('#apply-name-btn').on('click', (event) => {
      event.preventDefault();
      if (this.selectedName) {
        NameGenerator.applyNameToActorAndToken(this.selectedName);
      }
    });

    // Auto-generate names on dialog open
    setTimeout(() => {
      this._generateNames(html);
    }, 100);
  }

  _generateNames(html) {
    const nationSelect = html.find('#nation-select');
    const genderRadio = html.find('input[name="gender"]:checked');
    const nation = nationSelect.val() || this.currentNation;
    const gender = genderRadio.val() || this.currentGender;
    const namesList = html.find('#names-list');

    if (!NAME_DATA[nation]) {
      ui.notifications.error(`Nation data not found: ${nation}`);
      return;
    }

    // Get names based on gender selection
    let availableNames = [];
    const maleNames = NAME_DATA[nation].male || [];
    const femaleNames = NAME_DATA[nation].female || [];

    switch (gender) {
      case 'male':
        availableNames = [...maleNames];
        break;
      case 'female':
        availableNames = [...femaleNames];
        break;
      case 'both':
      default:
        availableNames = [...maleNames, ...femaleNames];
        break;
    }

    if (availableNames.length === 0) {
      namesList.html('<div class="name-generator-no-names">No names available for this selection</div>');
      return;
    }

    // Generate 5 random names
    const selectedNames = [];
    const usedIndices = new Set();

    while (selectedNames.length < 5 && selectedNames.length < availableNames.length) {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const name = availableNames[randomIndex];
        
        // Determine if this name is male or female for display
        const isMale = maleNames.includes(name);
        const genderIcon = isMale ? 'fas fa-mars' : 'fas fa-venus';
        const genderClass = isMale ? 'male' : 'female';
        
        selectedNames.push({
          name: name,
          gender: isMale ? 'male' : 'female',
          icon: genderIcon,
          class: genderClass
        });
      }
    }

    // Create HTML for names
    const namesHtml = selectedNames.map(nameData => 
      `<div class="name-generator-name-item ${nameData.class}" data-name="${nameData.name}" data-nation="${nation}" data-gender="${nameData.gender}">
        <i class="${nameData.icon}"></i>
        <span class="name-generator-name-text">${nameData.name}</span>
      </div>`
    ).join('');

    namesList.html(namesHtml);

    // Add click handlers for name selection
    namesList.find('.name-generator-name-item').on('click', (event) => {
      const nameElement = $(event.currentTarget);
      const selectedName = nameElement.data('name');

      // Remove previous selection
      namesList.find('.name-generator-name-item').removeClass('name-generator-selected');
      
      // Add selection to clicked item
      nameElement.addClass('name-generator-selected');

      // Update selected name
      this.selectedName = selectedName;
      
      // Show selected name section
      const selectedSection = html.find('#selected-name-section');
      const selectedNameText = html.find('#selected-name-text');
      
      selectedNameText.text(selectedName);
      selectedSection.show();
    });
  }
}