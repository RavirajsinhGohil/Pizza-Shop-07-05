using Microsoft.AspNetCore.Mvc;
using PizzaShop.Service.Interfaces;

namespace PizzaShop.Web.Controllers;

public class DashboardController: Controller
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;
    public DashboardController(IAuthService authService, IUserService userService)
    {
        _authService = authService;
        _userService = userService;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
}
