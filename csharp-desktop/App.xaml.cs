using System;
using System.Windows;

namespace StudentFeedbackApp
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            
            // Initialize the main window
            MainWindow mainWindow = new MainWindow();
            mainWindow.Show();
        }
    }
}
