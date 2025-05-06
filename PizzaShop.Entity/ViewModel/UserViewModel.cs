using System.ComponentModel.DataAnnotations;

namespace PizzaShop.Entity.ViewModel;

public class UserViewModel
{
    public string? Email { get; set; }

    [Required(ErrorMessage = "First Name is required")]
    [MaxLength(20, ErrorMessage = "First Name must be maximum of 20 characters")]
    public string? Firstname { get; set; }
    [Required(ErrorMessage = "Last Name is required")]
    [MaxLength(20, ErrorMessage = "Last Name must be maximum of 20 characters")]
    public string? Lastname { get; set; }

    [MaxLength(20, ErrorMessage = "User Name must be maximum of 20 characters")]
    [Required(ErrorMessage = "User Name is required")]
    public string? Username { get; set; }

    [Required(ErrorMessage = "Phone is required")]
    [MinLength(10, ErrorMessage = "Phone must be at least of 10 characters")]
    [MaxLength(10, ErrorMessage = "Phone must be maximum of 10 characters")]
    public string? Phone { get; set; }

    public int? RoleId { get; set; }

    public string? Rolename { get; set; }

    [Required(ErrorMessage = "Please Select Country")]
    public string? Country { get; set; }

    [Required(ErrorMessage = "Please Select State")]
    public string? State { get; set; }


    [Required(ErrorMessage = "Please Select City")]
    public string? City { get; set; }

    [Required(ErrorMessage = "Zipcode is Required")]
    public int? Zipcode { get; set; }

    [Required(ErrorMessage = "Address is required")]
    public string Address { get; set; }

    public string? Profileimagepath { get; set; }
}
