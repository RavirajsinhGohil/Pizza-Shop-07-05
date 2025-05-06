namespace PizzaShop.Entity.ViewModel;

public class CustomerPaginationViewModel
{
    public string SearchTerm { get; set; } = "";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 2;
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public string? SortBy { get; set; } = "CustomerId";
    public string? SortOrder { get; set; } = "asc";
    public string? TimeLog { get; set; } ="All Time";
    public DateTime? CustomDate { get; set; }

}
