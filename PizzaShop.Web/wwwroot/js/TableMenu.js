$(document).ready(function () {
    // Handle form submission
    $("#assignTableForm").submit(function (event) {
        let isValid = true;

        // Clear previous error messages
        $(".text-danger").empty();

        // Validate Email
        const email = $("#Email").val();
        if (!email) {
            $("#emailValidation").text("Email is required.");
            isValid = false;
        } else if (!validateEmail(email)) {
            $("#emailValidation").text("Please enter a valid email.");
            isValid = false;
        }

        // Validate Name
        const name = $("#Name").val();
        if (!name) {
            $("#nameValidation").text("Name is required.");
            isValid = false;
        }

        // Validate Mobile
        const mobile = $("#Mobile").val();
        if (!mobile) {
            $("#mobileValidation").text("Mobile is required.");
            isValid = false;
        } else if (!/^\d{10}$/.test(mobile)) {
            $("#mobileValidation").text("Please enter a valid 10-digit mobile number.");
            isValid = false;
        }

        // Validate NoOfPersons
        const noOfPersons = $("#NoOfPersons").val();
        if (!noOfPersons) {
            $("#noOfPersonsValidation").text("Number of persons is required.");
            isValid = false;
        }

        // Validate Section
        const sectionName = $("#SectionDropdown").val();
        if (!sectionName) {
            $("#sectionValidation").text("Please select a section.");
            isValid = false;
        }

        // If form is not valid, prevent submission
        if (!isValid) {
            event.preventDefault();
        }
    });

    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
});

const waitingTokenButtons = document.querySelectorAll(".btn-outline-primary");

waitingTokenButtons.forEach(button => {
    button.addEventListener("click", function () {
        const sectionId = button.getAttribute("data-section-id");

        const form = document.getElementById("waitingTokenForm");
        form.reset(); // reset before setting dropdown
        form.classList.remove('was-validated');

        const dropdown = document.getElementById("floatingSection");
        if (dropdown) {
            dropdown.value = sectionId;
            console.log("Set dropdown to:", sectionId);
            // Trigger change in case any validation or plugin is watching
            dropdown.dispatchEvent(new Event('change'));
        }
    });
});



// Bootstrap form validation
const form = document.getElementById("waitingTokenForm");
form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        event.preventDefault();
        submitWaitingTokenForm();
    }
    form.classList.add("was-validated");
});

$("#waitingTokenForm").submit(function (event) {
    let isValid = true;

    // Clear previous error messages
    $(".text-danger").empty();

    // Validate Email
    const email = $("#Email").val();
    if (!email) {
        $("#emailValidation").text("Email is required.");
        isValid = false;
    } else if (!validateEmail(email)) {
        $("#emailValidation").text("Please enter a valid email.");
        isValid = false;
    }

    // Validate Name
    const name = $("#Name").val();
    if (!name) {
        $("#nameValidation").text("Name is required.");
        isValid = false;
    }

    // Validate Mobile
    const mobile = $("#Mobile").val();
    if (!mobile) {
        $("#mobileValidation").text("Mobile is required.");
        isValid = false;
    } else if (!/^\d{10}$/.test(mobile)) {
        $("#mobileValidation").text("Please enter a valid 10-digit mobile number.");
        isValid = false;
    }

    // Validate NoOfPersons
    const noOfPersons = $("#NoOfPersons").val();
    if (!noOfPersons) {
        $("#noOfPersonsValidation").text("Number of persons is required.");
        isValid = false;
    }

    // Validate Section
    const sectionName = $("#SectionDropdown").val();
    if (!sectionName) {
        $("#sectionValidation").text("Please select a section.");
        isValid = false;
    }

    // If form is not valid, prevent submission
    if (!isValid) {
        event.preventDefault();
    }
});