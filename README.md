# Student Feedback System - Desktop Application

A comprehensive student feedback collection system built as a desktop application using Electron + Next.js + TypeScript.

## 🚀 Features

- **Native Desktop Application** for Windows, macOS, and Linux
- **100% Google Sheets Integration** - No hardcoded data
- **Smart Cascading Dropdowns** - Dynamic filtering based on sheet data
- **Auto-Population** - Displays all subjects/teachers automatically
- **Offline-Ready** - Works without constant internet connection
- **Modern UI** - Built with Tailwind CSS
- **Type-Safe** - Full TypeScript implementation

## 🛠️ Tech Stack

- **Electron** - Desktop application framework
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Google Sheets API** - Data source
- **Google Auth Library** - Authentication

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-feedback-desktop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Sheets**
   - Create a Google Service Account
   - Download the credentials JSON file
   - Create a Google Sheet with "Admin Config" sheet
   - Copy `.env.local.example` to `.env.local` and fill in your credentials

4. **Setup your Google Sheet**
   Create a sheet named "Admin Config" with these columns:
   ```
   JoiningYear | Branch | Year | Section | Subject | Teacher | Question1 | Question2 | Question3
   ```

## 🏃‍♂️ Development

```bash
# Start development server
npm run dev

# This will start both Next.js and Electron in development mode
```

## 🔨 Building

```bash
# Build for all platforms
npm run build:electron

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 📁 Project Structure

```
student-feedback-desktop/
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # Preload script for security
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── layout.tsx       # App layout
│   │   └── page.tsx         # Main page
│   ├── components/
│   │   ├── FirstPage.tsx    # Student info form
│   │   └── SecondPage.tsx   # Feedback form
│   └── lib/
│       └── types.ts         # Type definitions
├── .env.local.example       # Environment template
└── package.json
```

## 🔐 Environment Variables

Create `.env.local` file with:

```env
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

## 🎯 Usage

### For Students
1. Launch the desktop application
2. Fill in your student information (joining year, branch, etc.)
3. Rate each teacher for all subjects
4. Submit feedback

### For Administrators
1. Update the Google Sheet with new subjects, teachers, or questions
2. Changes reflect immediately in the application
3. View submitted feedback in the "Feedback Responses" sheet

## 📊 Google Sheets Structure

### Admin Config Sheet
| JoiningYear | Branch | Year | Section | Subject | Teacher | Question1 | Question2 | Question3 |
|-------------|--------|------|---------|---------|---------|-----------|-----------|-----------|
| 2021 | CSE | 4th Year | A | Mathematics | Dr. Smith | Teaching Quality | Communication | Course Content |
| 2021 | CSE | 4th Year | A | Physics | Prof. Johnson | Teaching Quality | Communication | Course Content |

### Feedback Responses Sheet (Auto-created)
| Submission Time | Joining Year | Branch | Academic Year | Section | Registration Number | Subject | Teacher | Question | Rating |
|----------------|--------------|--------|---------------|---------|-------------------|---------|---------|----------|--------|
| 2025-01-15T10:30:00Z | 2021 | CSE | 4th Year | A | 21CSE001 | Mathematics | Dr. Smith | Question 1 | 8 |

## 🔒 Security Features

- **Context Isolation** - Secure communication between main and renderer processes
- **No Node Integration** - Renderer process doesn't have direct Node.js access
- **Preload Scripts** - Safe API exposure to renderer
- **External Link Handling** - Opens external links in default browser

## 📱 Desktop Features

- **Native Menus** - Platform-specific application menus
- **Keyboard Shortcuts** - Standard desktop shortcuts
- **Window Management** - Minimize, maximize, close
- **Error Dialogs** - Native error and success notifications
- **File Export** - Save feedback data locally (coming soon)

## 🚢 Distribution

The built application will be available in the `dist/` folder:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` portable application

## 🐛 Troubleshooting

### Common Issues

1. **Google Sheets API Errors**
   - Check your service account credentials
   - Ensure the sheet is shared with the service account email
   - Verify the spreadsheet ID is correct

2. **Build Errors**
   - Run `npm run postinstall` to rebuild native modules
   - Clear `node_modules` and reinstall dependencies

3. **Electron Security Warnings**
   - These are normal for development mode
   - Production builds have security features enabled

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the Google Sheets API documentation