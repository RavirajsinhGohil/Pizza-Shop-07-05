using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace PizzaShop.Entity.ViewModel;

public class ItemViewModel
{
    public int Itemid { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Rate is required")]
    [Range(0.01, 1000, ErrorMessage = "Rate must be greater than zero")]
    public decimal? Rate { get; set; }

    [Required(ErrorMessage = "Please Select a Type")]
    public string? Itemtype { get; set; }

    [Required(ErrorMessage = "Please Select a Unit")]
    public string? Unit { get; set; }

    [Required(ErrorMessage = "Quantity is required")]
    [Range(0.01, 1000, ErrorMessage = "Quantity must be greater than zero")]
    public decimal? Quantity { get; set; }
    public bool Isavailable { get; set; }
    public string? Itemimage { get; set; } = "";
    public IFormFile? ItemPhoto { get; set; }
    public decimal? Tax { get; set; }
    public string? ItemShortCode { get; set; }
    public string? Description { get; set; }

    [Required(ErrorMessage = "Please Select a Category")]
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public bool Isdeleted { get; set; }
    public decimal? OrderTotalAmount
    {
        get
        {
            if (OrderPrice.HasValue && OrderQuantity.HasValue)
                return OrderPrice.Value * OrderQuantity.Value;

            return null;
        }
    }
    public int? OrderQuantity { get; set; }
    public decimal? OrderPrice { get; set; }
    public int? OrderDetailId { get; set; }
    public List<int?>? ModifierGroupIds { get; set; }
    public List<ModifierGorupDataViewModel>? ModifierGroupData { get; set; }
    public List<ModifierGroupViewModel>? ModifierGroups { get; set; }
    public List<ModifiersViewModel>? Modifiers { get; set; }

      public string ItemTypeIcon
        {
            get
            {
            return Itemtype switch
            {
                "Veg" => "/images/icons/Veg-icon.svg",
                "Non-Veg" => "/images/icons/non-veg-icon.svg",
                "Vegan" => "/images/icons/vegan-icon.svg",
                _ => "/images/icons/unknown-icon.svg",
            };
        }
        }
}

public class ModifierGorupDataViewModel
{
    public int? Id { get; set; }
    public int? Min { get; set; }
    public int? Max { get; set; }
}

// public class MinMaxViewmodel
// {
//     public int? Min { get; set; }
//     public int? Max { get; set; }
// }



