namespace src.Application.DTOs.ModelDto
{


    public class FacebookUserInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public PictureData? Picture { get; set; }

        public class PictureData
        {
            public PictureUrl? Data { get; set; }
        }

        public class PictureUrl
        {
            public string Url { get; set; } = string.Empty;
            public int Height { get; set; }
            public int Width { get; set; }
            public bool IsSilhouette { get; set; }
        }
    }
    public class FacebookTokenVerification
    {
        public TokenData? Data { get; set; }
        
        public class TokenData
        {
            public bool IsValid { get; set; }
            public string AppId { get; set; } = string.Empty;
            public string Type { get; set; } = string.Empty;
            public string Application { get; set; } = string.Empty;
            public long ExpiresAt { get; set; }
            public string UserId { get; set; } = string.Empty;
        }
    }
}