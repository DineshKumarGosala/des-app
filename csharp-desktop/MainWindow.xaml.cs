using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using StudentFeedbackApp.Models;
using StudentFeedbackApp.Services;

namespace StudentFeedbackApp
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly GoogleSheetsService _googleSheetsService;
        private List<AdminConfigData> _adminData;
        private StudentData _currentStudentData;

        public MainWindow()
        {
            InitializeComponent();
            _googleSheetsService = new GoogleSheetsService();
            LoadInitialData();
        }

        private async void LoadInitialData()
        {
            try
            {
                LoadingPanel.Visibility = Visibility.Visible;
                MainContent.Visibility = Visibility.Collapsed;

                _adminData = await _googleSheetsService.GetAdminConfigAsync();
                
                if (_adminData != null && _adminData.Any())
                {
                    PopulateJoiningYears();
                }
                else
                {
                    MessageBox.Show("Failed to load data from Google Sheets. Please check your configuration.", 
                                  "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading data: {ex.Message}", "Error", 
                              MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                LoadingPanel.Visibility = Visibility.Collapsed;
                MainContent.Visibility = Visibility.Visible;
            }
        }

        private void PopulateJoiningYears()
        {
            var joiningYears = _adminData.Select(x => x.JoiningYear).Distinct().OrderBy(x => x).ToList();
            JoiningYearComboBox.ItemsSource = joiningYears;
        }

        private void JoiningYearComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (JoiningYearComboBox.SelectedValue != null)
            {
                var selectedYear = JoiningYearComboBox.SelectedValue.ToString();
                var branches = _adminData.Where(x => x.JoiningYear == selectedYear)
                                       .Select(x => x.Branch).Distinct().OrderBy(x => x).ToList();
                
                BranchComboBox.ItemsSource = branches;
                BranchComboBox.IsEnabled = true;
                
                // Clear subsequent dropdowns
                YearComboBox.ItemsSource = null;
                YearComboBox.IsEnabled = false;
                SectionComboBox.ItemsSource = null;
                SectionComboBox.IsEnabled = false;
            }
        }

        private void BranchComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (BranchComboBox.SelectedValue != null && JoiningYearComboBox.SelectedValue != null)
            {
                var selectedJoiningYear = JoiningYearComboBox.SelectedValue.ToString();
                var selectedBranch = BranchComboBox.SelectedValue.ToString();
                
                var years = _adminData.Where(x => x.JoiningYear == selectedJoiningYear && x.Branch == selectedBranch)
                                    .Select(x => x.Year).Distinct().OrderBy(x => x).ToList();
                
                YearComboBox.ItemsSource = years;
                YearComboBox.IsEnabled = true;
                
                // Clear subsequent dropdowns
                SectionComboBox.ItemsSource = null;
                SectionComboBox.IsEnabled = false;
            }
        }

        private void YearComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (YearComboBox.SelectedValue != null && BranchComboBox.SelectedValue != null && JoiningYearComboBox.SelectedValue != null)
            {
                var selectedJoiningYear = JoiningYearComboBox.SelectedValue.ToString();
                var selectedBranch = BranchComboBox.SelectedValue.ToString();
                var selectedYear = YearComboBox.SelectedValue.ToString();
                
                var sections = _adminData.Where(x => x.JoiningYear == selectedJoiningYear && 
                                               x.Branch == selectedBranch && 
                                               x.Year == selectedYear)
                                       .Select(x => x.Section).Distinct().OrderBy(x => x).ToList();
                
                SectionComboBox.ItemsSource = sections;
                SectionComboBox.IsEnabled = true;
            }
        }

        private void SectionComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            UpdateContinueButtonState();
        }

        private void RegistrationNumberTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            UpdateContinueButtonState();
        }

        private void UpdateContinueButtonState()
        {
            ContinueButton.IsEnabled = JoiningYearComboBox.SelectedValue != null &&
                                     BranchComboBox.SelectedValue != null &&
                                     YearComboBox.SelectedValue != null &&
                                     SectionComboBox.SelectedValue != null &&
                                     !string.IsNullOrWhiteSpace(RegistrationNumberTextBox.Text);
        }

        private void ContinueButton_Click(object sender, RoutedEventArgs e)
        {
            _currentStudentData = new StudentData
            {
                JoiningYear = JoiningYearComboBox.SelectedValue.ToString(),
                Branch = BranchComboBox.SelectedValue.ToString(),
                Year = YearComboBox.SelectedValue.ToString(),
                Section = SectionComboBox.SelectedValue.ToString(),
                RegistrationNumber = RegistrationNumberTextBox.Text.Trim()
            };

            // Open feedback window
            var feedbackWindow = new FeedbackWindow(_currentStudentData, _adminData, _googleSheetsService);
            feedbackWindow.ShowDialog();
        }
    }
}
