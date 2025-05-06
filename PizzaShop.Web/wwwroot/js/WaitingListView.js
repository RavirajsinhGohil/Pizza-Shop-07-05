function fetchWaitingTokens(sectionId) {
    $.ajax({
        url: '/OrderApp/LoadWaitingListCards',
        type: 'GET',
        data: { sectionId: sectionId },
        success: function (data) {
            $('#waitingListContainer').html(data);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching waiting tokens:', error);
        }
    });
}

$(".sectionBtn").on("click", function () {
    var sectionId = $(this).data("id");
    fetchWaitingTokens(sectionId);
});

// $('edit-token').on('click', function () {
//     debugger
//     console.log("Edit token clicked");
//     const tokenId = $(this).data("token-id");


// });

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.closest(".edit-token")) {
            const tokenId = event.target.closest(".edit-token").getAttribute("data-token-id");
            console.log("Edit token clicked with ID:", tokenId);
            // Add your logic here

            $.ajax({
                url: '/OrderApp/GetWaitingTokenById',
                type: 'GET',
                data: { tokenId: tokenId },
                success: function (response) {
                    console.log("Data received:", response.data);

                    // $('#waitingTokenModal').modal('show');
                    var MyModal = new bootstrap.Modal(document.getElementById('editWaitingTokenModal'));
                    MyModal.show();
                    $("#editTokenId").val(tokenId);
                    $('#waitingTokenForm').attr('action', '/OrderApp/UpdateWaitingToken');
                    $('#editTokenSectionId').val(response.data.SectionId123);
                    $("#editTokenCustomerId").val(response.data.customerId);
                    $('#editTokenEmail').val(response.data.email);
                    $('#editTokenName').val(response.data.name);
                    $('#editTokenPhone').val(response.data.phone);
                    $('#editTokenPersons').val(response.data.totalPersons);
                    $('#editTokenSection').val(response.data.sectionId123);
                },
                error: function (xhr, status, error) {
                    console.error('Error fetching waiting token:', error);
                }
            });
        }
    });
});

$("#deleteTokenBtn").on("click", function () {
    const tokenId = $(this).data("token-id");

    const deleteTokenLink = $("#deleteTokenLink");
    deleteTokenLink.attr("href", "/OrderApp/DeleteWaitingToken/?tokenId=" + tokenId);
});