using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using StudentFeedbackApp.Models;

namespace StudentFeedbackApp.Services
{
    public class GoogleSheetsService
    {
        private readonly SheetsService _sheetsService;
        private readonly string _spreadsheetId;

        public GoogleSheetsService()
        {
            // Initialize Google Sheets service
            var credential = GetGoogleCredential();
            _sheetsService = new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Student Feedback System"
            });

            _spreadsheetId = GetSpreadsheetId();
        }

        private GoogleCredential GetGoogleCredential()
        {
            // Load credentials from app.config or environment variables
            var clientEmail = System.Configuration.ConfigurationManager.AppSettings["GoogleClientEmail"];
            var privateKey = System.Configuration.ConfigurationManager.AppSettings["GooglePrivateKey"];

            if (string.IsNullOrEmpty(clientEmail) || string.IsNullOrEmpty(privateKey))
            {
                throw new InvalidOperationException("Google Sheets credentials not found in configuration.");
            }

            var credential = GoogleCredential.FromServiceAccountCredential(
                new ServiceAccountCredential(new ServiceAccountCredential.Initializer(clientEmail)
                {
                    Scopes = new[] { SheetsService.Scope.Spreadsheets }
                }.FromPrivateKey(privateKey.Replace("\\n", "\n"))));

            return credential;
        }

        private string GetSpreadsheetId()
        {
            var spreadsheetId = System.Configuration.ConfigurationManager.AppSettings["GoogleSpreadsheetId"];
            if (string.IsNullOrEmpty(spreadsheetId))
            {
                throw new InvalidOperationException("Google Spreadsheet ID not found in configuration.");
            }
            return spreadsheetId;
        }

        public async Task<List<AdminConfigData>> GetAdminConfigAsync()
        {
            try
            {
                var range = "Admin Config!A:Z";
                var request = _sheetsService.Spreadsheets.Values.Get(_spreadsheetId, range);
                var response = await request.ExecuteAsync();

                if (response.Values == null || response.Values.Count == 0)
                {
                    return new List<AdminConfigData>();
                }

                var headers = response.Values[0].Select(h => h?.ToString()).ToList();
                var data = response.Values.Skip(1).ToList();

                // Identify question columns
                var basicColumns = new[] { "JoiningYear", "Branch", "Year", "Section", "Subject", "Teacher" };
                var questionColumns = headers.Where(h => !string.IsNullOrEmpty(h) && !basicColumns.Contains(h))
                                            .ToList();

                var result = new List<AdminConfigData>();

                foreach (var row in data)
                {
                    var configData = new AdminConfigData();
                    
                    for (int i = 0; i < headers.Count && i < row.Count; i++)
                    {
                        var header = headers[i];
                        var value = row[i]?.ToString() ?? "";

                        switch (header)
                        {
                            case "JoiningYear":
                                configData.JoiningYear = value;
                                break;
                            case "Branch":
                                configData.Branch = value;
                                break;
                            case "Year":
                                configData.Year = value;
                                break;
                            case "Section":
                                configData.Section = value;
                                break;
                            case "Subject":
                                configData.Subject = value;
                                break;
                            case "Teacher":
                                configData.Teacher = value;
                                break;
                        }
                    }

                    // Add questions (same for all subjects)
                    configData.Questions = questionColumns.ToList();
                    result.Add(configData);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to load admin config: {ex.Message}", ex);
            }
        }

        public async Task<bool> SubmitFeedbackAsync(FeedbackSubmission submission)
        {
            try
            {
                // Create sheet name with format: date_joiningdate_branch_year_section
                var currentDate = DateTime.Now.ToString("yyyyMMdd");
                var joiningYear = submission.StudentData.JoiningYear.Replace(" ", "");
                var branch = submission.StudentData.Branch.Replace(" ", "");
                var year = submission.StudentData.Year.Replace(" ", "").Replace("/", "");
                var section = submission.StudentData.Section.Replace(" ", "");

                var sheetName = $"{currentDate}_{joiningYear}_{branch}_{year}_{section}";

                // Check if sheet exists, create if not
                await EnsureSheetExistsAsync(sheetName);

                // Prepare data rows
                var rows = new List<IList<object>>();
                
                foreach (var response in submission.Responses)
                {
                    foreach (var rating in response.Ratings)
                    {
                        var row = new List<object>
                        {
                            submission.SubmissionTime,
                            submission.StudentData.JoiningYear,
                            submission.StudentData.Branch,
                            submission.StudentData.Year,
                            submission.StudentData.Section,
                            submission.StudentData.RegistrationNumber,
                            response.Subject,
                            response.Teacher,
                            $"Question {rating.Key + 1}",
                            rating.Value
                        };
                        rows.Add(row);
                    }
                }

                // Append data to sheet
                var range = $"{sheetName}!A:J";
                var valueRange = new ValueRange { Values = rows };
                var appendRequest = _sheetsService.Spreadsheets.Values.Append(valueRange, _spreadsheetId, range);
                appendRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.RAW;

                await appendRequest.ExecuteAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to submit feedback: {ex.Message}", ex);
            }
        }

        private async Task EnsureSheetExistsAsync(string sheetName)
        {
            try
            {
                // Try to get the sheet
                var range = $"{sheetName}!A1:J1";
                var request = _sheetsService.Spreadsheets.Values.Get(_spreadsheetId, range);
                await request.ExecuteAsync();
            }
            catch
            {
                // Sheet doesn't exist, create it
                var addSheetRequest = new Request
                {
                    AddSheet = new AddSheetRequest
                    {
                        Properties = new SheetProperties
                        {
                            Title = sheetName
                        }
                    }
                };

                var batchUpdateRequest = new BatchUpdateSpreadsheetRequest
                {
                    Requests = new List<Request> { addSheetRequest }
                };

                await _sheetsService.Spreadsheets.BatchUpdate(batchUpdateRequest, _spreadsheetId).ExecuteAsync();

                // Add header row
                var headerRow = new List<object>
                {
                    "Submission Time", "Joining Year", "Branch", "Academic Year", "Section",
                    "Registration Number", "Subject", "Teacher", "Question", "Rating"
                };

                var headerRange = new ValueRange { Values = new List<IList<object>> { headerRow } };
                var updateRequest = _sheetsService.Spreadsheets.Values.Update(headerRange, _spreadsheetId, $"{sheetName}!A1:J1");
                updateRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.UpdateRequest.ValueInputOptionEnum.RAW;

                await updateRequest.ExecuteAsync();
            }
        }
    }
}
