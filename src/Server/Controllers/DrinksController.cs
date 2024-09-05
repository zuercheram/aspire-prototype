using Aspire.Prototype.Services;
using Aspire.Prototype.Shared;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aspire.Prototype.Server.Controllers;

[ValidateAntiForgeryToken]
[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
[ApiController]
[Route("api/[controller]")]
public class DrinksController : ControllerBase
{
    private readonly IDrinkService _drinkService;

    public DrinksController(IDrinkService drinkService)
    {
        _drinkService = drinkService;
    }

    [Authorize(Policy = AuthorizationPolicies.AssignmentToDrinkReaderRoleRequired)]
    [HttpGet]
    public async Task<ActionResult<IList<DrinkModel>>> GetAllDrinksAsync()
    {
        return Ok(await _drinkService.GetAllDrinksAsync());
    }

    [Authorize(Policy = AuthorizationPolicies.AssignmentToDrinkReaderRoleRequired)]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<DrinkModel>> GetByIdAsync(int id)
    {
        return Ok(await _drinkService.GetDrinkByIdAsync(id));
    }

    [Authorize(Policy = AuthorizationPolicies.AssignmentToDrinkWriterRoleRequired)]
    [HttpPost]
    public async Task<ActionResult<DrinkModel>> CreateOrUpdateAsync(DrinkModel drinkModel)
    {
        if (drinkModel.DrinkId == null || drinkModel.DrinkId == 0)
        {
            await _drinkService.CreateDrinkAsync(drinkModel);
        }
        else
        {
            await _drinkService.UpdateDrinkAsync(drinkModel);
        }

        return Ok(drinkModel);
    }

    [Authorize(Policy = AuthorizationPolicies.AssignmentToDrinkAdminRoleRequired)]
    [HttpGet("AdminInfo")]
    public ActionResult<string> GetAdminMock()
    {
        return Ok("Admin allowed");
    }
}
