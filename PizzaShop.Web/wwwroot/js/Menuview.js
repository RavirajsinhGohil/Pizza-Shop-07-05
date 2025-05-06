// For toggle the side tabs of menu categories and modifier groups in small screen
function toggleTabs() {
    var sideTabs = document.querySelectorAll(".side-tab");
    sideTabs.forEach(function (tab) {
        if (tab.style.display === "none" || tab.style.display === "") {
            tab.style.display = "block";
        } else {
            tab.style.display = "none";
        }
    });
}

var selectedModifiers = new Map();
var selectedModifiersForAdd = new Map();
var existingModifiers = [];
var existingModifiersForAdd = [];
var jsonString = [];
var jsonStringForAdd = [];


//For open Add Modifier Item Modal
$(document).on("click", "#addmodifier", function () {
    var MyModal = new bootstrap.Modal(document.getElementById('addModifierModal'));
    MyModal.show();
});

//modifiers
$(document).ready(function () {
    let currentPage = parseInt("@Model.CurrentPage") || 1;
    let currentPageModifiers = 1;
    let pageSize = parseInt("@Model.PageSize") || 5;
    let pageSizeModifiers = parseInt("@Model.PageSizeModifiers") || 5;
    let modifierGroupId = $('#mod-cat-id').val();
    let totalItems = $('#totalItemssss').val();
    let totalPages = $('#totalPagessss').val();
    let totalItemsModifiers = $('#TotalItemsModifiersss').val();
    let totalPagesModifiers = $('#TotalPagesModifiersss').val();
    let searchTerm = '';
    let searchTermModifiers = '';
    let isLoading = false;
    let searchTimeout;
    let categoryId = $('#catgory-id').val();

    if ($("#pills-item-tab").hasClass('active')) {
        $("#pills-modifires-tab").removeClass("tab-active");
        $("#pills-item-tab").addClass("tab-active");
    }

    $(".nav-link").on('click', function () {
        if ($("#pills-item-tab").hasClass('active')) {
            $("#pills-modifires-tab").removeClass("tab-active");
            $("#pills-item-tab").addClass("tab-active");
        }

        if ($("#pills-modifires-tab").hasClass('active')) {
            $("#pills-item-tab").removeClass("tab-active");
            $("#pills-modifires-tab").addClass("tab-active");
        }
    });



    function fetchItems(search = "", page = 1, pageSizeValue = 5) {
        if (isLoading) return;
        isLoading = true;

        $.ajax({
            url: 'Menu/GetItemsByCategory',
            type: 'GET',
            data: {
                categoryid: categoryId,
                searchTerm: search,
                page: page,
                pageSize: pageSizeValue
            },
            success: function (data) {
                $("#ItemListContainer").html(data);
                let $data = $(data);
                totalPages = parseInt($('#totalPageess').val()) || 1;
                totalItems = parseInt($('#totalItems').val());

                //  Update UI with new data
                $("#ItemListContainer").html(data);

                //  Update current page & page size
                currentPage = page;
                pageSize = pageSizeValue;

                updatePaginationButtons();
                // $(".cat").first().trigger("click");
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            },
            complete: function () {
                isLoading = false;
            }
        });
    }


    function fetchModifiers(search = "", page = 1, pageSizeValue = 5) {
        $.ajax({
            url: 'Menu/GetModifierItemsByModifierGroup',
            type: 'GET',
            data: {
                categoryid: modifierGroupId,
                searchTerm: search,
                page: page,
                pageSize: pageSizeValue
            },
            success: function (data) {
                $("#ModifiersListContainer").html(data);
                let $data = $(data);
                totalPagesModifiers = parseInt($('#TotalPagesModifiers').val()) || 1;
                totalItemsModifiers = parseInt($('#TotalItemsModifiers').val());

                //  Update UI with new data
                $("#ModifiersListContainer").html(data);

                //  Update current page & page size
                currentPageModifiers = page;
                pageSizeModifiers = pageSizeValue;

                updatePaginationButtons();
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            },
            complete: function () {
                isLoading = false;
            }
        });
    }

    function updatePaginationButtons() {
        // @* $('#prevPage').prop('disabled', currentPage <= 1);
        // $('#nextPage').prop('disabled', currentPage >= totalPages); *@
        // @* $('#currentPageDisplay').text(`Showing 1- ${pageSize} of ${totalItems}`); *@
    }

    //  Handle Previous Page Click
    $(document).on('click', '#prevPage', function () {
        fetchItems(searchTerm, currentPage - 1, pageSize);
    });

    $(document).on('click', '#nextPage', function () {
        fetchItems(searchTerm, currentPage + 1, pageSize);
    });

    $(document).on('change', '#pageSizes', function () {
        pageSize = parseInt($(this).val()) || 5;
        fetchItems(searchTerm, 1, pageSize);
    });

    //  Debounced Search Functionality
    $(document).on('keyup', '#searchBox', function () {
        clearTimeout(searchTimeout);
        searchTerm = $(this).val();

        searchTimeout = setTimeout(() => {
            fetchItems(searchTerm, 1, pageSize);
        }, 100);
    });

    $("#deleteAll").on("click", function (e) {
        var selectedItems = document.querySelectorAll(".ItemsCheck:checked");
        if (selectedItems.length === 0) {
            e.preventDefault();
            toastr.warning("Please select item(s) to delete.", "Warning");
        }
        else {
            var MyModal = new bootstrap.Modal(document.getElementById('bulkDeleteModal'));
            MyModal.show();
        }
    });

    $("#deleteAllModifiers").on("click", function (e) {
        var selectedItems = document.querySelectorAll(".ModifiersCheck:checked");
        if (selectedItems.length === 0) {
            e.preventDefault();
            toastr.warning("Please select modifier(s) to delete.", "Warning");
        }
        else {
            var MyModal = new bootstrap.Modal(document.getElementById('bulkDeleteModifiersModal'));
            MyModal.show();
        }
    });
    // document.addEventListener("DOMContentLoaded", function () {
    //     const massDeleteButton = document.querySelector(".deleteAll"); // Adjust selector if needed
    //     const checkboxes = document.querySelectorAll(".item-checkbox"); // Replace with your checkbox class or selector

    //     massDeleteButton.addEventListener("click", function (event) {
    //         const selectedItems = Array.from(checkboxes).some(checkbox => checkbox.checked);

    //         if (!selectedItems) {
    //             event.preventDefault(); // Prevent modal from opening
    //             toastr.warning("Please select at least one item to delete.", "Warning");
    //         }
    //     });
    // });

    //  Handle Previous Page Click
    $(document).on('click', '#prevPageModifiers', function () {
        fetchModifiers(searchTermModifiers, currentPageModifiers - 1, pageSizeModifiers);
    });

    $(document).on('click', '#nextPageModifiers', function () {
        fetchModifiers(searchTermModifiers, currentPageModifiers + 1, pageSizeModifiers);
    });

    $(document).on('change', '#pageSizesModifiers', function () {
        pageSizeModifiers = parseInt($(this).val()) || 5;
        fetchModifiers(searchTermModifiers, 1, pageSizeModifiers);
    });

    //  Debounced Search Functionality
    $(document).on('keyup', '#searchBoxModifiers', function () {
        clearTimeout(searchTimeout);
        searchTermModifiers = $(this).val();

        searchTimeout = setTimeout(() => {
            fetchModifiers(searchTermModifiers, 1, pageSizeModifiers);
        }, 100);
    });

    //  Handle Category Selection
    $(document).on('click', '.cat', function (e) {
        e.preventDefault();

        let newCategoryId = $(this).data('category-id');

        $('.cat').each(function () {
            $(this).removeClass('custom-blue-color');
        });
        $(this).removeClass('text-secondary');
        $(this).addClass("custom-blue-color");

        console.log("Category Clicked! New Category ID:", newCategoryId);

        if (!newCategoryId) {
            console.error("Category ID is undefined!");
            return;
        }

        categoryId = newCategoryId;
        fetchItems(searchTerm, 1, pageSize);
    });

    //  Handle Modifier Group Selection
    $(document).on('click', '.mod', function (e) {
        e.preventDefault();

        $('.mod').each(function () {
            $(this).removeClass('custom-blue-color');
        });
        $(this).addClass("custom-blue-color");

        let newCategoryId = $(this).data('modifiergroup-id');
        console.log("Modifier Group Clicked! New Category ID:", newCategoryId);

        if (!newCategoryId) {
            console.error("Category ID is undefined!");
            return;
        }

        modifierGroupId = newCategoryId;
        fetchModifiers(searchTermModifiers, 1, pageSizeModifiers);
    });

    //  Initial Load
    fetchItems(searchTerm, 1, pageSize);
    fetchModifiers(searchTermModifiers, 1, pageSizeModifiers);

});

$('body').on('click', '.editCategoryBtn', function (e) {
    e.preventDefault();
    var itemId = $(this).data('id');
    $.ajax({
        url: 'Menu/EditCategory',
        type: 'GET',
        data: { id: itemId },
        success: function (response) {
            console.log("data :", response.data);
            var data = response.data;

            $("#editCategoryId").val(data.menucategoryid);
            $("#editCategoryName").val(data.categoryname);
            $("#editCategoryDescription").val(data.description);

        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
            // @* alert('There was an error loading the item data.'); *@
        }
    });
});

$(document).on('submit', '#editCategoryForm', function (e) {
    e.preventDefault();

    if (!$(this).valid()) {
        console.log('Form is invalid');
        return;
    }

    var editCategoryData = {
        Categoryid: $("#editCategoryId").val(),
        Name: $("#editCategoryName").val(),
        Description: $("#editCategoryDescription").val(),
    };

    $.ajax({
        url: 'Menu/EditCategory',
        type: 'POST',
        data: JSON.stringify(editCategoryData),
        contentType: 'application/json',
        success: function (response) {
            if (response.success) {
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                toastr.success(response.message);
                location.reload();
            } else {
                toastr.success(response.message);
                location.reload();
            }
        },
        error: function (xhr, status, error) {
            // console.error(error);
            // console.error(xhr.responseText);
            alert('An error occurred while updating the category.');
        }
    });
});

$(document).off("change", ".rowModifierCheck"); // For remove event listners from previous edit modifierGroup
$(document).on("change", ".rowModifierCheck", function () {
    let modifierId = $(this).data('id');
    let modifierName = $(this).data('name');

    if ($(this).is(":checked")) {
        selectedModifiers.set(modifierId, modifierName);
        console.log("selectedModifiers 7567:", selectedModifiers);
        jsonString.push(modifierId);
    } else {
        selectedModifiers.delete(modifierId);
        jsonString = jsonString.filter(id => id !== modifierId);
    }
});

$(document).on('click', "#saveAddExistingModifiers", function () {
    $('#addExistingModifiersModal').modal('hide');
    $('#editModifierGroup').modal('show');
    $("#addExistingModal").modal("hide");
    console.log('selectedeads', selectedModifiers);
    console.log('existingsdlkasdspodmasd', existingModifiers);

    $('#existingModifiersContainer').empty();

    // Append new modifiers
    selectedModifiers.forEach(function (modifierName, modifierId) {
        $('#existingModifiersContainer').append(
            `<div class="d-flex align-items-center bg-info rounded-pill mt-2 me-2">
                <div class="d-flex m-2 existingModifier">${modifierName}</div>
                <button type="button" class="btn-close removeModifierBtn" data-id="${modifierId}" aria-label="Close"></button>
            </div>`
        );
    });
});



$(document).on('click', '#editModifierGroupBtn', function (e) {
    e.preventDefault();
    var ModifierGroupId = $(this).data('id');
    existingModifiers = [];
    selectedModifiers.clear();
    // var url = `/Orders/ExportOrders?status=${encodeURIComponent(status)}&date=${encodeURIComponent(date)}&searchText=${encodeURIComponent(searchText)}`;
    // '@Url.Action("EditModifierGroup", "Menu")' + '?id=' + encodeURIComponent(ModifierGroupId)
    $.ajax({
        url: 'Menu/EditModifierGroup',
        type: 'GET',
        data: { id: ModifierGroupId },
        success: function (response) {
            if (response.success) {
                $('#ModifierGroupId').val(response.data.modifierGroupId);
                $('#modifierGroupName').val(response.data.modifierGroupName);
                $('#modifierGroupDescription').val(response.data.modifierGroupDescription);
                $('#existingModifiersContainer').empty();
                response.data.existingModifiers.forEach(checkBox => {
                    existingModifiers.push(checkBox.modifierId);
                    selectedModifiers.set(checkBox.modifierId, checkBox.name);
                    console.log("")
                    // jsonString.push(checkBox.modifierId);
                });

                // Append new modifiers
                selectedModifiers.forEach(function (modifierName, modifierId) {
                    $('#existingModifiersContainer').append(
                        `<div class="d-flex align-items-center bg-info rounded-pill mt-2 me-2">
                        <div class="d-flex m-2 existingModifier">${modifierName}</div>
                        <button type="button" class="btn-close removeModifierBtn" data-id="${modifierId}" aria-label="Close"></button>
                    </div>`
                    );
                });
                $(document).on('click', '.removeModifierBtn', function (e) {
                    e.preventDefault();

                    let unCheckModifierId = $(this).data('id');
                    selectedModifiers.delete(unCheckModifierId);

                    console.log("*** Clicked! New Category ID:", amvadsokasdd);

                });

                //For adding the selected Modifiers in Edit Modifier Group
                // $("#editModifierGroupForm").on('submit', function() {





                // });

                $("#editModifierGroupForm").validate({
                    rules: {
                        modifierGroupName: {
                            required: true,
                            // minlength: 3
                        }
                    },
                    messages: {
                        modifierGroupName: {
                            required: "Please enter Modifier Group name",
                            // minlength: "Name must be at least 3 characters long"
                        },
                        errorPlacement: function (error, element) {
                            // Place error message outside the floating wrapper
                            if (element.parent().hasClass("form-floating")) {
                                error.insertAfter(element.parent());
                            } else {
                                error.insertAfter(element);
                            }
                        },
                        highlight: function (element) {
                            $(element).addClass("is-invalid");
                        },
                        unhighlight: function (element) {
                            $(element).removeClass("is-invalid");
                        }
                    },
                    submitHandler: function (form) {

                        console.log("Add Button");
                        console.log("5487564454", selectedModifiers);
                        // @* let modifierGroupId = response.data.modifierGroupId; *@
                        let modifierGroupName = $("#modifierGroupName").val();
                        let modifierGroupDescription = $("#modifierGroupDescription").val();
                        jsonString = JSON.stringify(jsonString);
                        console.log("stringify data", jsonString);
                        var formData = jsonString

                        $.ajax({
                            url: `AddSelectedModifiers?modifierGroupId=${encodeURIComponent(response.data.modifierGroupId)}&name=${modifierGroupName}&description=${modifierGroupDescription}`,
                            // @* url: '@Url.Action("AddSelectedModifiers")' + '?modifierGroupId=' + encodeURIComponent(response.data.modifierGroupId), *@
                            type: 'POST',
                            data: formData,
                            contentType: 'application/json',
                            success: function () {
                                console.log("Siccess");
                                $('#editModifierGroup').modal('hide');
                                toastr.success(response.message);
                            },
                            error: function () {
                                $('#editModifierGroup').modal('hide');
                                console.log("error");
                            }
                        });
                    }
                });
            }
            else {
                alert(response.message);
            }
        },
        error: function (xhr, status, error) {
            alert('An error occurred while edit the modifiergroup.');
        }
    });
});

// @* $('#addExistingModifiersModal').modal('hide'); *@
$(document).on('click', '#addExistingModifiersBtn', function () {
    addExistingModifiers(selectedModifiers);
});

function addExistingModifiers(selectedModifiers) {
    $('#editModifierGroup').modal('hide'); // Close Edit Modifier Group Modal
    $("#addExistingModifiersForm").trigger('reset');
    $('#addExistingModifiersModal').modal('show'); // Open Add Existing Modifiers Modal

    //For checking the checkboxes for row of the addExistingModifiers
    var rowModifierGroupCheckBoxes = document.querySelectorAll('.rowModifierCheck');
    console.log("rowModifierCheck", rowModifierGroupCheckBoxes);

    document.querySelectorAll("rowModifierCheck").forEach(checkBox => {
        checkBox.checked = false;
        console.log("Checkbox unchecked");
    });

    // For check all existing Modifiers
    selectedModifiers.forEach(function (modifierName, modifierId) {
        if (existingModifiers.includes(modifierId)) {
            document.querySelector(`.rowModifierCheck[data-id="${modifierId}"]`).checked = true;
        }
    });
}

// Trigger the AJAX call when the edit link is clicked
$('body').on('click', '.edit-icon-modifier', function (e) {
    e.preventDefault();
    var itemId = $(this).data('id');
    console.log(itemId);
    $.ajax({
        url: 'Menu/EditModifier',
        type: 'GET',
        data: { id: itemId },
        success: function (response) {
            $('#EditModifierModal').modal('show');
            $('#EditModifierModal').html(response);
        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
            alert('There was an error loading the item data.');
        }
    });
});

//Post method for EditModifierForm
$(document).on("submit", "#EditModifierForm", function (e) {
    e.preventDefault();

    var formData = $(this).serialize();
    var actionUrl = $(this).attr("action");

    $.ajax({
        url: 'Menu/EditModifier',
        type: "POST",
        data: formData,
        success: function (response) {
            if (response.success) {
                $("#EditModifierModal").modal("hide");
                $(".modal-backdrop").remove();
                $("body").removeClass("modal-open");
                toastr.success(response.message);
                location.reload();
            }
        },
        error: function (xhr, status, error) {
            console.log("Error:", xhr.responseText);
            alert("Error updating modifier.");
        }
    });
});

var modifiersGroups = [];

$(document).on('change', '.modifier-checkbox', function () {
    var modifierGroupId = $(this).data('id');

    // Ensure modifiersGroups is an array
    if (!Array.isArray(modifiersGroups)) {
        console.warn("Fixing corrupted modifiersGroups variable.");
        modifiersGroups = [];
    }

    if ($(this).is(':checked')) {
        // Add if not already present
        if (!modifiersGroups.includes(modifierGroupId)) {
            modifiersGroups.push(modifierGroupId);
        }
    } else {
        // Remove if unchecked
        modifiersGroups = modifiersGroups.filter(id => id !== modifierGroupId);
    }

    console.log("Updated modifiersGroups:", modifiersGroups);
});

var selectedMenuItems = [];
//For Adding Items to the array for Mass Delete
$(document).on('change', "#ItemMainCheck", function (e) {
    console.log("Checked main checkbox");
    selectedMenuItems = [];
    let chechBoxes = document.querySelectorAll(".ItemsCheck");
    chechBoxes.forEach((checkBox) => {
        checkBox.checked = e.target.checked;
        let itemId123 = $(checkBox).data('id');
        // @* selectedMenuItems.push(itemId123); *@

        if ($(this).is(':checked')) {
            // Add if not already present
            if (!selectedMenuItems.includes(itemId123)) {
                selectedMenuItems.push(itemId123);
            }
        }
        else {
            // Remove if unchecked
            selectedMenuItems = selectedMenuItems.filter(id => id !== itemId123);
        }
    });
    console.log("125478", selectedMenuItems);
});

//For adding particular items to the array for delete
$(document).on('change', '.ItemsCheck', function () {
    var itemId = $(this).data('id');

    // Ensure modifiersGroups is an array
    if (!Array.isArray(selectedMenuItems)) {
        console.warn("Fixing corrupted modifiersGroups variable.");
        selectedMenuItems = [];
    }

    if ($(this).is(':checked')) {
        // Add if not already present
        if (!selectedMenuItems.includes(itemId)) {
            selectedMenuItems.push(itemId);
        }
    }
    else {
        // Remove if unchecked
        selectedMenuItems = selectedMenuItems.filter(id => id !== itemId);
    }

    console.log("Selected Items:", selectedMenuItems);
});

$(document).on('click', "#confirmBulkDeleteBtn", function () {
    selectedMenuItems.forEach((item) => {
        $.ajax({
            url: 'Menu/DeleteMenuItem',
            type: 'GET',
            data: { itemId: item },
            success: function () {
                console.log("Siccess");
                location.reload();
            },
            error: function () {
                console.log("error")
            }
        });
    });
});

var selectedModifierItems = [];
//For Adding Modifiers to the array for Mass Delete 
$(document).on('change', "#ModifierMainCheck", function (e) {
    console.log("Checked main checkbox");
    selectedModifierItems = [];
    let chechBoxes = document.querySelectorAll(".ModifiersCheck");
    chechBoxes.forEach((checkBox) => {
        checkBox.checked = e.target.checked;
        let modifierId123 = $(checkBox).data('id');
        // @* selectedMenuItems.push(itemId123); *@

        if ($(this).is(':checked')) {
            // Add if not already present
            if (!selectedModifierItems.includes(modifierId123)) {
                selectedModifierItems.push(modifierId123);
            }
        }
        else {
            // Remove if unchecked
            selectedModifierItems = selectedModifierItems.filter(id => id !== modifierId123);
        }
    });
    console.log("987456", selectedModifierItems);
});

//For adding particular modifiers to the array for delete
$(document).on('change', '.ModifiersCheck', function () {
    let modifierId = $(this).data('id');

    // Ensure modifiersGroups is an array
    if (!Array.isArray(selectedModifierItems)) {
        console.warn("Fixing corrupted modifiersGroups variable.");
        selectedModifierItems = [];
    }

    if ($(this).is(':checked')) {
        // Add if not already present
        if (!selectedModifierItems.includes(modifierId)) {
            selectedModifierItems.push(modifierId);
        }
    }
    else {
        // Remove if unchecked
        selectedModifierItems = selectedModifierItems.filter(id => id !== modifierId);
    }

    console.log("Selected Modifiers:", selectedModifierItems);
});

$(document).on('click', "#confirmBulkDeleteModifiersBtn", function () {
    selectedModifierItems.forEach((item) => {
        $.ajax({
            url: 'Menu/DeleteMenuItem',
            type: 'GET',
            data: { itemId: item },
            success: function () {
                console.log("Siccess");
                location.reload();
            },
            error: function () {
                console.log("error");
            }
        });
    });
});

// @* ************* *@

var allModifierIds = [];

$('.modifiersIdsForAdd').each(function () {
    var modifierId = $(this).data('id');
    if (modifierId !== undefined) {
        allModifierIds.push(modifierId);
    }
});

console.log("allModifierIds :", allModifierIds);

allModifierIds.forEach(function (modifierId) {
    $(document).off("change", `.rowModifierCheckForAdd_${modifierId}`); // For remove event listners from previous edit modifierGroup
    $(document).on("change", `.rowModifierCheckForAdd_${modifierId}`, function () {
        let modifierId = $(this).data('id');
        let modifierName = $(this).data('name');

        if ($(this).is(":checked")) {
            selectedModifiersForAdd.set(modifierId, modifierName);
            console.log("selectedModifiersForAdd 7567:", selectedModifiersForAdd);
            jsonStringForAdd.push(modifierId);
            existingModifiersForAdd.push(modifierId);
            console.log("existingModifiersForAdd", existingModifiersForAdd);
        } 
        else {
            debugger;
            selectedModifiersForAdd.delete(modifierId);
            console.log("selectedModifiersForAdd 7567 1234:", selectedModifiersForAdd);         
            jsonStringForAdd = jsonStringForAdd.filter(id => id !== modifierId);         
            existingModifiersForAdd = existingModifiersForAdd.filter(id => id !== modifierId);
            console.log("existingModifiersForAdd 1234", existingModifiersForAdd);
        }
    });
});

//For open modal on add existing modifiers in add modifier group modal
$(document).on('click', "#addModifiersInGroup", function () {
    $('#addModifierGroupModal').modal('hide');
    $("#addExistingModifiersForm").trigger('reset');
    $('#addExistingModal').modal('show');

    //For checking the checkboxes for row of the addExistingModifiers
    var rowModifierGroupCheckBoxes = document.querySelectorAll('.rowModifierCheckForAdd');
    console.log("rowModifierCheckForAdd", rowModifierGroupCheckBoxes);

    //Not useful while using $("#addExistingModifiersForm").trigger('reset');
    document.querySelectorAll("rowModifierCheckForAdd").forEach(checkBox => {
        checkBox.checked = false;
        console.log("Checkbox unchecked");
    });

    // For check all existing Modifiers
    selectedModifiersForAdd.forEach(function (modifierName, modifierId) {
        if (existingModifiersForAdd.includes(modifierId)) {
            if(modifierId !== undefined) {
                document.querySelector(`.modifiersIdsForAdd[data-id="${modifierId}"]`).checked = true;
            }
        }
    });
});

//On save modal of addExisting Modifiers in Add Modifier Group
$(document).on('click', "#saveAddExistingModifiersForAdd", function () {
    $('#addExistingModal').modal('hide');
    $('#addModifierGroupModal').modal('show');
    console.log('selectedeads', selectedModifiersForAdd);

    $('#existingModifiersContainerForAdd').empty();

    // Append new modifiers For Add
    selectedModifiersForAdd.forEach(function (modifierName, modifierId) {
        $('#existingModifiersContainerForAdd').append(
            `<div class="d-flex align-items-center modifierInAddModal_${modifierId} bg-info rounded-pill mt-2 me-2">
                <div class="d-flex m-2 existingModifier">${modifierName}</div>
                <button type="button" class="btn-close removeModifierBtn_${modifierId}" data-id="${modifierId}" aria-label="Close"></button>
            </div>`
        );
        $(document).on('click', `.removeModifierBtn_${modifierId}`, function (e) {
            e.preventDefault();
            let unCheckModifierId = $(this).data('id');
            selectedModifiersForAdd.delete(unCheckModifierId);
            existingModifiersForAdd = existingModifiersForAdd.filter(id => id !== unCheckModifierId);
            console.log("unCheckModifierId", unCheckModifierId);
            $(`.modifierInAddModal_${unCheckModifierId}`).remove();
        });
    });
});


var modifierGroupForAdd = [];
//For append Modifier Groups in New Item Modal
$(document).on('change', "#ModifierGroupsInNewItemSelect", function () {
    var modifierGroupId = $(this).val();
    modifierGroupForAdd.push(modifierGroupId);
    console.log("value: ", modifierGroupId);

    $.ajax({
        url: 'Menu/GetModifierGroupForNewItem',
        type: 'GET',
        data: { modifierGroupId: modifierGroupId },
        contentType: 'application/json',
        success: function (response) {
            if (response.success) {

                let modifiersHTML = response.data.existingModifiers.map(modifier => `
                <div class="modifier-item w-100 d-flex justify-content-between">
                    <div>
                        ${modifier.name}
                    </div>
                    <div class="me-2">
                        ${modifier.rate}
                    </div>
                </div>
            `).join(""); // Convert array to string 

                console.log("Got modifier Group", response.data);
                $("#ModifierGroupsInNewItemModal").append(
                    `<div  class="mt-2 appendModifierGroupInNewItem_${response.data.modifierGroupId}">
                    <input type="hidden" name="ModifierGroupIds" value="${response.data.modifierGroupId}">
                    <div class="modifierHeading fw-bold d-flex justify-content-between">
                        ${response.data.modifierGroupName}
                        <button type="button"  data-id="${response.data.modifierGroupId}" class="btn bg-transparent deleteModifierGroupInNewModal_${response.data.modifierGroupId} border-none">
                            <img src="/images/Download/trash.svg" width="20px" alt="delete">
                        </button>
                    </div>
                    <div>
                        <div class="row">
                            <div class="col-6">
                                <select class="form-select rounded-pill modifierForNewItemSelectMin" data-id="${response.data.modifierGroupId}">
                                    <option value="" selected>0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <select class="form-select rounded-pill modifierForNewItemSelectMax" data-id="${response.data.modifierGroupId}">
                                    <option value="" selected>0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                        <div id="modifiersInNewItem">
                            ${modifiersHTML}
                        </div>
                    </div>
                </div>`
                );

                $(document).on('click', `.deleteModifierGroupInNewModal_${response.data.modifierGroupId}`, function () {
                    let modifierGroupId = $(this).data('id');
                    modifierGroupForAdd.filter(id => id !== modifierGroupId);
                    console.log("ksdamdsmda", modifierGroupId);
                    $(`.appendModifierGroupInNewItem_${modifierGroupId}`).remove();
                });
            } else {
                alert(response.message);
            }
        },
        error: function () {
            console.log("error");
        }
    });


    // @* console.log("ModifierGroupsInNewItemSelect changed", modifierGroupId); *@
});



// @* Validations *@

$("#addEditCategoryForm").submit(function (e) {
    e.preventDefault();

    if (!$(this).valid()) {
        console.log('Form is invalid');
        return;
    }

    console.log('Form is valid, submitting...');

    if ($(this).data("edit-mode") === true) {
        updateCategory();
    } else {
        addCategory();
    }
});

function addCategory() {
    let categoryData = {
        name: $("#addCategoryName").val(),
        description: $("#addCategoryDescription").val()
    };

    $.ajax({
        url: 'Menu/AddCategory',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(categoryData),
        success: function (response) {
            if (response.success) {
                toastr.success(response.message);
                $("#addCategoryModal").modal("hide");
                $("#addEditCategoryForm").trigger('reset');
                location.reload();
                // $("#categoryname, #categorydescription").val("");
            } else {
                toastr.error(response.message);
            }
        },
        error: function () {
            console.log("error");
        }
    });
}



$("#addMenuItemForm").submit(function (e) {
    e.preventDefault();

    if (!$(this).valid()) {
        console.log('Form is invalid');
        return;
    }

    console.log('Form is valid, submitting...');

    if ($(this).data("edit-mode") === true) {
        updateItem();
    } else {
        addItem();
    }
});

function addItem() {
    var customSwitch = $(".newItemAvailability").is(":checked");
    var modifierGroupDataArray = [];

    modifierGroupForAdd.forEach(function (modifierGroupId) {
        var min = parseInt($(`.modifierForNewItemSelectMin[data-id="${modifierGroupId}"]`).val()) || 0;
        var max = parseInt($(`.modifierForNewItemSelectMax[data-id="${modifierGroupId}"]`).val()) || 0;

        modifierGroupDataArray.push({
            Id: modifierGroupId,
            Min: min,
            Max: max
        });
    });

    let newItemData = {
        categoryId: $("#newItemCategoryId").val(),
        Name: $("#newItemName").val(),
        Itemtype: $("#newItemType option:selected").val(),
        Rate: $("#newItemRate").val(),
        Quantity: $("#newItemQuantity").val(),
        Unit: $("#newItemUnit").val(),
        Isavailable: customSwitch,
        Tax: $("#newItemTaxPercentage").val(),
        ItemShortCode: $("#newItemShortCode").val(),
        // uploadimage: $("#ItemType").val(),
        Description: $("#newItemDescription").val(),
        ModifierGroupData: modifierGroupDataArray
    };

    let ab = $("#addMenuItemForm").serialize();
    console.log("data :", ab);

    console.log("data newItemData:", newItemData);

    $.ajax({
        url: 'Menu/AddNewItem',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(newItemData),
        // data: ab, 

        success: function (response) {
            if (response.success) {
                $("#addMenuItemModal").modal("hide");
                toastr.success(response.message);
                $("#addMenuItemForm").trigger('reset');
                location.reload();

                // $("#categoryname, #categorydescription").val(""); 
            } else {
                toastr.error(response.message);
            }
        },
        error: function () {
            console.log("error");
        }
    });
}

$("#addModifierGroupForm").submit(function (e) {
    e.preventDefault();

    if (!$(this).valid()) {
        console.log('Form is invalid');
        return;
    }

    console.log('Form is valid, submitting...');

    if ($(this).data("edit-mode") === true) {
        updateModifierGroup();
    } else {
        addModifierGroup();
    }
});

function addModifierGroup() {
    let ab = $("#addModifierGroupForm").serialize();
    console.log("data addModifierGroupForm:", ab);


    console.log("Add Button");
    console.log("1456987", selectedModifiersForAdd);
    console.log("stringify data", jsonStringForAdd);
    var formData = JSON.stringify(jsonStringForAdd);

    let newModifierGroupData = {
        modifierGroupName: $("#newModifierGroupName").val(),
        modifierGroupDescription: $("#newModifierGroupDescription").val(),
        ModifiersIds: existingModifiersForAdd
    };

    var formData = new FormData();
    formData = JSON.stringify(newModifierGroupData);

    $.ajax({
        url: 'Menu/AddModifierGroup',
        type: 'POST',
        data: formData,
        contentType: 'application/json',
        success: function () {
            console.log("Success group added");
            $('#addModifierGroupModal').modal('hide');
            $("#addModifierGroupForm").trigger('reset');
            location.reload();
        },
        error: function () {
            $('#addModifierGroupModal').modal('hide');
            console.log("error");
        }
    });
}

var modifierGroupForEdit = [];
// Trigger the AJAX call when the edit link is clicked
$('body').on('click', '.edit-icon', function (e) {
    e.preventDefault();
    var itemId = $(this).data('id');
    $.ajax({
        url: 'Menu/GetMenuItemForEdit',
        type: 'GET',
        data: { id: itemId },
        success: function (response) {
            $("#EditItemModal").html(response);

            var ids = $("#editItemModifierGroupIdsForEdit").val() || [];
            var idList = [];
            if (ids.length !== 0) {
                idList = ids.split(',').map(ids => parseInt(ids));
                console.log("idList", idList);
                idList.forEach(function (modifierGroupId) {
                    modifierGroupForEdit.push(modifierGroupId);
                    $(`.deleteModifierGroupInEditModal_${modifierGroupId}`).on('click', function () {
                        let modifierGroupId = $(this).data('id');
                        modifierGroupForEdit = modifierGroupForEdit.filter(id => id !== modifierGroupId);
                        console.log("modifierGroupId", modifierGroupId);
                        $(`.appendModifierGroupInEditItem_${modifierGroupId}`).remove();
                    });
                });
            }
        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
            // @* alert('There was an error loading the item data.'); *@
        }
    });
});

//For append Modifier Groups in Edit Item Modal
$(document).on('change', "#ModifierGroupsInEditItemSelect", function () {
    var modifierGroupIdForEdit = $(this).val();
    modifierGroupForEdit.push(modifierGroupIdForEdit);
    console.log("value: ", modifierGroupIdForEdit);

    $.ajax({
        url: 'Menu/GetModifierGroupForEditItem',
        type: 'GET',
        data: { modifierGroupId: modifierGroupIdForEdit },
        contentType: 'application/json',
        success: function (response) {
            if (response.success) {
                let modifiersHTML = response.data.existingModifiers.map(modifier => `
                <div class="modifier-item w-100 d-flex justify-content-between">
                    <div>
                        ${modifier.name}
                    </div>
                    <div class="me-2">
                        ${modifier.rate}
                    </div>
                </div>
            `).join(""); // Convert array to string 

                console.log("Got modifier Group", response.data);
                $("#ModifierGroupsInEditItemModal").append(
                    `<div  class="mt-2 appendModifierGroupInEditItem_${response.data.modifierGroupId}">
                    <input type="hidden" name="ModifierGroupIds" value="${response.data.modifierGroupId}">
                    <div class="modifierHeading fw-bold d-flex justify-content-between">
                        ${response.data.modifierGroupName}
                        <button type="button"  data-id="${response.data.modifierGroupId}" class="btn bg-transparent deleteModifierGroupInEditModal_${response.data.modifierGroupId} border-none">
                            <img src="/images/Download/trash.svg" width="20px" alt="delete">
                        </button>
                    </div>
                    <div>
                        <div class="row">
                            <div class="col-6">
                                <select class="form-select rounded-pill modifierForEditItemSelectMin" data-id="${response.data.modifierGroupId}">
                                    <option value="" selected>0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <select class="form-select rounded-pill modifierForEditItemSelectMax" data-id="${response.data.modifierGroupId}">
                                    <option value="" selected>0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                        <div id="modifiersInNewItem">
                            ${modifiersHTML}
                        </div>
                    </div>
                </div>`
                );

                $(document).on('click', `.deleteModifierGroupInEditModal_${response.data.modifierGroupId}`, function () {
                    let modifierGroupId = $(this).data('id');
                    modifierGroupForEdit = modifierGroupForEdit.filter(id => id !== modifierGroupId);
                    $(`.appendModifierGroupInEditItem_${modifierGroupId}`).remove();
                });
            } else {
                console.error(response.message);
            }
        },
        error: function () {
            console.log("error");
        }
    });
});

$('body').on('submit', '#editMenuItemForm', function (e) {
    e.preventDefault();

    if (!$(this).valid()) {
        console.log('Form is invalid');
        return;
    }
    
    debugger
    var formData = new FormData(this);

    var internChoice = $('#editItemType option:selected').val();
    formData.set("Item.Itemtype", internChoice);

    let customSwitch = $(".editItemAvailable").is(":checked");
    formData.set("Item.Isavailable", customSwitch);

    modifierGroupForEdit.forEach(function (modifierGroupId, index) {
        var min = parseInt($(`.modifierForEditItemSelectMin[data-id="${modifierGroupId}"]`).val()) || 0;
        var max = parseInt($(`.modifierForEditItemSelectMax[data-id="${modifierGroupId}"]`).val()) || 0;

        formData.append(`Item.ModifierGroupData[${index}].Id`, modifierGroupId);
        formData.append(`Item.ModifierGroupData[${index}].Min`, min);
        formData.append(`Item.ModifierGroupData[${index}].Max`, max);
    });
    
    //modifierGroupIds without deletion even if click on trash icon
    var modifierGroupIds = [];
    var abc = $("#editItemModifierGroupIdsForEdit").val();
    if (abc.length !== 0) {
        modifierGroupIds = abc.split(',').map(ids => parseInt(ids));
        let count = 0;
        modifierGroupIds.forEach(function (modifierGroupId) {
            formData.append(`Item.ModifierGroupIds[${count}]`, modifierGroupId);
            count++;
        });
        console.log("modifierGroupIds", modifierGroupIds);
    }
    console.log("Form data for Update Item: ", formData);
    
    let editImagePath = $("#editItemImage").val();
    

    $.ajax({
        url: 'Menu/EditMenuItem',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                $('#EditItemModal').modal('hide');
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                toastr.success(response.message);
                location.reload();
            } else {
                toastr.error(response.message);
            }
        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
        }
    });
});

let selectedIds = [];
$(".modifier-checkbox").on('change', function () {
    if ($(this).is(":checked")) {
        selectedIds.push(parseInt($(this).val()));
        $("#modifierDropdown").text(
            selectedIds.length > 0 ? selectedIds.length + " selected" : "Select Modifier Group(s)"
        );
    }
    else {
        selectedIds = selectedIds.filter(id => id !== parseInt($(this).val()));
        $("#modifierDropdown").text(
            selectedIds.length > 0 ? selectedIds.length + " selected" : "Select Modifier Group(s)"
        );
    }
});

$("#addNewModifierForm").submit(function (e) {
    e.preventDefault();


    if (!$(this).valid()) {
        console.log('Form is invalid');
        return;
    }

    if (selectedIds.length === 0) {
        $("#ModifierGroupIds").addClass("is-invalid");
        $("#ModifierGroupIdsError").text("At least one Modifier Group must be selected.");
        return;
    }

    console.log('Form is valid, submitting...');

    if ($(this).data("edit-mode") === true) {
        updateModifier();
    } else {
        addModifier();
    }
});



function addModifier() {
    var customSwitch = $(".newItemAvailability").is(":checked");

    let newModifierData = {
        Name: $("#newModifierName").val(),
        Unit: $("#newModifierUnit").val(),
        Rate: $("#newModifierRate").val(),
        Quantity: $("#newModifierQuantity").val(),
        Description: $("#newModifierDescription").val(),
        Ids: selectedIds
    };


    let ab = $("#addNewModifierForm").serialize();
    console.log("data :", ab);

    console.log("data newModifierData:", newModifierData);

    var formData = new FormData();
    formData = JSON.stringify(newModifierData);

    $.ajax({
        url: 'Menu/AddNewModifier',
        type: 'POST',
        contentType: 'application/json',
        data: formData,
        success: function (response) {
            if (response.success) {
                $('#EditItemModal').modal('hide');
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                toastr.success(response.message);
                location.reload();
            }
            else {
                toastr.error(response.message);
            }
        },
        error: function (xhr, status, error) {
            console.log('Error:', error);
            // alert('There was an error updating the item.'); 
        }
    });
}

function loadModifiers(pageNumber, pageSize) {
    $.ajax({
        url: '/Menu/GetModifiersForExistingModifiersForAdd',
        type: 'GET',
        data: { pageNumber: pageNumber, pageSize: pageSize },
        success: function (response) {
            $("#existingModifiersForAddGroupTable").empty();
            $('#existingModifiersForAddGroupTable').html(response);
            bindPaginationEvents();

            //For check all existing Modifiers
            existingModifiersForAdd.forEach(function (modifierId) {
                var modifierId = $(`.modifiersIdsForAdd[data-id="${modifierId}"]`).data('id');
                // var modifierInput = $(`.rowModifierCheckForAdd_"${modifierId}"]`);
                // modifierInput.checked = true;
                if(modifierId !== undefined) {
                    document.querySelector(`.modifiersIdsForAdd[data-id="${modifierId}"]`).checked = true;
                }
            }
            );

            console.log("existingModifiersForAdd In ajax call", existingModifiersForAdd);
        },
        error: function () {
            alert('Failed to load data.');
        }
    });
}

function bindPaginationEvents() {
    var currentPage = $("#currentPageForExistingModifiers").val();
    var totalPages = $("#totalPagesForExistingModifiers").val();
    var totalItems = $("#totalItemsForExistingModifiers").val();

    $('#prevPageForAddExistingModifiersAdd').off('click').on('click', function () {
        if (currentPage > 1) {
            loadModifiers(currentPage - 1, $('#pageSizesForAddExistingModifiers').val());
        }
    });

    $('#nextPageForAddExistingModifiersAdd').off('click').on('click', function () {
        if (currentPage < totalPages) {
            currentPage = parseInt(currentPage) + 1;
            loadModifiers(currentPage, $('#pageSizesForAddExistingModifiers').val());
        }
    });

    $('#pageSizesForAddExistingModifiers').off('change').on('change', function () {
        loadModifiers(1, $(this).val()); // Reset to the first page
    });
}

// Initialize pagination when the modal is shown
$('#addExistingModal').on('shown.bs.modal', function () {
    console.log("Modal shown");
    loadModifiers(1, $('#pageSizesForAddExistingModifiers').val());
    // bindPaginationEvents();
});

function openAddModifierGroupModal() {
    $("#addModifierGroupModal").modal("show");
}
function openAddExistingModifiersModal() {
    $("#addModifierGroupModal").modal("hide");
    $("#addExistingModal").modal("show");

    //For checking the checkboxes for row of the addExistingModifiers
    var rowModifierGroupCheckBoxes = document.querySelectorAll('.rowModifierCheckForAdd');
    console.log("rowModifierCheckForAdd", rowModifierGroupCheckBoxes);


}