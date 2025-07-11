# 🚀 C# WPF Desktop Application - Student Feedback System

## 📋 **Overview**
This is a native Windows WPF (Windows Presentation Foundation) desktop application version of the Student Feedback System. It provides the same functionality as the Electron version but as a pure .NET Windows application.

## 🎯 **Features**
- **Native Windows Application**: Built with WPF for optimal Windows performance
- **Google Sheets Integration**: Direct connection to your Google Sheets data
- **Dynamic Cascading Dropdowns**: Smart filtering based on selections
- **Professional UI**: Modern Windows design with Material Design principles
- **Real-time Validation**: Instant feedback on form completion
- **Automatic Sheet Creation**: Creates dated sheets with naming convention: `YYYYMMDD_JoiningYear_Branch_Year_Section`

## 🛠️ **Technical Stack**
- **.NET 8.0**: Latest .NET framework for Windows
- **WPF (Windows Presentation Foundation)**: Native Windows UI framework
- **Google.Apis.Sheets.v4**: Official Google Sheets API library
- **XAML**: Declarative UI markup language
- **C#**: Primary programming language

## 📁 **Project Structure**
```
csharp-desktop/
├── Models/
│   └── Models.cs              # Data models (StudentData, AdminConfigData, etc.)
├── Services/
│   └── GoogleSheetsService.cs # Google Sheets integration service
├── App.xaml                   # Application definition and global styles
├── App.xaml.cs               # Application startup logic
├── MainWindow.xaml           # Main window UI definition
├── MainWindow.xaml.cs        # Main window logic (student form)
├── FeedbackWindow.xaml       # Feedback collection UI
├── FeedbackWindow.xaml.cs    # Feedback collection logic
├── App.config                # Configuration file with Google credentials
└── StudentFeedbackApp.csproj # Project file with dependencies
```

## 🚀 **Setup Instructions**

### **Prerequisites**
1. **Windows 10/11**: Required for WPF applications
2. **.NET 8.0 SDK**: Download from https://dotnet.microsoft.com/download
3. **Visual Studio 2022** (recommended) or **Visual Studio Code** with C# extension

### **Installation Steps**

#### **Option 1: Using Visual Studio**
1. **Open Visual Studio 2022**
2. **File → Open → Folder** and select the `csharp-desktop` folder
3. **Build → Restore NuGet Packages**
4. **Update App.config** with your Google Sheets credentials (if different)
5. **Build → Build Solution** (Ctrl+Shift+B)
6. **Debug → Start Debugging** (F5)

#### **Option 2: Using Command Line**
```bash
cd csharp-desktop
dotnet restore
dotnet build
dotnet run
```

### **Configuration**
The application uses `App.config` for configuration. Update the following values if needed:
- `GoogleClientEmail`: Your Google service account email
- `GooglePrivateKey`: Your Google service account private key
- `GoogleSpreadsheetId`: Your Google Spreadsheet ID

## 🎨 **UI Components**

### **Main Window Features**
- **Progress Indicators**: Visual step-by-step progress
- **Cascading Dropdowns**: Smart filtering of options
- **Real-time Validation**: Enable/disable continue button based on form completion
- **Loading States**: Professional loading indicators during data fetch

### **Feedback Window Features**
- **Registration Number Highlight**: Prominent display at the top
- **Subject Cards**: Clean, organized layout for each subject
- **Question Numbering**: Clear Q1, Q2, Q3... format
- **Rating Buttons**: 1-10 scale with visual feedback
- **Progress Tracking**: Real-time count of answered questions
- **Submit Validation**: Only enabled when all questions are answered

## 📊 **Data Flow**

### **1. Application Startup**
- Load Google Sheets service configuration
- Fetch admin configuration data from Google Sheets
- Populate initial dropdown (Joining Year)

### **2. Student Information Collection**
- User selects Joining Year → loads Branches
- User selects Branch → loads Academic Years
- User selects Academic Year → loads Sections
- User enters Registration Number
- All fields validated before enabling "Continue"

### **3. Feedback Collection**
- Filter subjects based on student selections
- Generate feedback form with all questions
- Track completion progress in real-time
- Validate all questions answered before enabling submit

### **4. Data Submission**
- Create sheet name: `YYYYMMDD_JoiningYear_Branch_Year_Section`
- Check if sheet exists, create if needed
- Add header row for new sheets
- Submit all feedback responses
- Display success/error messages

## 🔧 **Building for Distribution**

### **Debug Build**
```bash
dotnet build --configuration Debug
```

### **Release Build**
```bash
dotnet build --configuration Release
```

### **Publish Self-Contained**
```bash
dotnet publish --configuration Release --self-contained --runtime win-x64
```

### **Create MSI Installer (Advanced)**
Use tools like:
- **WiX Toolset**: For creating MSI installers
- **Advanced Installer**: Commercial tool with GUI
- **Inno Setup**: Free installer creation tool

## 🎯 **Advantages of C# WPF Version**

### **Performance**
- **Native Windows Application**: No web rendering overhead
- **Direct .NET Integration**: Faster execution and memory usage
- **Native Controls**: Optimal Windows UI performance

### **Deployment**
- **Single EXE**: Can be published as single executable
- **No Browser Required**: Standalone desktop application
- **MSI Installer Support**: Professional Windows installer
- **Windows Store Compatible**: Can be packaged for Microsoft Store

### **Features**
- **Native Windows Integration**: Better OS integration
- **Offline Capability**: Works without internet (after initial data load)
- **Windows Notifications**: Native toast notifications
- **File System Access**: Direct file operations if needed

## 🆚 **Comparison with Electron Version**

| Feature | Electron Version | C# WPF Version |
|---------|------------------|----------------|
| **Platform** | Cross-platform | Windows only |
| **Performance** | Good | Excellent |
| **Memory Usage** | Higher | Lower |
| **Startup Time** | Slower | Faster |
| **File Size** | Larger | Smaller |
| **Development** | Web technologies | Native .NET |
| **Updates** | Auto-update ready | Requires installer |

## 🚀 **Getting Started**

1. **Download the project** from the GitHub repository
2. **Install .NET 8.0 SDK** if not already installed
3. **Open in Visual Studio** or use command line
4. **Update App.config** with your Google Sheets credentials
5. **Build and run** the application
6. **Test with your Google Sheets data**

## 📞 **Support**
For issues specific to the C# version:
1. Check the **Output** window in Visual Studio for errors
2. Verify **Google Sheets credentials** in App.config
3. Ensure **internet connection** for Google Sheets access
4. Check **Windows Event Viewer** for application errors

Your C# WPF Student Feedback System is ready to provide a native Windows experience! 🎉
