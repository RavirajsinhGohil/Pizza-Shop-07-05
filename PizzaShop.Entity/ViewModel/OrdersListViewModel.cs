namespace PizzaShop.Entity.ViewModel;

public class OrdersListViewModel
{
    public List<OrdersViewModel> orders { get; set; } = new List<OrdersViewModel>();
    public int CurrentPage { get; set; }
    public int totalItems { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public string? SortBy { get; set; } 
    public string? SortOrder { get; set; }
    public int FromRec => (CurrentPage - 1) * PageSize + 1;
    public int ToRec { get; set; }
}
