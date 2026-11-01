using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService auth) : ControllerBase
{
    private readonly AuthService _auth = auth;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _auth.Login(request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (int.TryParse(userIdClaim, out var userId))
        {
            await _auth.Logout(userId);
        }
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpPost("register")]
    public IActionResult Register()
    {
        // Public self-registration is explicitly disabled in CareBase.
        // All healthcare staff accounts must be provisioned internally by an authorized employee manager.
        return StatusCode(StatusCodes.Status403Forbidden, new
        {
            message = "Public registration is disabled. Employee accounts are created internally by the facility administrator."
        });
    }
}
