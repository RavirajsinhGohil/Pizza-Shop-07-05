using PizzaShop.Entity.ViewModel;

namespace PizzaShop.Service.Interfaces;

public interface IOrderAppService
{
    #region KOT Module

    Task<List<KOTOrderCardViewModel>> GetOrderDetailByCategoryId(int categoryId, bool inProgress);
    Task<bool> MarkOrderAsReady(int orderId, List<OrderDetailItem> orderDetailsIds);
    Task<bool> MarkOrderAsInProgress(int orderId, List<OrderDetailItem> orderDetailsIds);

    #endregion

    #region Table Module

    Task<OrderAppTableModuleViewModel> GetTabelModuleData();
    Task<bool> AddWaitingToken(AddWaitingTokenForTableViewModel model);
    Task<List<WaitingCustomerViewModel>> GetWaitingCustomers(int sectionId);
    Task<bool> AssignCustomerToTableAsync(AssignTableViewModel model);

    #endregion

    #region Waiting List

    Task<WaitingListViewModel> GetWaitingListSections();
    Task<List<WaitingTokenViewModel>> GetWaitingTokensBySectionId(int sectionId);
    Task<AddWaitingTokenForTableViewModel> GetWaitingTokenById(int tokenId);
    Task<bool> UpdateWaitingToken(AddWaitingTokenForTableViewModel model);
    Task<bool> DeleteWaitingToken(int tokenId);
    
    #endregion

    #region Menu

    Task<CategoryItemsForOrderMenuViewModel> GetCategoryItemsForOrderMenu(string? searchText, int categoryId, int? orderId);
    void ToggleFavorite(int itemId);
    Task<ModifierSelectionModalViewModel?> GetModifiersGroupedByItemAsync(int itemId);
    Task<OrderItemForRowViewModel?> RenderOrderItemRow(RenderOrderItemRowRequest request);
    Task<OrderCustomerViewModel?> GetOrderCustomerAsync(int orderId);
    Task<bool> UpdateCustomerAsync(UpdateCustomerViewModel model);
    Task<string?> GetAdminCommentAsync(int id);
    Task<bool> SaveAdminCommentAsync(int orderDetailId, string adminComment);
    Task<string?> GetItemInstructionAsync(int orderId, int itemId);
    Task<bool> SaveItemInstructionAsync(int orderId, int itemId, string instruction);
    Task<List<SaveOrderDetailViewModel>?> SaveOrderItemsAsync(SaveOrderRequestViewModel model);
    Task<List<SaveOrderDetailViewModel>?> GetOrderDetailsById(int orderId);

    #endregion
}
