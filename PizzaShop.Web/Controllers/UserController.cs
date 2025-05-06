using Microsoft.AspNetCore.Mvc;
using PizzaShop.Entity.ViewModel;
using PizzaShop.Service.Implementations;
using PizzaShop.Service.Interfaces;
using PizzaShop.Entity.Constants;
using System.Threading.Tasks;

namespace PizzaShop.Web.Controllers;

public class UserController : Controller
{
    private readonly ILogger<LoginController> _logger;
    private readonly IAuthService _authService;
    private readonly IUserService _userService;

    public string? UserEmail { get; private set; }

    public UserController(ILogger<LoginController> logger, IAuthService authService, IUserService userService)
    {
        _logger = logger;
        _authService = authService;
        _userService = userService;
    }

    [CustomAuthorize("Users", "CanView")]
    [HttpGet]
    public IActionResult UserList(string searchTerm = "", int page = 1, int pageSize = 5, string sortBy = "Name", string sortOrder = "asc")
    {
        UserPaginationViewModel? paginatedUsers = _userService.GetUsers(searchTerm, page, pageSize, sortBy, sortOrder);

        if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
        {
            return PartialView("_UserList", paginatedUsers);
        }

        return View(paginatedUsers);
    }

    // {CustomAuthorize("Users", "CanAddEdit")}
    [HttpGet]
    public IActionResult AddUser()
    {
        return View();
    }

    [CustomAuthorize("Users", "CanAddEdit")]
    [HttpPost]
    public async Task<IActionResult> AddUser(AddUserViewModel model)
    {
        if (ModelState.IsValid)
        {
            bool isAdded = await _userService.AddUser(model);
            if (isAdded)
            {
                string filePath = @"C:\Users\pct216\Downloads\Pizza Shop\Main Project\Pizza Shop\PizzaShop.Web\EmailTemplate\AddUserEmailTemplate.html";
                string emailBody = System.IO.File.ReadAllText(filePath);

                emailBody = emailBody.Replace("{abc123}", model.Username);
                emailBody = emailBody.Replace("{abc@123}", model.Password);

                string subject = "User Details";
                _authService.SendEmailAsync(model.Email, subject, emailBody);
                TempData["success"] = Constants.NewUserCreated;
                return RedirectToAction("UserList", "User");
            }
        }
        return View();
    }

    [CustomAuthorize("Users", "CanAddEdit")]
    [HttpGet]
    public IActionResult EditUser(int Userid)
    {
        EditUserViewModel? model = _userService.GetUserForEdit(Userid);
        if (model == null)
        {
            return new RedirectToRouteResult(new { Controller = "ErrorPages", action = "ShowError", statusCode = "404" });
        }

        return View(model);
    }

    [CustomAuthorize("Users", "CanAddEdit")]
    [HttpPost]
    public IActionResult EditUser(EditUserViewModel model, int Userid)
    {
        if (!ModelState.IsValid)
        {
            return NotFound();
        }
        bool isUpdated = _userService.EditUser(Userid, model);
        if (!isUpdated)
        {
            return NotFound();
        }
        TempData["success"] = Constants.UserUpdated;

        return RedirectToAction("UserList", "User");
    }

    [CustomAuthorize("Users", "CanDelete")]
    public IActionResult DeleteUser(int Userid)
    {
        bool isDeleted = _userService.DeleteUser(Userid);
        if (!isDeleted)
        {
            return NotFound();
        }

        return RedirectToAction("UserList", "User");
    }

    [CustomAuthorize("RoleAndPermission", "CanView")]
    [HttpGet]
    public IActionResult Roles()
    {
        return View();
    }

    [HttpGet]
    public async Task<IActionResult> Permissions(string role)
    {
        ViewBag.SelectedRole = role;
        List<PermissionsViewModel>? permissions = await _userService.GetPermissionsByRoleAsync(role);
        if(permissions == null)
        {
            return new RedirectToRouteResult(new { Controller = "ErrorPages", action = "ShowError", statusCode = "404" });
        }
        return View(permissions);
    }

    [HttpPost]
    public async Task<IActionResult> Permissions([FromBody] List<PermissionsViewModel> updatedPermissions)
    {
        if (updatedPermissions == null || !updatedPermissions.Any())
        {
            return Json(new { success = false, message = Constants.NotUpdatedPermissions});
        }
        foreach (PermissionsViewModel? perm in updatedPermissions)
        {
            Console.WriteLine($"RoleId: {perm.RoleName}, PermissionId: {perm.PermissionName}, CanView: {perm.CanView}, CanEdit: {perm.CanAddEdit}, CanDelete: {perm.CanDelete}");
        }
        
        bool result = await _userService.UpdateRolePermissionsAsync(updatedPermissions);

        return Json(new { success = result });
    }






}
