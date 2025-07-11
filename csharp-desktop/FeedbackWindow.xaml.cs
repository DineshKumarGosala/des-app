using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using StudentFeedbackApp.Models;
using StudentFeedbackApp.Services;

namespace StudentFeedbackApp
{
    public partial class FeedbackWindow : Window
    {
        private readonly StudentData _studentData;
        private readonly List<AdminConfigData> _adminData;
        private readonly GoogleSheetsService _googleSheetsService;
        private readonly List<SubjectFeedback> _feedbackResponses;
        private readonly List<string> _questions;

        public FeedbackWindow(StudentData studentData, List<AdminConfigData> adminData, GoogleSheetsService googleSheetsService)
        {
            InitializeComponent();
            
            _studentData = studentData;
            _adminData = adminData;
            _googleSheetsService = googleSheetsService;
            _feedbackResponses = new List<SubjectFeedback>();

            // Get questions from the first admin config entry
            _questions = adminData.FirstOrDefault()?.Questions ?? new List<string>();

            InitializeFeedbackForm();
        }

        private void InitializeFeedbackForm()
        {
            // Display student information
            RegistrationNumberText.Text = _studentData.RegistrationNumber;
            StudentInfoText.Text = $"{_studentData.JoiningYear} | {_studentData.Branch} | {_studentData.Year} | {_studentData.Section}";

            // Get subjects for this student
            var subjects = _adminData.Where(x => 
                x.JoiningYear == _studentData.JoiningYear &&
                x.Branch == _studentData.Branch &&
                x.Year == _studentData.Year &&
                x.Section == _studentData.Section
            ).ToList();

            // Create feedback forms for each subject
            foreach (var subject in subjects)
            {
                var subjectFeedback = new SubjectFeedback
                {
                    Subject = subject.Subject,
                    Teacher = subject.Teacher,
                    Questions = _questions
                };
                _feedbackResponses.Add(subjectFeedback);

                CreateSubjectFeedbackPanel(subjectFeedback);
            }
        }

        private void CreateSubjectFeedbackPanel(SubjectFeedback subjectFeedback)
        {
            // Create main panel for subject
            var subjectPanel = new Border
            {
                Background = Brushes.White,
                CornerRadius = new CornerRadius(8),
                Padding = new Thickness(20),
                Margin = new Thickness(0, 0, 0, 20)
            };

            var stackPanel = new StackPanel();

            // Subject header
            var subjectHeader = new TextBlock
            {
                Text = subjectFeedback.Subject,
                FontSize = 18,
                FontWeight = FontWeights.Bold,
                Margin = new Thickness(0, 0, 0, 5)
            };

            var teacherHeader = new TextBlock
            {
                Text = $"Teacher: {subjectFeedback.Teacher}",
                FontSize = 14,
                Foreground = new SolidColorBrush(Color.FromRgb(107, 114, 128)),
                Margin = new Thickness(0, 0, 0, 20)
            };

            stackPanel.Children.Add(subjectHeader);
            stackPanel.Children.Add(teacherHeader);

            // Create rating controls for each question
            for (int questionIndex = 0; questionIndex < subjectFeedback.Questions.Count; questionIndex++)
            {
                var questionPanel = CreateQuestionPanel(subjectFeedback, questionIndex);
                stackPanel.Children.Add(questionPanel);
            }

            subjectPanel.Child = stackPanel;
            SubjectsPanel.Children.Add(subjectPanel);
        }

        private StackPanel CreateQuestionPanel(SubjectFeedback subjectFeedback, int questionIndex)
        {
            var questionPanel = new StackPanel { Margin = new Thickness(0, 0, 0, 20) };

            // Question text
            var questionText = new TextBlock
            {
                Text = $"Q{questionIndex + 1}. {subjectFeedback.Questions[questionIndex]}",
                FontWeight = FontWeights.SemiBold,
                Margin = new Thickness(0, 0, 0, 10)
            };

            questionPanel.Children.Add(questionText);

            // Rating buttons panel
            var ratingsPanel = new WrapPanel();

            for (int rating = 1; rating <= 10; rating++)
            {
                var ratingButton = new Button
                {
                    Content = rating.ToString(),
                    Width = 40,
                    Height = 40,
                    Margin = new Thickness(5),
                    Background = new SolidColorBrush(Color.FromRgb(243, 244, 246)),
                    BorderBrush = new SolidColorBrush(Color.FromRgb(209, 213, 219)),
                    BorderThickness = new Thickness(2),
                    FontWeight = FontWeights.Bold,
                    Cursor = System.Windows.Input.Cursors.Hand
                };

                var currentRating = rating;
                ratingButton.Click += (sender, e) => {
                    HandleRatingClick(subjectFeedback, questionIndex, currentRating, ratingsPanel);
                };

                ratingsPanel.Children.Add(ratingButton);
            }

            questionPanel.Children.Add(ratingsPanel);
            return questionPanel;
        }

        private void HandleRatingClick(SubjectFeedback subjectFeedback, int questionIndex, int rating, WrapPanel ratingsPanel)
        {
            // Update the rating
            subjectFeedback.Ratings[questionIndex] = rating;

            // Update button styles
            for (int i = 0; i < ratingsPanel.Children.Count; i++)
            {
                var button = (Button)ratingsPanel.Children[i];
                if (i + 1 == rating)
                {
                    button.Background = new SolidColorBrush(Color.FromRgb(59, 130, 246));
                    button.Foreground = Brushes.White;
                    button.BorderBrush = new SolidColorBrush(Color.FromRgb(59, 130, 246));
                }
                else
                {
                    button.Background = new SolidColorBrush(Color.FromRgb(243, 244, 246));
                    button.Foreground = new SolidColorBrush(Color.FromRgb(55, 65, 81));
                    button.BorderBrush = new SolidColorBrush(Color.FromRgb(209, 213, 219));
                }
            }

            // Check if form is complete
            UpdateSubmitButtonState();
        }

        private void UpdateSubmitButtonState()
        {
            var totalQuestions = _feedbackResponses.Sum(r => r.Questions.Count);
            var answeredQuestions = _feedbackResponses.Sum(r => r.Ratings.Count);

            SubmitButton.IsEnabled = answeredQuestions == totalQuestions;
            
            if (SubmitButton.IsEnabled)
            {
                ProgressText.Text = "All questions answered! Ready to submit.";
                ProgressText.Foreground = new SolidColorBrush(Color.FromRgb(34, 197, 94));
            }
            else
            {
                ProgressText.Text = $"Progress: {answeredQuestions}/{totalQuestions} questions answered";
                ProgressText.Foreground = new SolidColorBrush(Color.FromRgb(107, 114, 128));
            }
        }

        private async void SubmitButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                SubmitButton.IsEnabled = false;
                SubmitButton.Content = "Submitting...";

                var submission = new FeedbackSubmission
                {
                    StudentData = _studentData,
                    Responses = _feedbackResponses,
                    SubmissionTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                };

                await _googleSheetsService.SubmitFeedbackAsync(submission);

                MessageBox.Show("Feedback submitted successfully!", "Success", 
                              MessageBoxButton.OK, MessageBoxImage.Information);

                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error submitting feedback: {ex.Message}", "Error", 
                              MessageBoxButton.OK, MessageBoxImage.Error);
                
                SubmitButton.IsEnabled = true;
                SubmitButton.Content = "Submit Feedback";
            }
        }

        private void BackButton_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
    }
}
