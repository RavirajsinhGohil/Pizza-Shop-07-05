using System.ComponentModel.DataAnnotations;

namespace PizzaShop.Entity.ViewModel;

public class CategoryViewModel
{
    public int Categoryid { get; set; }

    [Required(ErrorMessage = "Category Name is required")]
    public string? Name { get; set; }
    public string? Description { get; set; }
}