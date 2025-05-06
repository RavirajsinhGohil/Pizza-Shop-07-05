// @* Pagination section *@

    // @* -Pagination For Menu Items List *@

    function TableListPaginationAjax(pageSize, pageNumber, sectionid) {
        // Get the dropdown element
        console.log("table pagination")
        let id = $("#section-list ").attr("section-id");
        // @* let pageSizeDropdown = document.getElementById("pageSizeDropdownforMenuitems");
        // console.log(pageSizeDropdown.value); *@
            let searchkeyword = $("#tableitem-search-field").val();

        console.log("inside item", searchkeyword)
        console.log("get id", id)

        $.ajax({
            url: "/Section/GetDiningTableList",
            data: { 'pageSize': pageSize, 'pageNumber': pageNumber, 'searchKeyword': searchkeyword, 'id': id },
            type: "GET",
            dataType: "html",
            success: function (data) {
                let $partialView = $(data);
                console.log("Hello", $partialView);

                // let maincb = $partialView.find("#main_table_checkbox");
                let checkboxes = $partialView.find(".tablelist_inner_checkbox");

                // console.log(maincb);
                // console.log("Sub checkboxes", checkboxes);

                // // When main checkbox is clicked
                // maincb.on("change", function () {
                //     console.log("Main checkbox changed:", this.checked);
                //     checkboxes.prop("checked", this.checked); // jQuery way to set all checkbox states
                // });

                // If any inner checkbox is unchecked, uncheck the main checkbox
                checkboxes.on("change", function () {
                    if (!this.checked) {
                        maincb.prop("checked", false);
                    } else if (checkboxes.length === checkboxes.filter(":checked").length) {
                        maincb.prop("checked", true);
                    }
                });

                $('#diningtablelistcontainer').html($partialView);
                // @* onPartialViewLoaded();  *@
            },
            error: function () {
                $("#diningtablelistcontainer").html('An error has occurred');
            }
        });
    }

    document.getElementById("tableitem-search-field").addEventListener('keyup', () => {
        TableListPaginationAjax();
    });

    // @* Load Sections List *@
    function loadsection(ele) {
        var id = ele?.getAttribute("section-id");
        var selectedSection = $("#loadFunctionParameter").data('selected-section') ?? 1;

        if (id == null) {
            id = selectedSection;
        }

        console.log(id)
        $.ajax({
            url: "/Section/GetSections",
            type: "GET",
            data: { id: id },
            success: function (data) {
                $('#section-list').html(data);
                $('#section-list-for-smallscreen').html(data);

                const activeSection = document.querySelector("#section-list .category-active-option");
                const sectionid = activeSection.getAttribute("section-id");
                console.log(sectionid, "hi")
            }
        });

        $.ajax({
            url: '/Section/GetDiningTableList',
            type: 'GET',
            data: { id: id },
            success: function (data) {
                let $partialView = $(data);

                // let maincb = $("#main_table_checkbox");
                let checkboxes = $(".modifieritemcheckbox");
                // console.log(maincb)
                // // When main checkbox is clicked
                // maincb.on("change", function () {
                //     console.log("Main checkbox changed:", this.checked);
                //     checkboxes.prop("checked", this.checked); // Set all inner checkboxes same as main
                // });

                // If any inner checkbox is unchecked, uncheck the main checkbox
                checkboxes.on("change", function () {
                    if (!this.checked) {
                        maincb.prop("checked", false);
                    } else if (checkboxes.length === checkboxes.filter(":checked").length) {
                        maincb.prop("checked", true);
                    }
                });

                $('#diningtablelistcontainer').html($partialView);
            }
        });
    }
    
    $(document).on("click", "#main_table_checkbox", function () {
        console.log("Main checkbox changed:", this.checked);
        const checkboxes = document.querySelectorAll(".tablelist_inner_checkbox");
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked; // Set all inner checkboxes same as main
        });
    });


    // @* set edit data for section *@

    function setEditSectionData(ele) {

        var c = JSON.parse(ele.getAttribute("item-obj"));
        console.log(c);

        var editsectionitem = document.getElementById("Editsectionmodal");
        editsectionitem.querySelector("#Sectionid").value = c.sectionId;
        editsectionitem.querySelector("#SectionName").value = c.sectionName;
        editsectionitem.querySelector("#Description").value = c.description;
    }

    // @* set delete data for section *@

    function setDeleteSectionId(element) {
        var Id = element.getAttribute("section-id");
        var deleteBtn = document.getElementById("deleteSectionBtn");
        deleteBtn.href = `Section/DeleteSection?id=${Id}`;
    }

    // @* set edit data for table *@

    function setEditTabledata(ele) {
        var c = JSON.parse(ele.getAttribute("item-obj"));
        console.log(c);
        var editTableItem = document.getElementById("EditTablemodal");
        editTableItem.querySelector("#NameofTableforedit").value = c.name;
        editTableItem.querySelector("#TableidForEdit").value = c.tableId;
        editTableItem.querySelector("#capacityoftableforedit").value = c.capacity;
        editTableItem.querySelector("#statusoftableforedit").value = c.status ? "Available" : "Occupied";
        editTableItem.querySelector("#sectionidforedit").value = c.sectionId;
    }

    // @* Delete single Dining Table *@

    function setDeleteTableData(element) {
        var Id = element.getAttribute("table-id");
        var deleteBtn = document.getElementById("deleteTableBtn");
        deleteBtn.href = '@Url.Action("DeleteTable", "Section")' + '?id=' + Id;
    }

    // @* Mass Delete Of Table *@

    $("#deletemultipleTableBtn").click(function (e) {
        var idlist = [];
        const checkboxes = document.querySelectorAll(".tablelist_inner_checkbox");

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                idlist.push(checkbox.value);
            }
        });

        console.log(idlist);


        $.ajax({
            url: "/Section/DeleteTables",
            method: "POST",
            data: {
                ids: idlist
            },
            success: function (response) {
                console.log("Items deleted successfully");
                const activeSection = document.querySelector("#section-list .category-active-option");
                const sectionid = activeSection.getAttribute("section-id");
                window.location.href = '/Section/Index?id=' + sectionid;
            },
            error: function (xhr, status, error) {
                console.error("Error deleting items:", error);
            }
        });
    });

    $("#DeleteTables").on("click", function (e) {
        var selectedItems = document.querySelectorAll(".tablelist_inner_checkbox:checked");
        if (selectedItems.length === 0) {   
            e.preventDefault();
            toastr.warning("Please select table(s) to delete.", "Warning");
        }
        else{
            var MyModal = new bootstrap.Modal(document.getElementById('deletemultipletablemodal'));
            MyModal.show();
        }
    });