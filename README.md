[![Donate](https://img.shields.io/badge/Donate-Sponsor%20on%20GitHub-black?logo=github)](https://github.com/sponsors/Boifuba)

# GURPS Name Generator

A professional-grade name generation module for FoundryVTT, specifically designed for the Banestorm GURPS setting. Generate authentic names for characters, places, and fantasy races with an intuitive interface and powerful customization options.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Foundry](https://img.shields.io/badge/Foundry-v13-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

## ✨ Features

### 🎭 **Multi-Modal Generation**
- **People Names**: Generate character names from 16+ distinct cultures
- **Place Names**: Create authentic location names by region
- **Race Names**: Fantasy race names for non-human characters

### 🌍 **Rich Cultural Diversity**
**16 Unique Nations & Cultures:**
- **Megalos** – Byzantine/Roman Empire inspired
- **Al‑Haz** – Classical Arabic culture
- **Al‑Wazif** – Ottoman Empire
- **Cardiel** – Medieval Christian Spain
- **Caithness** – Medieval Scotland
- **Sahud** – East Asian (Japanese/Chinese)
- **Zarak** – Dwarven culture
- **Araterre** – Medieval France
- **Orc Lands** – Orcish tribal names
- **Nomad Lands** – Viking/Celtic nomads
- **Southwest Wildlands** – Mystical/Sufi inspired
- **Bilit Island** – Mesoamerican cultures
- **Tredroy** – Multicultural Mediterranean
- **Great Desert** – Bedouin desert tribes
- **Black Forest** – Dark/sinister names
- **Plus more regional variants...**

### 🎯 **Smart Features**
- **Gender-Specific Generation**: Male, female, or mixed results
- **Token Integration**: One-click name application to selected tokens
- **Chat Integration**: Send place names directly to chat
- **Auto-Generation**: Intelligent content generation when switching modes
- **Responsive Design**: Works seamlessly on all screen sizes

### 🔧 **Technical Excellence**
- **FoundryVTT v13 Compatible**: Built with ApplicationV2 and modern standards
- **Production Ready**: Comprehensive error handling and logging
- **Global API**: Accessible to other modules and macros
- **Performance Optimized**: Efficient random selection algorithms
- **Clean Architecture**: Well-documented, maintainable codebase

## 🚀 Installation

### Option 1: Module Browser (Recommended)
1. Open FoundryVTT and go to **Add-on Modules**
2. Click **Install Module**
3. Search for **"Banestorm Name Generator"**
4. Click **Install**
5. Enable the module in your world settings

### Option 2: Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/boifuba/banestorm-name-generator/releases)
2. Extract the ZIP file to your FoundryVTT `Data/modules/` directory
3. Restart FoundryVTT
4. Enable **"Banestorm Name Generator"** in your world's module settings

### Option 3: Manifest URL
Use this manifest URL for direct installation:
```
https://github.com/Boifuba/banestorm-name-generator/releases/download/packs/module.json
```

## 📖 Usage Guide

### Basic Usage

#### Opening the Generator
- **Method 1**: Use the macro functions (see Macro Examples below)
- **Method 2**: Call via module API: `game.modules.get('banestorm-name-generator').api.openDialog()`

#### Generating Names
1. **Select Mode**: Choose between People, Places, or Race names
2. **Choose Culture**: Select from available nations/races
3. **Set Gender** (People/Races only): Male, Female, or Both
4. **Generate**: Click the generate button or wait for auto-generation
5. **Apply**: Click any generated name to use it

#### Applying Names to Tokens
1. Select a token on the canvas
2. Open the Name Generator
3. Generate names in People or Race mode
4. Click any generated name
5. The name is automatically applied to both the token and its actor

#### Sending Places to Chat
1. Switch to Places mode
2. Select a nation
3. Generate place names
4. Click any place name to send a formatted message to chat

### Advanced Usage

#### Integration with Other Modules
The Name Generator provides a comprehensive API for other modules:

```javascript
// Access the module API
const nameGen = game.modules.get('banestorm-name-generator').api;

// Open the dialog programmatically
nameGen.openDialog();

// Access the classes directly
const dialog = new nameGen.NameGeneratorDialog();
```

#### Custom Macros

**Simple Open Dialog Macro:**
```javascript
// Open the name generator
openNameGenerator();
```

**Advanced Integration Macro:**
```javascript
// Check if module is available
if (typeof openNameGenerator !== 'undefined') {
    openNameGenerator();
} else {
    ui.notifications.error("Banestorm Name Generator not loaded!");
}
```



## 🛠️ Configuration

The module works out-of-the-box with no configuration required. All settings are managed through the intuitive dialog interface.

### Customization Options
- **Default Generation Count**: People/Races: 5 names, Places: 8 locations
- **Auto-Generation**: Automatically generates content when switching modes
- **Gender Icons**: Visual gender indicators for generated names
- **Responsive Layout**: Automatically adapts to different screen sizes

## 🎮 Game Master Tips

### Character Creation Sessions
- Use the People mode to quickly generate NPC names during gameplay
- Keep the generator open during social encounters for instant name creation
- Switch between cultures to match your campaign's current location

### World Building
- Use Places mode to create authentic settlement names
- Generate multiple locations to build out regions and territories
- Send place names to chat to share with players instantly

### Campaign Integration
- Match cultures to your campaign's regions and nations
- Use Race mode for fantasy character creation
- Combine with token images for quick NPC creation

## 🔧 API Reference

### Global Functions
The module exposes several global functions for easy access:

```javascript
// Primary function - opens the name generator dialog
openNameGenerator()

// Alternative names for the same function
nameGeneratorOpen()
showNameGenerator()
```

### Module API
Access the full API through the module registry:

```javascript
const api = game.modules.get('banestorm-name-generator').api;

// Available classes
api.NameGenerator        // Main generator class
api.NameGeneratorDialog  // Dialog class
api.openDialog()         // Function to open dialog
```

### Events and Hooks
The module integrates with standard FoundryVTT hooks:

- `init` - Module initialization and API setup
- `ready` - Module ready confirmation and notifications

## 🐛 Troubleshooting

### Common Issues

**Module Not Loading**
- Verify the module is enabled in world settings
- Check the browser console for error messages
- Ensure FoundryVTT version compatibility (v13+)

**Names Not Generating**
- Check that the selected nation/race has data
- Verify console for any error messages
- Try switching to a different culture

**Token Name Not Applying**
- Ensure you have selected a token on the canvas
- Verify the token has an associated actor
- Check that you have appropriate permissions

**Dialog Not Opening**
- Refresh the page and try again
- Check the browser console for JavaScript errors
- Verify no conflicting modules are interfering

### Getting Help
1. **Check Console**: Open browser DevTools (F12) and check for error messages
2. **GitHub Issues**: Report bugs at our [GitHub repository](https://github.com/boifuba/banestorm-name-generator/issues)
3. **Community Forums**: Ask questions on the FoundryVTT Discord or Reddit communities

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues
- Use our [GitHub Issues](https://github.com/boifuba/banestorm-name-generator/issues) page
- Include detailed steps to reproduce the problem
- Mention your FoundryVTT version and any relevant modules

### Feature Requests
- Submit feature ideas as GitHub Issues
- Describe the use case and expected behavior
- Consider implementation complexity and user benefit

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes with appropriate tests
4. Submit a pull request with detailed description

### Adding Name Data
- Follow the existing data structure format
- Ensure cultural authenticity and respect
- Include both male and female names where appropriate
- Test thoroughly before submitting


## Looking more modules for GURPS?

- [Instant Bazaar](https://github.com/Boifuba/gurps-instant-bazaar)
- [Instant Defaults](https://github.com/Boifuba/gurps-instant-defaults)
- [Instant Counter](https://github.com/Boifuba/gurps-counter)
- [Mookinator](https://github.com/Boifuba/mookinator)
- [Size Matters](https://github.com/Boifuba/size-matters)
- [Grapple Party](https://github.com/Boifuba/gurps-grapple-party)
- [Roll Stats](https://github.com/Boifuba/gurps-rolls-stats)
- [Name Generator](https://github.com/Boifuba/banestorm-name-generator)

### Support the Project

Consider supporting the project to help ongoing development.

<a href="https://www.buymeacoffee.com/boifuba" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40">
</a>