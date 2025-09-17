/**
 * Name Generator Dialog for FoundryVTT v13
 * Uses ApplicationV2 with HandlebarsApplicationMixin for modern Foundry compatibility
 * 
 * This class handles the main user interface for name generation, supporting
 * multiple modes (people, places, races) with dynamic content generation
 * 
 * @extends {ApplicationV2}
 * @mixes {HandlebarsApplicationMixin}
 */

import { NAME_DATA } from './name-data.js';
import { PLACE_DATA } from './places-data.js';
import { RACE_DATA } from './name-races.js';
  let peopleQty = 7
  let placeQty = 11
  let raceQty = 9

export class NameGeneratorDialog extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  /**
   * Constructor for the Name Generator Dialog
   * Initializes default state for all generation modes
   * 
   * @param {Object} options - Configuration options for the dialog
   */
  constructor(options = {}) {
    super(options);
    
    // Current operating mode ('people', 'places', 'races')
    this.currentMode = 'people';
    
    // People names configuration
    this.selectedNation = Object.keys(NAME_DATA)[0];
    this.selectedGender = 'both';
    this.selectedNameType = 'full'; // NEW: 'first', 'last', 'full'
    this.generatedNames = [];
    
    // Places configuration
    this.selectedPlaceNation = Object.keys(PLACE_DATA)[0];
    this.generatedPlaces = [];
    
    // Races configuration
    this.selectedRace = Object.keys(RACE_DATA)[0];
    this.generatedRaces = [];
  }

  /**
   * Default options for the ApplicationV2 dialog
   * Defines window properties, dimensions, and form behavior
   */
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
      height: 780 // Increased height for new option
    },
    form: {
      handler: NameGeneratorDialog.formHandler,
      submitOnChange: false,
      closeOnSubmit: false
    }
  };

  /**
   * Template parts configuration for Handlebars rendering
   * Maps the form template to its location
   */
  static PARTS = {
    form: {
      template: "modules/banestorm-name-generator/name-generator.hbs"
    }
  };

  /**
   * Prepares context data for template rendering
   * Transforms raw data into format suitable for Handlebars template
   * 
   * @param {Object} options - Rendering options
   * @returns {Object} Context object for template rendering
   */
  async _prepareContext(options) {
    // Extract available data keys
    const nations = Object.keys(NAME_DATA);
    const placeNations = Object.keys(PLACE_DATA);
    const races = Object.keys(RACE_DATA);
    
    // Process generated names based on current name type for display
    const processedNames = this.generatedNames.map(nameObj => ({
      ...nameObj,
      name: this._processNameByType(nameObj.originalName || nameObj.name, this.selectedNameType)
    }));
    
    return {
      // Current state
      currentMode: this.currentMode,
      
      // People names data
      nations: nations.map(nation => ({
        value: nation,
        label: this._formatLabel(nation)
      })),
      selectedNation: this.selectedNation,
      selectedGender: this.selectedGender,
      selectedNameType: this.selectedNameType, // NEW
      generatedNames: processedNames,
      
      // Places data
      placeNations: placeNations.map(nation => ({
        value: nation,
        label: this._formatLabel(nation)
      })),
      selectedPlaceNation: this.selectedPlaceNation,
      generatedPlaces: this.generatedPlaces,
      
      // Races data
      races: races.map(race => ({
        value: race,
        label: this._formatLabel(race)
      })),
      selectedRace: this.selectedRace,
      generatedRaces: this.generatedRaces,
      
      // Gender options with icons
      genders: [
        { value: 'both', label: 'Both', icon: 'fas fa-venus-mars' },
        { value: 'male', label: 'Male', icon: 'fas fa-mars' },
        { value: 'female', label: 'Female', icon: 'fas fa-venus' }
      ],

      // NEW: Name type options
      nameTypes: [
        { value: 'first', label: 'First', icon: 'fas fa-user-circle' },
        { value: 'last', label: 'Last', icon: 'fas fa-users' },
        { value: 'full', label: 'Full', icon: 'fas fa-id-card' }
      ]
    };
  }

  /**
   * Formats a data key into a human-readable label
   * Converts kebab-case to Title Case
   * 
   * @param {string} key - The key to format
   * @returns {string} Formatted label
   * @private
   */
  _formatLabel(key) {
    return key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Called after the dialog is rendered
   * Handles auto-generation and event listener attachment
   * 
   * @param {Object} context - Rendering context
   * @param {Object} options - Rendering options
   */
  _onRender(context, options) {
    super._onRender(context, options);
    
    // Auto-generate content for empty modes when first opened
    if (this.currentMode === 'people' && this.generatedNames.length === 0) {
      this.generateNames();
    } else if (this.currentMode === 'places' && this.generatedPlaces.length === 0) {
      this.generatePlaces();
    } else if (this.currentMode === 'races' && this.generatedRaces.length === 0) {
      this.generateRaces();
    }
    
    // Attach event listeners after each render
    this.attachAllEventListeners();
  }

  /**
   * Attaches all event listeners to dialog elements
   * Centralizes event handling for better maintainability
   */
  attachAllEventListeners() {
    this._attachModeToggleListeners();
    this._attachDropdownListeners();
    this._attachGenderButtonListeners();
    this._attachNameTypeButtonListeners(); // NEW
    this._attachGenerateButtonListeners();
    this._attachClickHandlers();
  }

  /**
   * Attaches event listeners for mode toggle buttons
   * Handles switching between people, places, and races modes
   * 
   * @private
   */
  _attachModeToggleListeners() {
    const modeButtons = this.element.querySelectorAll('button[data-mode]');
    modeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const newMode = event.target.dataset.mode;
        console.log('Name Generator | Mode changed to:', newMode);
        
        this.currentMode = newMode;
        
        // Auto-generate for new mode if empty
        this._autoGenerateForMode(newMode);
        this.render();
      });
    });
  }

  /**
   * Auto-generates content when switching to a mode with no generated content
   * 
   * @param {string} mode - The mode to generate for
   * @private
   */
  _autoGenerateForMode(mode) {
    switch (mode) {
      case 'people':
        if (this.generatedNames.length === 0) this.generateNames();
        break;
      case 'places':
        if (this.generatedPlaces.length === 0) this.generatePlaces();
        break;
      case 'races':
        if (this.generatedRaces.length === 0) this.generateRaces();
        break;
    }
  }

  /**
   * Attaches event listeners for dropdown selects
   * Handles nation/race selection changes
   * 
   * @private
   */
  _attachDropdownListeners() {
    // People nation select
    const nationSelect = this.element.querySelector('#nation-select');
    if (nationSelect) {
      nationSelect.addEventListener('change', (event) => {
        console.log('Name Generator | Nation changed to:', event.target.value);
        this.selectedNation = event.target.value;
        this.generateNames();
      });
    }

    // Places nation select
    const placeNationSelect = this.element.querySelector('#place-nation-select');
    if (placeNationSelect) {
      placeNationSelect.addEventListener('change', (event) => {
        console.log('Name Generator | Place nation changed to:', event.target.value);
        this.selectedPlaceNation = event.target.value;
        this.generatePlaces();
      });
    }

    // Race select
    const raceSelect = this.element.querySelector('#race-select');
    if (raceSelect) {
      raceSelect.addEventListener('change', (event) => {
        console.log('Name Generator | Race changed to:', event.target.value);
        this.selectedRace = event.target.value;
        this.generateRaces();
      });
    }
  }

  /**
   * Attaches event listeners for gender selection buttons
   * Updates button states and triggers regeneration
   * 
   * @private
   */
  _attachGenderButtonListeners() {
    const genderButtons = this.element.querySelectorAll('button[data-gender]');
    genderButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Name Generator | Gender changed to:', event.target.dataset.gender);
        
        this.selectedGender = event.target.dataset.gender;
        
        // Update visual button states
        this._updateGenderButtonStates(genderButtons, event.target);
        
        // Regenerate names for current mode
        if (this.currentMode === 'people') this.generateNames();
        if (this.currentMode === 'races') this.generateRaces();
      });
    });
  }

  /**
   * NEW: Attaches event listeners for name type selection buttons
   * Updates button states and triggers regeneration
   * 
   * @private
   */
  _attachNameTypeButtonListeners() {
    const nameTypeButtons = this.element.querySelectorAll('button[data-name-type]');
    nameTypeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Name Generator | Name type changed to:', event.target.dataset.nameType);
        
        this.selectedNameType = event.target.dataset.nameType;
        
        // Update visual button states
        this._updateNameTypeButtonStates(nameTypeButtons, event.target);
        
        // Only re-render to update display, don't regenerate
        this.render(false);
      });
    });
  }

  /**
   * Updates the visual states of gender buttons
   * 
   * @param {NodeList} buttons - All gender buttons
   * @param {Element} activeButton - The clicked button
   * @private
   */
  _updateGenderButtonStates(buttons, activeButton) {
    buttons.forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
    });
    activeButton.classList.remove('btn-secondary');
    activeButton.classList.add('btn-primary');
  }

  /**
   * NEW: Updates the visual states of name type buttons
   * 
   * @param {NodeList} buttons - All name type buttons
   * @param {Element} activeButton - The clicked button
   * @private
   */
  _updateNameTypeButtonStates(buttons, activeButton) {
    buttons.forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
    });
    activeButton.classList.remove('btn-secondary');
    activeButton.classList.add('btn-primary');
  }

  /**
   * Attaches event listeners for generate buttons
   * Handles manual generation requests
   * 
   * @private
   */
  _attachGenerateButtonListeners() {
    // Generate people names button
    const generateBtn = this.element.querySelector('#generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Name Generator | Generate people names button clicked');
        this.generateNames();
      });
    }

    // Generate places button
    const generatePlacesBtn = this.element.querySelector('#generate-places-btn');
    if (generatePlacesBtn) {
      generatePlacesBtn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Name Generator | Generate places button clicked');
        this.generatePlaces();
      });
    }

    // Generate races button
    const generateRacesBtn = this.element.querySelector('#generate-races-btn');
    if (generateRacesBtn) {
      generateRacesBtn.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Name Generator | Generate races button clicked');
        this.generateRaces();
      });
    }
  }

  /**
   * Attaches click handlers for generated items
   * Handles applying names to tokens or sending to chat
   * 
   * @private
   */
  _attachClickHandlers() {
    this._attachNameClickHandlers();
    this._attachPlaceClickHandlers();
    this._attachRaceClickHandlers();
  }

  /**
   * Attaches click handlers for people name items
   * Applies selected names to tokens
   * 
   * @private
   */
  _attachNameClickHandlers() {
    const nameElements = this.element.querySelectorAll('.name-item');
    nameElements.forEach(nameElement => {
      nameElement.addEventListener('click', (event) => {
        const name = event.currentTarget.dataset.name;
        console.log('Name Generator | People name clicked:', name);
        this.applyNameToToken(name);
      });
    });
  }

  /**
   * Attaches click handlers for place name items
   * Sends place information to chat
   * 
   * @private
   */
  _attachPlaceClickHandlers() {
    const placeElements = this.element.querySelectorAll('.place-item');
    placeElements.forEach(placeElement => {
      placeElement.addEventListener('click', (event) => {
        const placeName = event.currentTarget.dataset.name;
        const placeType = event.currentTarget.dataset.type;
        console.log('Name Generator | Place clicked:', placeName, placeType);
        this.sendPlaceToChat(placeName, placeType);
      });
    });
  }

  /**
   * Attaches click handlers for race name items
   * Applies selected race names to tokens
   * 
   * @private
   */
  _attachRaceClickHandlers() {
    const raceElements = this.element.querySelectorAll('.race-item');
    raceElements.forEach(raceElement => {
      raceElement.addEventListener('click', (event) => {
        const name = event.currentTarget.dataset.name;
        console.log('Name Generator | Race name clicked:', name);
        this.applyNameToToken(name);
      });
    });
  }

  /**
   * Generates random people names based on current selection
   * Uses Fisher-Yates shuffle algorithm for fair random selection
   * NEW: Processes names based on selectedNameType (first, last, full)
   */
  generateNames() {
    console.log('Name Generator | Generating names for:', this.selectedNation, this.selectedGender, 'Type:', this.selectedNameType);
    
    // Validate nation data exists
    if (!NAME_DATA[this.selectedNation]) {
      console.warn('Name Generator | No data for nation:', this.selectedNation);
      this.generatedNames = [];
      this.render();
      return;
    }
    
    // Extract name arrays
    const maleNames = NAME_DATA[this.selectedNation].male || [];
    const femaleNames = NAME_DATA[this.selectedNation].female || [];
    
    // Build available names based on gender selection
    const availableNames = this._buildAvailableNames(maleNames, femaleNames);
    
    if (availableNames.length === 0) {
      this.generatedNames = [];
      this.render();
      return;
    }

    // Generate 5 random unique names with type processing
    const selectedNames = this._selectRandomNames(availableNames, maleNames, peopleQty);
    
    this.generatedNames = selectedNames;
    this.render(false);
  }

  /**
   * Generates random race names based on current selection
   * Similar to generateNames but for race data
   */
  generateRaces() {
    console.log('Name Generator | Generating race names for:', this.selectedRace, this.selectedGender);
    
    // Validate race data exists
    if (!RACE_DATA[this.selectedRace]) {
      console.warn('Name Generator | No data for race:', this.selectedRace);
      this.generatedRaces = [];
      this.render();
      return;
    }
    
    // Extract name arrays
    const maleNames = RACE_DATA[this.selectedRace].male || [];
    const femaleNames = RACE_DATA[this.selectedRace].female || [];
    
    // Build available names based on gender selection
    const availableNames = this._buildAvailableNames(maleNames, femaleNames);
    
    if (availableNames.length === 0) {
      this.generatedRaces = [];
      this.render();
      return;
    }

    // Generate 5 random unique names (races always use full names)
    const selectedNames = this._selectRandomNames(availableNames, maleNames, raceQty, 'full');
    
    this.generatedRaces = selectedNames;
    this.render(false);
  }

  /**
   * Builds available names array based on gender selection
   * 
   * @param {string[]} maleNames - Array of male names
   * @param {string[]} femaleNames - Array of female names
   * @returns {string[]} Combined array based on gender selection
   * @private
   */
  _buildAvailableNames(maleNames, femaleNames) {
    switch (this.selectedGender) {
      case 'male':
        return [...maleNames];
      case 'female':
        return [...femaleNames];
      case 'both':
      default:
        return [...maleNames, ...femaleNames];
    }
  }

  /**
   * NEW: Processes a full name based on the selected name type
   * 
   * @param {string} fullName - The original full name
   * @param {string} nameType - Type of name to extract ('first', 'last', 'full')
   * @returns {string} Processed name
   * @private
   */
  _processNameByType(fullName, nameType) {
    if (nameType === 'full') {
      return fullName;
    }
    
    const nameParts = fullName.trim().split(/\s+/);
    
    switch (nameType) {
      case 'first':
        return nameParts[0] || fullName;
      case 'last':
        // If there's only one name part, return it as is
        // Otherwise return the last part
        return nameParts.length > 1 ? nameParts[nameParts.length - 1] : fullName;
      default:
        return fullName;
    }
  }

  /**
   * Selects random unique names from available pool
   * Uses Set to prevent duplicates
   * NEW: Added nameType parameter for processing
   * 
   * @param {string[]} availableNames - Pool of available names
   * @param {string[]} maleNames - Array of male names for gender detection
   * @param {number} count - Number of names to select
   * @param {string} nameType - Type override for races (defaults to this.selectedNameType)
   * @returns {Object[]} Array of name objects with metadata
   * @private
   */
  _selectRandomNames(availableNames, maleNames, count, nameType = null) {
    const selectedNames = [];
    const usedIndices = new Set();
    
    while (selectedNames.length < count && selectedNames.length < availableNames.length) {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const originalName = availableNames[randomIndex];
        const isMale = maleNames.includes(originalName);
        
        selectedNames.push({
          name: originalName,
          originalName: originalName,
          gender: isMale ? 'male' : 'female',
          isMale: isMale,
          icon: isMale ? 'fas fa-mars' : 'fas fa-venus'
        });
      }
    }
    
    return selectedNames;
  }

  /**
   * Generates random place names based on current selection
   * Creates 8 random places from the selected nation's data
   */
  generatePlaces() {
    console.log('Name Generator | Generating places for:', this.selectedPlaceNation);
    
    // Validate place data exists
    if (!PLACE_DATA[this.selectedPlaceNation]) {
      console.warn('Name Generator | No data for place nation:', this.selectedPlaceNation);
      this.generatedPlaces = [];
      this.render();
      return;
    }
    
    // Extract places array
    const places = PLACE_DATA[this.selectedPlaceNation].cities || [];
    const availablePlaces = places.map(name => ({ name, type: 'place' }));

    if (availablePlaces.length === 0) {
      this.generatedPlaces = [];
      this.render();
      return;
    }

    // Generate 8 random unique places
    const selectedPlaces = [];
    const usedIndices = new Set();
    
    while (selectedPlaces.length < placeQty && selectedPlaces.length < availablePlaces.length) {
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

  /**
   * Applies a selected name to the currently selected token
   * Updates both the actor and token names
   * 
   * @param {string} name - The name to apply
   * @async
   */
  async applyNameToToken(name) {
    try {
      // Check if a token is selected
      const selectedToken = canvas.tokens.controlled[0];
      if (!selectedToken) {
        ui.notifications.warn("No token selected. Please select a token first.");
        return;
      }

      // Check if token has an actor
      const actor = selectedToken.actor;
      if (!actor) {
        ui.notifications.warn("Selected token has no associated actor.");
        return;
      }

      // Update actor name
      await actor.update({ name });

      // Update token name
      await selectedToken.document.update({ name });

      ui.notifications.info(`Name '${name}' applied to token successfully.`);
      
    } catch (error) {
      console.error('Name Generator | Error applying name to token:', error);
      ui.notifications.error('Error applying name to token. Check console for details.');
    }
  }

  /**
   * Sends place information to the chat
   * Creates a formatted chat message with place details
   * 
   * @param {string} placeName - The name of the place
   * @param {string} placeType - The type of place
   * @async
   */
  async sendPlaceToChat(placeName, placeType) {
    try {
      const typeLabel = 'Place';
      const nationLabel = this._formatLabel(this.selectedPlaceNation);
      
      // Create formatted chat message
      const message = `<div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
        <h3 style="margin: 0 0 5px 0;">
          <i class="fas fa-map-marker-alt"></i>
          ${placeName}
        </h3>
        <p style="margin: 0; font-size: 0.9em; color: #666;">
          ${typeLabel} from ${nationLabel}
        </p>
      </div>`;

      await ChatMessage.create({
        content: message,
        speaker: ChatMessage.getSpeaker({ alias: "Name Generator" })
      });

      ui.notifications.info(`${typeLabel} '${placeName}' sent to chat.`);
      
    } catch (error) {
      console.error('Name Generator | Error sending place to chat:', error);
      ui.notifications.error('Error sending place to chat. Check console for details.');
    }
  }

  /**
   * Static method to create and show the name generator dialog
   * Entry point for opening the dialog from external calls
   * 
   * @static
   * @returns {NameGeneratorDialog} The created dialog instance
   * @async
   */
  static async show() {
    const dialog = new NameGeneratorDialog();
    dialog.render(true);
    return dialog;
  }

  /**
   * Form submission handler (unused but required by ApplicationV2)
   * 
   * @static
   * @param {Event} event - Form submission event
   * @param {HTMLFormElement} form - The form element
   * @param {FormData} formData - Form data
   * @async
   */
  static async formHandler(event, form, formData) {
    // Not used for this dialog implementation
    return;
  }
}