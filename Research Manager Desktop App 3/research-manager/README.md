# Research Manager

A modern, offline-capable web application for researchers to manage their projects and experiments. The app allows users to organize research data by associating local file paths with experiment properties, keeping sensitive research data secure on the local machine.

## Features

### 🏠 Homepage
- **Project Management**: Create and manage research projects
- **Dynamic Grid Layout**: Responsive grid that adjusts to screen size
- **Project Cards**: Visual representation of projects with descriptions and metadata

### 🔬 Experiment Page
- **Experiment Management**: Create and organize experiments within projects
- **Property System**: Add custom properties to experiments (Notes, Protocol, Raw Data, Results, etc.)
- **File Association**: Link local file paths to experiment properties
- **Animal/Sample Tracking**: Manage research subjects with detailed information

### 🛡️ Security & Privacy
- **Local File Paths**: No files are uploaded to the web app
- **Offline Capability**: Works without internet connection
- **Data Privacy**: Research data remains on your local machine

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Context with useReducer
- **Routing**: React Router for navigation
- **Icons**: Heroicons for consistent iconography

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd research-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Usage Guide

### Creating a Project
1. Click the "Add Project" button in the left sidebar
2. Enter a project name and description
3. Click "Create Project"

### Adding Experiments
1. Click on a project card to navigate to the experiment page
2. Click "Add Experiment" in the sidebar
3. Enter experiment name and description
4. Click "Create Experiment"

### Managing Properties
1. In an experiment card, click "Add Property"
2. Choose a property type (Notes, Protocol, Raw Data, Results, or Custom)
3. Enter a property name
4. Click "Add"

### Associating Files
1. Click on a property in an experiment card
2. Enter the file path to your local file
3. The filename will be displayed
4. Click on the property again to open the file

### Adding Animals/Samples
1. Click "Add Animal/Sample" in the sidebar
2. Fill in the required information (Name, Species)
3. Optionally add Age, Weight, and Notes
4. Click "Add Animal/Sample"

## Project Structure

```
src/
├── components/          # React components
│   ├── Homepage.tsx    # Main homepage with project grid
│   ├── ExperimentPage.tsx # Experiment management page
│   ├── ProjectCard.tsx # Individual project display
│   ├── ExperimentCard.tsx # Individual experiment display
│   └── Sidebar.tsx     # Navigation sidebar
├── context/            # React context for state management
│   └── AppContext.tsx  # Main application state
├── types/              # TypeScript type definitions
│   └── index.ts        # Data model interfaces
├── utils/              # Utility functions
│   └── helpers.ts      # Helper functions and utilities
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Data Models

### Project
- Basic information (name, description)
- Collection of experiments
- Collection of animals/samples
- Creation and update timestamps

### Experiment
- Basic information (name, description)
- Collection of properties
- Creation and update timestamps

### Property
- Name and type
- Optional file path and filename
- Support for custom property types

### Animal/Sample
- Basic information (name, species)
- Optional metadata (age, weight, notes)
- Creation timestamp

## Customization

### Adding New Property Types
1. Update the `Property` interface in `src/types/index.ts`
2. Add the new type to the property type union
3. Update the property creation form in `ExperimentCard.tsx`
4. Add appropriate icons and styling

### Styling
The app uses Tailwind CSS with custom component classes. Modify `src/index.css` to customize:
- Button styles (`.btn-primary`, `.btn-secondary`)
- Card styles (`.card`)
- Sidebar styles (`.sidebar`)

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- **Data Persistence**: Local storage or database integration
- **File Type Support**: Better file handling and preview
- **Search & Filter**: Advanced project and experiment search
- **Export/Import**: Data backup and sharing capabilities
- **Collaboration**: Multi-user project sharing
- **Mobile App**: Native mobile application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Note**: This application is designed for research purposes and handles sensitive data. Always ensure you have proper backup and security measures in place for your research data.
