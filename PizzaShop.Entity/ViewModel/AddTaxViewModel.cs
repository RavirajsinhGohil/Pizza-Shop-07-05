using System.ComponentModel.DataAnnotations;

namespace PizzaShop.Entity.ViewModel;

public class AddTaxViewModel
{
    public int? TaxId { get; set; }

    [Required]
    public string TaxName { get; set; } = null!;

    public string? Type { get; set; } 
    
    [Required]
    public decimal TaxAmount { get; set; }

    public bool? Isenable { get; set; }

    public bool? Isdefault { get; set; }

}