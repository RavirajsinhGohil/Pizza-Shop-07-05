using System.ComponentModel.DataAnnotations;

namespace PizzaShop.Entity.ViewModel;

public class LoginViewModel
{
    [Required(ErrorMessage = "Email is Required.")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is Required.")]
    public string password{ get;set;}

    public bool RememberMe { get; set; }

}
