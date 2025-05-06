$(document).ready(function () {
    console.log("Hello");
    let currentPage = parseInt("@Model.CurrentPage") || 1;
    let searchTerm = '';
    let pageSize = parseInt("@Model.PageSize") || 5;
    let fromRecord = 1;
    let totalItems = $('#totalItemssss').val() || 5;
    let totalPages = $('#totalPagessss').val() || 1;
    let sortBy = 'OrderId';
    let sortOrder = 'asc';
    let searchTimeout = 0;
    let currentSortBy = "OrderId";
    let currentSortOrder = "asc";
    let statusLog = '';
    let timeLog = '';
    let fromDate = '';
    let toDate = '';

    $(document).on('click', "#searchOrdersBtn", function () {
        searchTerm = $("#searchBox").val().trim();
        statusLog = $("#statusLog").val();
        timeLog = $("#timeLog").val();
        fromDate = $("#fromDate").val();
        toDate = $("#toDate").val();

        fetchItems(searchTerm, 1, pageSize, sortBy, sortOrder, statusLog, timeLog, fromDate, toDate);
    });

    fetchItems(searchTerm, 1, pageSize, sortBy, sortOrder, statusLog, timeLog, fromDate, toDate);

    function fetchItems(search = "", page = 1, pageSizeValue = 5, sortBy, sortOrder, statusLog, timeLog, fromDate, toDate) {

        $.ajax({
            url: 'Orders/GetOrderByPagination',
            type: 'GET',
            data: {
                searchTerm: search,
                page: page,
                pageSize: pageSizeValue,
                sortBy: sortBy,
                sortOrder: sortOrder,
                statusLog: statusLog,
                timeLog: timeLog,
                fromDate: fromDate,
                toDate: toDate
            },
            success: function (data) {
                $("#orderList").html(data);
                let $data = $(data);
                totalPages = parseInt($('#totalPageess').val()) || 1;
                totalItems = parseInt($('#totalItems').val()) || 5;

                //  Update UI with new data
                $("#orderList").html(data);

                //  Update current page & page size
                currentPage = page;
                pageSize = pageSizeValue;

                updatePaginationButtons();
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            }
        });
    }

    function updatePaginationButtons() {
        $('#prevPage').prop('disabled', currentPage <= 1);
        $('#nextPage').prop('disabled', currentPage >= totalPages);
        $('#currentPageDisplay').text(`Showing ${fromRecord}- ${pageSize} of ${totalItems}`);
    }

    //  Handle Previous Page Click
    $(document).on('click', '#prevPage', function () {
        if (currentPage > 1) {
            fetchItems(searchTerm, currentPage - 1, pageSize, sortBy, sortOrder, statusLog, timeLog, fromDate, toDate);
        }
    });

    $(document).on('click', '#nextPage', function () {
        if (currentPage < totalPages) {
            fetchItems(searchTerm, currentPage + 1, pageSize, sortBy, sortOrder, statusLog, timeLog, fromDate, toDate);
        }
    });

    $(document).on('change', '#pageSizes', function () {
        pageSize = parseInt($(this).val()) || 2;
        fetchItems(searchTerm, 1, pageSize, sortBy, sortOrder, statusLog, timeLog, fromDate, toDate);
    });

    $(document).on('keyup', '#searchBox', function () {
        clearTimeout(searchTimeout);
        searchTerm = $(this).val();

    });

    //For sorting according to sortBy and sortOrder
    $(document).on("click", ".sort-items", function (e) {
        e.preventDefault();

        currentSortBy = $(this).data("column");
        // @* let pageNumber = $(this).data("page"); *@

            if (sortBy === currentSortBy) {
            currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        }
        else {
            sortBy = currentSortBy;
            sortOrder = "asc";
        }

        fetchItems(searchTerm, 1, pageSize, sortBy, currentSortOrder, statusLog, timeLog, fromDate, toDate)
        sortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    });

    //For filter data according to status log
    $(document).on('change', "#statusLog", function (e) {
        console.log("statusLog changed");
        statusLog = $(this).val();
        console.log(statusLog);
    });

    //For filter data according to time log
    $(document).on('change', "#timeLog", function (e) {
        console.log("timeLog changed");
        timeLog = $(this).val();
        console.log(timeLog);
    });

    //For clicking on clear button to reset filters
    $(document).on('click', '#resetFilters', function () {
        console.log("Clear Button clicked");
        $("#searchBox").val("");
        $("#statusLog").val("All Status");
        $("#timeLog").val("All Time");
        $("#fromDate").val('');
        $("#toDate").val('');

        fetchItems('', 1, pageSize, sortBy, sortOrder, "All Status", "All Time", '', '');
    });

    //For clicking on eye button of the corresponding order
    $(document).on('click', '.eyeBtn', function () {
        console.log("EYE Button clicked");
    });

    $(document).on('click', "#exportOrdersBtn", function () {
        var searchTerm = $("#searchBox").val()|| "";
        var statusLog = $("#statusLog").val();
        var timeLog = $("#timeLog").val();

        var url = `/Orders/ExportOrdersInExcel?searchTerm=${encodeURIComponent(searchTerm)}&statusLog=${encodeURIComponent(statusLog)}&timeLog=${encodeURIComponent(timeLog)}`;

        window.location.href = url;
    });
});

$("#fromDate").on('change', function () {
    console.log("Hello");
    var fromDate = $(this).val();
    var toDate = $("#toDate").val() ?? fromDate;

    if(fromDate > toDate)
    {
        // @* console.log("Warning"); *@
        $("#fromDateValidation").text("From Date should be greater than or equal to To Date");
    }
    else
    {
        $("#fromDateValidation").empty();
        $("#toDateValidation").empty();
    }
});

$("#toDate").on('change', function () {
    console.log("Hello");
    var fromDate = $("#fromDate").val();
    var toDate = $(this).val();

    if(fromDate > toDate)
    {
        // @* console.log("Warning"); *@
        $("#toDateValidation").text("To Date should be less than or equal to From Date");
    }
    else
    {
        $("#fromDateValidation").empty();
        $("#toDateValidation").empty();
    }
});