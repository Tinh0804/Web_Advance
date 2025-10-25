using Microsoft.AspNetCore.Authorization;

namespace src.API.Attributes
{
    public class PermissionAttribute : AuthorizeAttribute
    {
        public PermissionAttribute(string permission) : base()
        {
            Policy = permission;
        }
    }
}