using PizzaShop.Entity.ViewModel;
using Microsoft.AspNetCore.Mvc;
using PizzaShop.Service.Interfaces;

namespace PizzaShop.Web.Controllers;
public class SectionController : Controller
{
    // private readonly ISectionRepository _sectionService;
    private readonly ISectionService _sectionService;

    public SectionController(ISectionService sectionService)
    {
      _sectionService = sectionService;
    }

    [HttpGet]
    public IActionResult Index(int? id)
    {
      var sections = _sectionService.GetSectionList();
      if (id == null)
      {
        id = sections.First().SectionId;
      }

      ViewBag.active = "Section";

      var model = new SectionAndTableViewModel
      {
        SelectedSection = id,
        Sections = sections,
        Table = new AddTableViewmodel()
      };
      return View(model);
    }

    [HttpGet]
    public IActionResult GetDiningTableList(int id, int pageNumber = 1, int pageSize = 5, string searchKeyword = "")
    {
      var sections = _sectionService.GetSectionList().ToList();

      if (id == 0)
      {
        id = sections.First().SectionId;
      }

      var model = _sectionService.GetDiningTablesListBySectionId(id, pageNumber, pageSize, searchKeyword);
      ViewBag.active = "Menu";

      return PartialView("~/Views/Section/_TableList.cshtml", model);
    }
    
    [HttpGet]
    public IActionResult GetSections(int? id)
    {
      var sections = _sectionService.GetSectionList().ToList();

      if (id == null)
      {
        id = sections.First().SectionId;
      }

      var model = new SectionNameListViewModel
      {
        Sections = sections,
        SelectedSection = id
      };

      return PartialView("~/Views/Section/_SectionList.cshtml", model);
    }

    [HttpPost("AddSection")]
    public IActionResult AddSection(SectionAndTableViewModel model)
    {
      var response = _sectionService.AddSection(model.Section).Result;

      if (!response.Success)
      {
        TempData["error"] = response.Message;
      }

      TempData["success"] = response.Message;

      return RedirectToAction("Index", "Section");
    }

    [HttpPost("EditSection")]
    public IActionResult EditSection(SectionAndTableViewModel model)
    {
      var response = _sectionService.EditSection(model.Section).Result;

      if (!response.Success)
      {
        TempData["error"] = response.Message;
      }

      TempData["success"] = response.Message;

      return RedirectToAction("Index", "Section");
    }

    [HttpGet("DeleteSection")]
    public IActionResult DeleteSection(int id)
    {
      var AuthResponse = _sectionService.DeleteSection(id).Result;

      if (!AuthResponse.Success)
      {
        TempData["error"] = AuthResponse.Message;
      }

      TempData["success"] = AuthResponse.Message;
      return RedirectToAction("Index", "Section");
    }

    [HttpPost("AddTable")]
    public IActionResult AddTable(SectionAndTableViewModel model)
    {
      var response = _sectionService.AddTable(model.Table).Result;

      if (!response.Success)
      {
        TempData["error"] = response.Message;
      }

      TempData["success"] = response.Message;

      return RedirectToAction("Index", "Section");
    }
    
    [HttpPost("EditTable")]
    public IActionResult EditTable(SectionAndTableViewModel model)
    {
      var response = _sectionService.EditTable(model.Table).Result;

      if (!response.Success)
      {
        TempData["error"] = response.Message;
      }

      TempData["success"] = response.Message;

      return RedirectToAction("Index", "Section");
    }

    // Delete Table
    [HttpGet("DeleteTable")]
    public IActionResult DeleteTable(int id)
    {
      var AuthResponse = _sectionService.DeleteTable(id).Result;

      if (!AuthResponse.Success)
      {
        TempData["error"] = AuthResponse.Message;
      }

      TempData["success"] = AuthResponse.Message;
      return RedirectToAction("Index", "Section");
    }

    [HttpPost]
    public IActionResult DeleteTables(List<int> ids)
    {

      var AuthResponse = _sectionService.DeleteTables(ids).Result;

      if (!AuthResponse.Success)
      {
        TempData["error"] = AuthResponse.Message;
      }

      TempData["success"] = AuthResponse.Message;

      return Json(new { redirectTo = Url.Action("Index", "Section") });

    }
}