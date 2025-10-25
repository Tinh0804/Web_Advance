namespace src.Application.DTOs.Request
{
    class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Dob { get; set; } = 18;
        public string PhoneNumber { get; set; } = string.Empty;
        public string NativeLanguage { get; set; } = "vi";
        public string LearningLanguage { get; set; } = "en";
    }
}