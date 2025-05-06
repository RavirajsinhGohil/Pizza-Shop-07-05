using System.ComponentModel.DataAnnotations;

namespace PizzaShop.Entity.ViewModel;

public class ForgotPasswordViewModel
{   
    [Required(ErrorMessage = "Email is Required.")]
    public string? Email { get; set; }
}
