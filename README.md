# Name Generator for FoundryVTT

A module for FoundryVTT that generates random names based on various nations/cultures for your RPG games.

## Features

- **16 Distinct Nations**: Each with unique male and female names  
- **Intuitive Interface**: Simple, easy-to-use dialog  
- **Chat Integration**: Selected names are automatically sent to the chat  
- **Gender Control**: Choose male, female, or both  
- **Toolbar Button**: Quick access via token controls  
- **Global API**: Functions accessible globally for other modules

## Available Nations

1. **Megalos** – Inspired by the Byzantine/Roman Empire  
2. **Al‑Haz** – Classical Arabic culture  
3. **Al‑Wazif** – Ottoman Empire  
4. **Cardiel** – Medieval Spain (Christian‑Muslim)  
5. **Caithness** – Medieval Scotland  
6. **Sahud** – Asian cultures (Japanese/Chinese)  
7. **Zarak** – Dwarves (Tolkien‑style)  
8. **Araterre** – Medieval France  
9. **Orc Lands** – Orcish names  
10. **Nomad Territories** – Vikings/Celts  
11. **Southwest Wildlands** – Mystical/Sufi  
12. **Bilit Island** – Mesoamerican cultures  
13. **Tredroy** – Multicultural Mediterranean  
14. **Great Desert** – Desert Bedouins  
15. **Black Forest** – Dark/evil names  
16. **Nomad Territories** – Nordic nomads

## Installation

1. Download the module  
2. Extract it into your FoundryVTT `modules` folder  
3. Enable the module in your world settings  
4. Restart FoundryVTT

## How to Use

### Via the Interface

1. Click the **"Name Generator"** button on the token toolbar  
2. Select your desired nation  
3. Choose the gender (male, female, or both)  
4. Click **"Generate Names"** to get 5 random names  
5. Click any name to send it to chat

### Via Macros

```javascript
// Open the generator dialog
window.openNameGenerator();

// Alternatives
window.nameGeneratorOpen();
window.showNameGenerator();
