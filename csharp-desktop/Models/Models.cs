using System.Collections.Generic;

namespace StudentFeedbackApp.Models
{
    public class StudentData
    {
        public string JoiningYear { get; set; }
        public string Branch { get; set; }
        public string Year { get; set; }
        public string Section { get; set; }
        public string RegistrationNumber { get; set; }
    }

    public class AdminConfigData
    {
        public string JoiningYear { get; set; }
        public string Branch { get; set; }
        public string Year { get; set; }
        public string Section { get; set; }
        public string Subject { get; set; }
        public string Teacher { get; set; }
        public List<string> Questions { get; set; } = new List<string>();
    }

    public class SubjectFeedback
    {
        public string Subject { get; set; }
        public string Teacher { get; set; }
        public List<string> Questions { get; set; } = new List<string>();
        public Dictionary<int, int> Ratings { get; set; } = new Dictionary<int, int>();
    }

    public class FeedbackSubmission
    {
        public StudentData StudentData { get; set; }
        public List<SubjectFeedback> Responses { get; set; } = new List<SubjectFeedback>();
        public string SubmissionTime { get; set; }
    }
}
