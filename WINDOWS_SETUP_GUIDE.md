# 🚀 Windows Desktop Application Setup Guide

## 📥 **Step 1: Download from GitHub**

1. **Go to your GitHub repository**: https://github.com/DineshKumarGosala/des-app
2. **Click the green "Code" button**
3. **Click "Download ZIP"** 
4. **Extract the ZIP file** to a folder like `C:\Projects\student-feedback-app`

## 🛠️ **Step 2: Install Required Software**

### **Install Node.js**
1. Go to https://nodejs.org/
2. Download **LTS version** (recommended)
3. Run the installer and follow the setup wizard
4. **Check installation**: Open Command Prompt and run:
   ```cmd
   node --version
   npm --version
   ```

### **Install Git (Optional but recommended)**
1. Go to https://git-scm.com/download/win
2. Download and install Git for Windows
3. This allows you to clone instead of downloading ZIP

## 📂 **Step 3: Set Up the Project**

### **Open Command Prompt or PowerShell**
1. **Navigate to project folder**:
   ```cmd
   cd C:\Projects\student-feedback-app
   ```

2. **Install dependencies**:
   ```cmd
   npm install
   ```
   This will install all 671 packages needed for the application.

### **Set Up Environment Variables**
1. **Create `.env.local` file** in the project root folder
2. **Add your Google Sheets credentials**:
   ```env
   # Google Sheets Integration
   GOOGLE_CLIENT_EMAIL=student-feedback-service@optimal-spark-392008.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
   GOOGLE_SPREADSHEET_ID=1F3K3mPXKYi8sMzg-S4ei4Q2Ev2nUS5vO_dOj6d6nIPI

   # Next.js Configuration
   NODE_ENV=development
   ```

## 🖥️ **Step 4: Run the Desktop Application**

### **Development Mode**
```cmd
npm run dev
```
This will:
- Start the Next.js server at http://localhost:3000
- Launch the Electron desktop application
- Enable hot reload for development

### **Build Windows Installer**
```cmd
npm run build:win
```
This will:
- Create a production build
- Generate a Windows installer (.exe) in the `dist` folder
- Take about 5-10 minutes to complete

## 📦 **Step 5: Distribute the Application**

After running `npm run build:win`, you'll find:
- **`dist/Student Feedback Setup.exe`**: Windows installer
- **`dist/win-unpacked/`**: Portable application folder

### **Distribution Options**
1. **Installer**: Share the `.exe` file with students
2. **Portable**: Share the entire `win-unpacked` folder
3. **Auto-updater**: Configure for automatic updates (advanced)

## 🎯 **Available Commands**

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run development mode (Next.js + Electron) |
| `npm run build` | Build Next.js for production |
| `npm run build:win` | Build Windows desktop installer |
| `npm run build:mac` | Build macOS app (requires macOS) |
| `npm run build:linux` | Build Linux AppImage |
| `npm start` | Start production server |

## 🔧 **Troubleshooting**

### **If npm install fails:**
```cmd
npm cache clean --force
npm install
```

### **If Electron doesn't start:**
- Check if port 3000 is available
- Run `npm run dev:next` first, then `npm run dev:electron`

### **If build fails:**
- Ensure you have enough disk space (5GB+)
- Close antivirus temporarily during build
- Run as Administrator if needed

### **Common Issues:**
- **Python not found**: Install Python 3.x from python.org
- **Visual Studio Build Tools**: May be required for some dependencies
- **Windows Defender**: May flag the installer as unknown

## 🎊 **Success Indicators**

### **Development Working:**
- ✅ Electron window opens automatically
- ✅ Application shows "Student Feedback System"
- ✅ Google Sheets integration works
- ✅ All forms and feedback collection functional

### **Build Successful:**
- ✅ `dist/Student Feedback Setup.exe` created
- ✅ Installer runs and installs the application
- ✅ Desktop shortcut created
- ✅ Application launches from Start Menu

## 📱 **Application Features**

Your Windows desktop application will have:
- **Native window controls** (minimize, maximize, close)
- **System tray integration**
- **File dialogs** for data export
- **Keyboard shortcuts**
- **Offline capability** (after initial data load)
- **Professional installer** with uninstall option

## 🚀 **Next Steps**

1. **Test thoroughly** on your Windows machine
2. **Build the installer** with `npm run build:win`
3. **Test the installer** on a clean Windows machine
4. **Distribute to students** via USB, network, or download link

## 📞 **Support**

If you encounter any issues:
1. Check the console logs in the terminal
2. Check the browser developer tools (F12) for errors
3. Verify your Google Sheets credentials are correct
4. Ensure your Google Sheets has the correct structure

Your Student Feedback System is now ready to be a professional Windows desktop application! 🎉
