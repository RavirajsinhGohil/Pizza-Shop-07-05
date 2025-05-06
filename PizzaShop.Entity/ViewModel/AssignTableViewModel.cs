using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PizzaShop.Entity.ViewModel;

public class AssignTableViewModel
{
    public int? Id { get; set; }
    public int? CustomerId { get; set; }
    public int? OrderId { get; set; }

    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    public string? Name { get; set; }

    [Required]
    [Phone]
    public string? Mobile { get; set; }

    [Required]
    [Range(1, 100)]
    public int NoOfPersons { get; set; }
    public int? SectionId { get; set; }

    [Required]
    public string? SectionName { get; set; }

    public string? SelectedTableId { get; set; }

    [NotMapped]
    public List<int>? TableIds { get; set; }

    public List<WaitingCustomerViewModel>? WaitingCustomers { get; set; }
    public List<string>? AvailableSections { get; set; }
}

public class WaitingCustomerViewModel
{
    public int? Id { get; set; }
    public int? WaitingTicketId { get; set; }
    public int? OrderId { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Mobile { get; set; }
    public int? NoOfPersons { get; set; }
    public string? SectionName { get; set; }
    public int? SectionId { get; set; }
}


public class AddWaitingTokenForTableViewModel
{
    public int WaitingTokenId { get; set; }
    public int? CustomerId { get; set; }
    [Required]
    public string? Email { get; set; }

    [Required]
    public string? Name { get; set; }

    [Required]
    [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Invalid 10-digit phone number.")]
    public string? Phone { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "At least one person is required.")]
    public int TotalPersons { get; set; }

    [Required]
    public int? SectionId123 { get; set; }
    public string? SectionName { get; set; }
}