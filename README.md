# PlantPal 🌱

A modern React TypeScript application for managing your plant collection and care schedule.

## Features

- **Plant Management**: Add, edit, and delete plants in your collection
- **Watering Reminders**: Track watering schedules and get notifications for overdue plants
- **Growth Logging**: Document your plants' growth with photos and notes
- **Care Notes**: Keep detailed records of fertilizing, repotting, pruning, and other care activities
- **Dashboard Overview**: Quick stats and recent activity at a glance
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
plantpal/
├── public/
│   └── index.html
├── src/
│   ├── assets/                     # Icons, plant images, illustrations
│   │   └── default-plant.svg
│   ├── components/                 # Reusable UI components
│   │   ├── PlantCard.tsx           # Displays basic plant info
│   │   ├── WaterStatus.tsx         # Icon or badge for water needs
│   │   ├── PlantForm.tsx           # Add/edit plant form
│   │   └── Navbar.tsx              # Top navigation
│   ├── features/
│   │   ├── dashboard/              # Overview of plant statuses
│   │   │   └── Dashboard.tsx
│   │   ├── plants/
│   │   │   ├── PlantList.tsx       # All user plants
│   │   │   ├── PlantDetails.tsx    # Individual plant view
│   │   │   └── GrowthLog.tsx       # History of photos & growth
│   │   └── notes/
│   │       └── CareNotes.tsx       # Notes section for each plant
│   ├── context/
│   │   └── PlantContext.tsx        # Global state for plants
│   ├── hooks/
│   │   ├── useWaterReminder.ts     # Detects plants needing water today
│   │   └── useLocalStorage.ts
│   ├── services/
│   │   └── plantService.ts         # Read/write to local storage or API
│   ├── types/
│   │   └── plant.d.ts              # TypeScript types for Plant, Logs, etc.
│   ├── router/
│   │   └── AppRoutes.tsx           # App routes (home, dashboard, plant view)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd plantpal
```

2. Install dependencies:
```bash
npm install
```

3. Set up the API server:
```bash
npm run setup
```

4. Create environment file (optional):
```bash
cp .env.example .env
```

5. Start both frontend and API server:
```bash
npm run dev:full
```

Or run them separately:
```bash
# Terminal 1 - API Server
npm run api:dev

# Terminal 2 - Frontend
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

### Adding Your First Plant

1. Navigate to the Dashboard
2. Click "Add Your First Plant" or use the "Add New Plant" button
3. Fill in the plant details:
   - Name and species
   - Location in your home
   - Watering frequency
   - Last watered date
   - Optional image URL and notes

### Managing Plants

- **View All Plants**: Browse your collection with search and sorting options
- **Plant Details**: Click on any plant card to view detailed information
- **Water Tracking**: Use the "Water Now" button to update watering records
- **Growth Logging**: Add photos and notes to track your plant's progress
- **Care Notes**: Document fertilizing, repotting, and other care activities

### Dashboard Features

- **Plant Statistics**: Total plants, plants needing water, well-watered plants
- **Water Reminders**: Highlighted alerts for plants that need attention
- **Recent Plants**: Quick access to your newest additions
- **Quick Actions**: Fast navigation to common tasks

## Data Storage

PlantPal now uses a REST API for data management with localStorage as a fallback for offline support. Your plant information, growth logs, and care notes are stored on the server and synchronized with local storage for optimal performance and reliability.

### API Endpoints

- `GET /api/plants` - Retrieve all plants
- `POST /api/plants` - Add a new plant
- `PUT /api/plants/:id` - Update a plant
- `DELETE /api/plants/:id` - Delete a plant
- `GET /api/growth-logs` - Retrieve all growth logs
- `POST /api/growth-logs` - Add a growth log
- `GET /api/care-notes` - Retrieve all care notes
- `POST /api/care-notes` - Add a care note

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **LocalStorage API** - Data persistence

## Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run api` - Start API server
- `npm run api:dev` - Start API server with auto-reload
- `npm run dev:full` - Start both frontend and API server
- `npm run setup` - Install API server dependencies

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- Plant identification using AI/image recognition
- Weather integration for outdoor plants
- Community features and plant sharing
- Export/import plant data
- Mobile app version
- Cloud sync across devices

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
