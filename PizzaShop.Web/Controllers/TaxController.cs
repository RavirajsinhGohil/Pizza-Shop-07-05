
using PizzaShop.Repository.Interfaces;
using PizzaShop.Service.Implementations;
using PizzaShop.Entity.ViewModel;
using Microsoft.AspNetCore.Mvc;
using PizzaShop.Service.Interfaces;
namespace PizzaShop.Web.Controllers;

public class TaxController : Controller
{

    private readonly ITaxService _taxservice;

    public TaxController(ITaxService taxservice)
    {
        _taxservice = taxservice;
    }

    public IActionResult Index()
    {  
        ViewBag.active = "Tax";
        return View();
    }

    // Get Partial View OF TaxTableList

    public IActionResult GetTaxList(int pageNumber = 1, int pageSize = 5, string searchKeyword = "")
    {
        var model = _taxservice.GetTaxList( pageNumber, pageSize, searchKeyword);
        return PartialView("_TableList", model);
    }

    // POST : Add Tax
   [HttpPost]
    public IActionResult AddTax(AddTaxViewModel model)
    {
      // if(!ModelState.IsValid)
      // {
      //   return View();
      // }
      var response = _taxservice.AddTax(model).Result;

       if(!response.Success)
        {
        TempData["error"] = response.Message;
        }
        TempData["success"] = response.Message; 

      return RedirectToAction("Index","Tax");
    }

    // POST : Edit Tax
   [HttpPost]
    public IActionResult EditTax(AddTaxViewModel model)
    {
      var response = _taxservice.EditTax(model).Result;

       if(!response.Success)
        {
        TempData["error"] = response.Message;
        }
        TempData["success"] = response.Message; 

      return RedirectToAction("Index","Tax");
    }
    // Delete Tax

    public IActionResult DeleteTax(int id )
    {
      var response = _taxservice.DeleteTax(id).Result;

      if(!response.Success)
      {
        TempData["error"] = response.Message;
      }
        TempData["success"] = response.Message; 

      return RedirectToAction("Index","Tax");
    }
}