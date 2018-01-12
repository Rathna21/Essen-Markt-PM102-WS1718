$(document).ready(() => {
    $("input,select,textarea").not("[type=submit]").jqBootstrapValidation();
    getCurrentLocation();

    $("#register_restaurant").submit(function () {
        event.preventDefault();
        registerRestaurant();
    });
});
const registerRestaurant = () => {
    let detail = {
        userId: userId,
        ownerName: $("#owner-name").val(),
        restaurantName: $("#restaurant-name").val(),
        contactNumber: $("#contact-number").val(),
        email: $("#email").val(),
        address: userAddress,
        city: userCity.toLowerCase()
    };
    $.ajax({
        url: 'http://localhost:5000/registerRestaurant',
        data: detail,
        dataType: 'text',
        type: 'POST',
        success: function () {
            $('#form-success').html('registered successfully');

        },
        error: function () {
           $('#form-error').html('error in registering please try later')
        },
    });
};