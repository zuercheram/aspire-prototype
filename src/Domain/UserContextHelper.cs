using Microsoft.AspNetCore.Http;

namespace Aspire.Prototype.Domain;

internal static class UserContextHelper
{
    private const string _objectIdentifierClaimType = "http://schemas.microsoft.com/identity/claims/objectidentifier";

    internal static Guid GetCurrentOid()
    {
        try
        {
            var httpContext = new HttpContextAccessor().HttpContext;
            if (httpContext != null && httpContext.User.Identity != null)
            {
                var objectIdentifier =
                    httpContext.User.Claims.FirstOrDefault(p => p.Type == _objectIdentifierClaimType);

                if (objectIdentifier != null)
                {
                    return Guid.Parse(objectIdentifier.Value);
                }
            }
        }
        catch (Exception)
        {
            return Guid.Empty;
        }

        return Guid.Empty;
    }
}
