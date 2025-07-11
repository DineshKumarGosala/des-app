# Student Feedback Desktop Application

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your Google Sheets credentials (see below)
4. Start development: `npm run dev`

### Google Sheets Setup

#### 1. Create a Google Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create credentials → Service Account
5. Download the JSON key file

#### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
```env
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

#### 3. Setup Your Google Sheet
Create a spreadsheet with a sheet named "Admin Config" with these columns:
- JoiningYear
- Branch  
- Year
- Section
- Subject
- Teacher
- Question1
- Question2
- Question3 (add more as needed)

Share the spreadsheet with your service account email (found in the JSON file).

### Development Commands

- `npm run dev` - Start development (Next.js + Electron)
- `npm run build` - Build for production
- `npm run build:win` - Build Windows installer
- `npm run build:mac` - Build macOS app
- `npm run build:linux` - Build Linux AppImage

### Application Features

#### Student Information Form
- Dynamic dropdowns based on Google Sheets data
- Smart filtering - each selection filters the next dropdown
- Form validation with clear error messages
- Auto-save form data locally

#### Feedback Collection
- Auto-displays all subjects for selected student combination
- 1-10 rating scale for each question
- Progress tracking and validation
- Offline capability with local storage

#### Desktop Features
- Native window controls and menus
- Keyboard shortcuts (Ctrl+N for new feedback)
- Error dialogs and notifications
- Data export functionality
- Cross-platform support (Windows, macOS, Linux)

### Troubleshooting

#### Google Sheets API Issues
1. Verify service account has access to the spreadsheet
2. Check that the spreadsheet ID is correct
3. Ensure the "Admin Config" sheet exists with proper headers
4. Confirm the private key format (should include \n for line breaks)

#### Electron Issues
1. Try rebuilding native modules: `npm run postinstall`
2. Clear cache: `rm -rf node_modules .next && npm install`
3. Check that all dependencies are compatible

#### Build Issues
1. Make sure you have the required build tools for your platform
2. On Windows: Install Visual Studio Build Tools
3. On macOS: Install Xcode Command Line Tools
4. On Linux: Install build-essential

### File Structure
```
/electron/           # Electron main process files
/src/app/           # Next.js app router pages
/src/components/    # React components
/src/lib/           # Utilities and types
/public/            # Static assets
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Support
For issues and questions, please create an issue on the GitHub repository.
