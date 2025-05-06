using Microsoft.EntityFrameworkCore;
using PizzaShop.Entity.Data;
using PizzaShop.Repository.Interfaces;
using PizzaShop.Entity.ViewModel;

namespace PizzaShop.Repository.Implementations;

public class CustomerRepository : ICustomerRepository
{
    private readonly ApplicationDbContext _dbo;
    public CustomerRepository(ApplicationDbContext dbo)
    {
        _dbo = dbo;
    }
    public async Task<List<CustomerViewModel>> GetCustomersListModel()
    {
        return await _dbo.Customers
            .Where(c => !c.Isdeleted)
            .OrderBy(c => c.Customerid)
            .Select(c => new CustomerViewModel
            {
                Customerid = c.Customerid,
                Firstname = c.Firstname,
                Lastname = c.Lastname,
                Email = c.Email,
                Phone = c.Phone,
                CreatedAt = c.Createdat,
                TotalOrders = _dbo.Orders.Count(o => o.Customerid == c.Customerid)
            })
            .ToListAsync();
    }

    public async Task<CustomersListViewModel> GetCutomerByPaginationAsync(CustomerPaginationViewModel model)
    {
        var query = _dbo.Customers.Include(c => c.Orders).AsQueryable();
        // var query = _dbo.Orders.Include(o => o.Customer).Include(o => o.Payments).AsQueryable();

        if (model.SearchTerm != null)
        {
            query = query.Where(customer => customer.Firstname.ToLower().Contains(model.SearchTerm.ToLower()));
        }

        // Apply Sorting using switch case
        query = model.SortBy switch
        {
            "Name" => model.SortOrder == "asc"
                ? query.OrderBy(c => c.Customerid)
                : query.OrderByDescending(u => u.Firstname),

            "Date" => model.SortOrder == "asc"
                ? query.OrderBy(u => u.Createdat)
                : query.OrderByDescending(u => u.Createdat),

            "Total Order" => model.SortOrder == "asc"
                ? query.OrderBy(u => u.Firstname)
                : query.OrderByDescending(u => u.Firstname),

            _ => query.OrderBy(u => u.Customerid)
        };

        if (model.TimeLog != null && model.TimeLog != "All Time")
        {
            DateTime now = DateTime.Now;
            DateTime startDate = now;
            switch (model.TimeLog)
            {

                case "Last 7 days":
                    startDate = now.AddDays(-7);
                    break;
                case "Last 30 days":
                    startDate = now.AddDays(-30);
                    break;
                case "Current Month":
                    startDate = new DateTime(now.Year, now.Month, 1);
                    break;
                    // case "Custom Date":
                    //     startDate = 
            }
            query = query.Where(o => o.Createdat >= startDate);
        }

        // Apply custom date filter
        // if (!string.IsNullOrEmpty(fromDate) && DateTime.TryParse(fromDate, out DateTime from))
        // {
        //     query = query.Where(o => o.Createdat >= from);
        // }

        // if (!string.IsNullOrEmpty(toDate) && DateTime.TryParse(toDate, out DateTime to))
        // {
        //     query = query.Where(o => o.Createdat <= to);
        // }

        int totalItems = await query.CountAsync();
        int totalPages = (int)Math.Ceiling(totalItems / (double)model.PageSize);

        List<CustomerViewModel>? paginatedItems = await query
            .Skip((model.Page - 1) * model.PageSize)
            .Take(model.PageSize)
            .Select(customer => new CustomerViewModel
            {
                Customerid = customer.Customerid,
                Firstname = customer.Firstname,
                Lastname = customer.Lastname,
                Email = customer.Email,
                Phone = customer.Phone,
                CreatedAt = customer.Createdat,
                TotalOrders = _dbo.Orders.Count(o => o.Customerid == customer.Customerid)
            })
            .ToListAsync();
        var pagination = new CustomerPaginationViewModel
        {
            // SearchTerm = model.SearchTerm,
            Page = model.Page,
            PageSize = model.PageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            SortBy = model.SortBy,
            SortOrder = model.SortOrder,
            TimeLog = model.TimeLog,
            CustomDate = model.CustomDate
        };

        return new CustomersListViewModel
        {
            Customers = paginatedItems,
            Pagination = pagination
            // CurrentPage = model.Page,
            // totalItems = totalItems,
            // TotalPages = totalPages,
            // PageSize = model.PageSize
        };
    }

    public async Task<CustomersListViewModel> GetCustomersForExport(CustomerPaginationViewModel model)
    {
        var query = _dbo.Customers.Include(c => c.Orders).AsQueryable();
        // var query = _dbo.Orders.Include(o => o.Customer).Include(o => o.Payments).AsQueryable();

        if (!string.IsNullOrEmpty(model.SearchTerm))
        {
            query = query.Where(customer => customer.Firstname.ToLower().Contains(model.SearchTerm.ToLower()));
        }

        // Apply Sorting using switch case
        query = model.SortBy switch
        {
            "Name" => model.SortOrder == "asc"
                ? query.OrderBy(c => c.Customerid)
                : query.OrderByDescending(u => u.Firstname),

            "Date" => model.SortOrder == "asc"
                ? query.OrderBy(u => u.Createdat)
                : query.OrderByDescending(u => u.Createdat),

            "Total Order" => model.SortOrder == "asc"
                ? query.OrderBy(u => u.Firstname)
                : query.OrderByDescending(u => u.Firstname),

            _ => query.OrderBy(u => u.Customerid)
        };

        if (model.TimeLog != null && model.TimeLog != "All Time")
        {
            DateTime now = DateTime.Now;
            DateTime startDate = now;
            switch (model.TimeLog)
            {

                case "Last 7 days":
                    startDate = now.AddDays(-7);
                    break;
                case "Last 30 days":
                    startDate = now.AddDays(-30);
                    break;
                case "Current Month":
                    startDate = new DateTime(now.Year, now.Month, 1);
                    break;
                    // case "Custom Date":
                    //     startDate = 
            }
            query = query.Where(o => o.Createdat >= startDate);
        }

        // Apply custom date filter
        // if (!string.IsNullOrEmpty(fromDate) && DateTime.TryParse(fromDate, out DateTime from))
        // {
        //     query = query.Where(o => o.Createdat >= from);
        // }

        // if (!string.IsNullOrEmpty(toDate) && DateTime.TryParse(toDate, out DateTime to))
        // {
        //     query = query.Where(o => o.Createdat <= to);
        // }

        int totalItems = await query.CountAsync();
        int totalPages = (int)Math.Ceiling(totalItems / (double)model.PageSize);

        var paginatedItems = await query
            .Skip((model.Page - 1) * model.PageSize)
            .Take(model.PageSize)
            .Select(customer => new CustomerViewModel
            {
                Customerid = customer.Customerid,
                Firstname = customer.Firstname,
                Lastname = customer.Lastname,
                Email = customer.Email,
                Phone = customer.Phone,
                CreatedAt = customer.Createdat,
                TotalOrders = _dbo.Orders.Count(o => o.Customerid == customer.Customerid)
            })
            .ToListAsync();
        var pagination = new CustomerPaginationViewModel
        {
            // SearchTerm = model.SearchTerm,
            Page = model.Page,
            PageSize = model.PageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            SortBy = model.SortBy,
            SortOrder = model.SortOrder,
            TimeLog = model.TimeLog,
            CustomDate = model.CustomDate
        };

        return new CustomersListViewModel
        {
            Customers = paginatedItems
        };
    }

    public async Task<CustomerViewModel> GetCustomerHistoryByCustomerId(int customerId)
    {
        IQueryable<Entity.Models.Order>? orders = _dbo.Orders.Include(od => od.Orderdetails).Where(c => c.Customerid == customerId);
        List<OrdersViewModel> customerOrders = new();
        foreach (var order in orders)
        {
            OrdersViewModel customerOrder = new()
            {
                Orderid = order.Orderid,
                Createdat = order.Createdat,
                OrderType = "",
                Status = order.Status,
                ItemsCount = order.Orderdetails.Count,
                TotalAmount = order.Totalamount
            };
            customerOrders.Add(customerOrder);
        }

        return await _dbo.Customers
                        .Where(c => c.Customerid == customerId)
                        .Select(customer => new CustomerViewModel
                        {
                            Customerid = customer.Customerid,
                            Firstname = customer.Firstname,
                            Lastname = customer.Lastname,
                            Email = customer.Email,
                            Phone = customer.Phone,
                            CreatedAt = customer.Createdat,
                            TotalOrders = _dbo.Orders.Count(o => o.Customerid == customer.Customerid),
                            MaxOrder = _dbo.Orders.Where(o => o.Customerid == customer.Customerid).Max(o => o.Totalamount),
                            AverageBill = _dbo.Orders.Where(o => o.Customerid == customer.Customerid).Average(o => o.Totalamount),
                            ComingSince = _dbo.Orders.Where(o => o.Customerid == customer.Customerid).Min(o => o.Createdat),
                            Visits = _dbo.Orders.Count(o => o.Customerid == customer.Customerid),
                            CustomerOrders = customerOrders
                        }).FirstAsync();
    }
}
