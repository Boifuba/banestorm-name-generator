/**
 * Name Generator Dialog for FoundryVTT v13
 * Using ApplicationV2 with HandlebarsApplicationMixin
 */

import { NAME_DATA } from './name-data.js';

import { PLACE_DATA } from './places-data.js';

export class NameGeneratorDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.currentMode = 'people';
    this.selectedNation = Object.keys(NAME_DATA)[0];
    this.selectedGender = 'both';
    this.generatedNames = [];
    this.selectedPlaceNation = Object.keys(PLACE_DATA)[0];
    this.generatedPlaces = [];
  }

  static DEFAULT_OPTIONS = {
    id: "name-generator-dialog",
    tag: "form",
    window: {
      title: "Banestorm Name Generator",
      icon: "fas fa-user",
      resizable: true
    },
    position: {
      width: 450,
      height: 650
    },
    form: {
      handler: NameGeneratorDialog.formHandler,
      submitOnChange: false,
      closeOnSubmit: false
    }
  };

  static PARTS = {
    form: {
      template: "modules/banestorm-name-generator/name-generator.hbs"
    }
  };

  async _prepareContext(options) {
    const nations = Object.keys(NAME_DATA);
    const placeNations = Object.keys(PLACE_DATA);
    
    return {
      currentMode: this.currentMode,
      nations: nations.map(nation => ({
        value: nation,
        label: nation.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      })),
      placeNations: placeNations.map(nation => ({
        value: nation,
        label: nation.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      })),
      selectedNation: this.selectedNation,
      selectedGender: this.selectedGender,
      generatedNames: this.generatedNames,
      selectedPlaceNation: this.selectedPlaceNation,
      generatedPlaces: this.generatedPlaces,
      genders: [
        { value: 'both', label: 'Both', icon: 'fas fa-venus-mars' },
        { value: 'male', label: 'Male', icon: 'fas fa-mars' },
        { value: 'female', label: 'Female', icon: 'fas fa-venus' }
      ]
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    
    // Always re-attach event listeners after render
    this.attachAllEventListeners();
  }

  attachAllEventListeners() {
    // Mode toggle buttons
    const modeButtons = this.element.querySelectorAll('button[data-mode]');
    modeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const newMode = event.target.dataset.mode;
        console.log('Mode changed to:', newMode);
        this.currentMode = newMode;
        
        // Clear current data when switching modes
        if (newMode === 'people') {
          this.generatedNames = [];
        } else {
          this.generatedPlaces = [];
        }
        
        this.render();
      });
    });

    // Nation select change
    const nationSelect = this.element.querySelector('#nation-select');
    if (nationSelect) {
      nationSelect.addEventListener('change', (event) => {
        console.log('Nation changed to:', event.target.value);
        this.selectedNation = event.target.value;
        this.generateNames();
      });
    }

    // Place nation select change
    const placeNationSelect = this.element.querySelector('#place-nation-select');
    if (placeNationSelect) {
      placeNationSelect.addEventListener('change', (event) => {
        console.log('Place nation changed to:', event.target.value);
        this.selectedPlaceNation = event.target.value;
        this.generatePlaces();
      });
    }

    // Gender button clicks
    const genderButtons = this.element.querySelectorAll('button[data-gender]');
    genderButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Gender changed to:', event.target.dataset.gender);
        this.selectedGender = event.target.dataset.gender;
        
        // Update button states
        genderButtons.forEach(btn => {
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-secondary');
        });
        event.target.classList.remove('btn-secondary');
        event.target.classList.add('btn-primary');
        
        this.generateNames();
      });
    });

    // Generate button
    const generateBtn = this.element.querySelector('#generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Generate button clicked');
        this.generateNames();
      });
    }

    // Generate places button
    const generatePlacesBtn = this.element.querySelector('#generate-places-btn');
    if (generatePlacesBtn) {
      generatePlacesBtn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Generate places button clicked');
        this.generatePlaces();
      });
    }

    // Name click handlers
    this.attachNameClickHandlers();
    this.attachPlaceClickHandlers();
  }

  attachNameClickHandlers() {
    const nameElements = this.element.querySelectorAll('.name-item');
    nameElements.forEach(nameElement => {
      nameElement.addEventListener('click', (event) => {
        const name = event.currentTarget.dataset.name;
        console.log('Name clicked:', name);
        this.applyNameToToken(name);
      });
    });
  }

  attachPlaceClickHandlers() {
    const placeElements = this.element.querySelectorAll('.place-item');
    placeElements.forEach(placeElement => {
      placeElement.addEventListener('click', (event) => {
        const placeName = event.currentTarget.dataset.name;
        const placeType = event.currentTarget.dataset.type;
        console.log('Place clicked:', placeName, placeType);
        this.sendPlaceToChat(placeName, placeType);
      });
    });
  }

  generateNames() {
    console.log('Generating names for:', this.selectedNation, this.selectedGender);
    
    if (!NAME_DATA[this.selectedNation]) {
      console.log('No data for nation:', this.selectedNation);
      this.generatedNames = [];
      this.render();
      return;
    }
    
    const maleNames = NAME_DATA[this.selectedNation].male || [];
    const femaleNames = NAME_DATA[this.selectedNation].female || [];
    
    let availableNames = [];
    switch (this.selectedGender) {
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
      this.generatedNames = [];
      this.render();
      return;
    }

    const selectedNames = [];
    const usedIndices = new Set();

    while (selectedNames.length < 5 && selectedNames.length < availableNames.length) {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const name = availableNames[randomIndex];
        const isMale = maleNames.includes(name);
        
        selectedNames.push({
          name: name,
          gender: isMale ? 'male' : 'female',
          isMale: isMale,
          icon: isMale ? 'fas fa-mars' : 'fas fa-venus'
        });
      }
    }

    this.generatedNames = selectedNames;
    this.render(false);
  }

  generatePlaces() {
    console.log('Generating places for:', this.selectedPlaceNation);
    
    if (!PLACE_DATA[this.selectedPlaceNation]) {
      console.log('No data for place nation:', this.selectedPlaceNation);
      this.generatedPlaces = [];
      this.render();
      return;
    }
    
    const places = PLACE_DATA[this.selectedPlaceNation].cities || [];
    const availablePlaces = places.map(name => ({ name, type: 'place' }));

    if (availablePlaces.length === 0) {
      this.generatedPlaces = [];
      this.render();
      return;
    }

    const selectedPlaces = [];
    const usedIndices = new Set();

    while (selectedPlaces.length < 7 && selectedPlaces.length < availablePlaces.length) {
      const randomIndex = Math.floor(Math.random() * availablePlaces.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const place = availablePlaces[randomIndex];
        
        selectedPlaces.push({
          name: place.name,
          type: 'place',
          icon: 'fas fa-map-marker-alt'
        });
      }
    }

    this.generatedPlaces = selectedPlaces;
    this.render(false);
  }

  async applyNameToToken(name) {
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

      // Update token name
      await selectedToken.document.update({ name });

      ui.notifications.info(`Name '${name}' applied to token.`);
      
    } catch (error) {
      console.error('Name Generator | Error applying name:', error);
      ui.notifications.error('Error applying name to token');
    }
  }

  async sendPlaceToChat(placeName, placeType) {
    try {
      const typeLabel = 'Lugar';
      const message = `<div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
        <h3 style="margin: 0 0 5px 0;">
          <i class="fas fa-map-marker-alt"></i>
          ${placeName}
        </h3>
        <p style="margin: 0; font-size: 0.9em; color: #666;">
          ${typeLabel} de ${this.selectedPlaceNation.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </p>
      </div>`;

      await ChatMessage.create({
        content: message,
        speaker: ChatMessage.getSpeaker({ alias: "Name Generator" })
      });

      ui.notifications.info(`${typeLabel} '${placeName}' enviado para o chat.`);
      
    } catch (error) {
      console.error('Name Generator | Error sending place to chat:', error);
      ui.notifications.error('Error sending place to chat');
    }
  }

  static async show() {
    const dialog = new NameGeneratorDialog();
    dialog.render(true);
    return dialog;
  }

  static async formHandler(event, form, formData) {
    // Form handler - not used for this dialog
    return;
  }
}