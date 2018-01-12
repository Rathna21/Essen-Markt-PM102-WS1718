let userAddress;
let userCity;
let userZipCode;
let registeredRestaurants;
let user;
let socketReceiver;
let isDonateToRestaurant=false;
let selectedRestaurant;

const setInitialView = () => {
    $("input,select,textarea").not("[type=submit]").jqBootstrapValidation();

    $('.show-individual').addClass("hidden");
    $('.donate-to-restaurant').addClass("hidden");
};

$(document).ready(() => {
    setInitialView();
    getCurrentLocation(); //to display google api

    $(':input:hidden').attr('disabled', true);

    //Response received for donate request
    socket.on('respondRequest', function (data) {
        if(data) {
            donateToRestaurant();
        } else {
            $("#form-error").html("owner declined your request");
        }
    });


    $("#product_upload").submit(function (event) {
        event.preventDefault();
        if(isDonateToRestaurant) { //send request to owner if donation is made to restaurant
            if(socketReceiver === userId){
                $("#form-error").html("sorry !! you are the restaurant owner and you can directly upload the product");
            } else {
                $('#form-error').html("Sending item acceptance request to restaurant owner ! Your product will be donated only if you get response");
                socket.emit("donateRequest", {
                    receiverId: socketReceiver,
                    senderId: userId
                }, function (data) {
                    if (!data) {
                        $('#form-error').html(" sorry receiver not connected" + '<br>');
                    }
                });
            }
        } else {
           donateAsIndividual();
        }
    });

    //set the address of the restaurant on select
    $('.options').on('click','option', function() {
        let value = $(this).attr('id');
        selectedRestaurant= registeredRestaurants.filter(m => m.userId === value)[0];
        let selectedRestaurantAddress= selectedRestaurant.address;
        socketReceiver = selectedRestaurant.userId;
        $('#selected-restaurant-address').html(selectedRestaurantAddress);
    });

});

const donateToRestaurant = () => {
    let item = {
        id: Date.now(),
        userId: userId,
        itemName: $("#item-name").val(),
        category: $("#category").val().toLowerCase(),
        productDescription: $("#product-description").val(),
        ownerName: selectedRestaurant.ownerName,
        restaurantName: selectedRestaurant.restaurantName,
        contactNumber: selectedRestaurant.contactNumber,
        email: selectedRestaurant.email,
        address: selectedRestaurant.address,
        city: selectedRestaurant.city,
        pickupTime: $("#pick-up-timing").val(),
        listTime: $("#list-time").val()
    };
    let image = $(".item-image")[0].files[0];
    let storage = firebase.storage().ref();
    // storing the image in firebase storage
    if( image !== undefined) {
        var uploadTask = storage.child('images/' + item.id).put(image);
        uploadTask.on('state_changed', function (snapshot) {
            }, function (error) {
            }, function () {
                let downloadUrl = uploadTask.snapshot.downloadURL;
                item.imgUrl= downloadUrl;
                uploadProductDetails(item);
            }
        )
    }else {
        uploadProductDetails(item);
    }
};

const donateAsIndividual = () => {
    let item = {
        id: Date.now(),
        userId: userId,
        itemName: $("#item-name").val(),
        category: $("#category").val().toLowerCase(),
        productDescription: $("#product-description").val(),
        ownerName: $("#owner-name").val(),
        restaurantName: $("#restaurant-name").val(),
        contactNumber: $("#contact-number").val(),
        email: $("#email").val(),
        address: userAddress,
        city: userCity.toLowerCase(),
        pickupTime: $("#pick-up-timing").val(),
        listTime: $("#list-time").val(),
        imgUrl: ""
    };
    let image = $(".item-image")[0].files[0];
    let storage = firebase.storage().ref();
    // storing the image in firebase storage
    if( image !== undefined) {
        var uploadTask = storage.child('images/' + item.id).put(image);
        uploadTask.on('state_changed', function (snapshot) {
            }, function (error) {
            }, function () {
             let downloadUrl = uploadTask.snapshot.downloadURL;
             item.imgUrl= downloadUrl;
             uploadProductDetails(item);
            }
        )
    }else {
        uploadProductDetails(item);
    }
};
const uploadProductDetails = (item) => {
        $.ajax({
            url: 'http://localhost:5000/addProduct',
            data: item,
            dataType: 'text',
            type: 'POST',
            success: function () {
                $("#form-success").html("Product donated successfully")
                $("#form-error").html("");
            },
            error: function () {
                $("#error").removeClass("hidden").append("error occurred in adding user data");
            },
        });
};

const getRegisteredRestaurants = () => {
    $.ajax({
        url: 'http://localhost:5000/getRegisteredRestaurants/' + userId,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            registeredRestaurants = data;
            setRestaurantList();
            $('#error').addClass('hidden');
        },
        error: function () {
            $("#error").removeClass("hidden").append("error occurred in adding user data");
        },
    });
};

const setRestaurantList = () => {
    let data = registeredRestaurants;
    let source = document.getElementById('entry-template').innerHTML;
    let template = Handlebars.compile(source);
    let html = template({data});
    $('.options').html(html);
};
const clearErrors=() =>{
    $("#error").addClass("hidden");
    $("#form-error").html("");
    $("#form-success").html("");
};
const showIndividualUpload = () => {
    $("#product_upload")[0].reset();
    clearErrors();
    $(':input:hidden').attr('disabled', false);
    $("#restaurant-name-div").addClass("hidden");
    $("#restaurant").removeClass("active");
    $("#individual").addClass("active");
    $('.show-individual').removeClass("hidden");
    $('.donate-to-restaurant').addClass("hidden");
    $(':input:hidden').attr('disabled', true);
};
const showRestaurantUpload = () => {
    $("#product_upload")[0].reset();
    clearErrors();
    $(':input:hidden').attr('disabled', false);
    $("#restaurant-name-div").removeClass("hidden");
    $("#restaurant").addClass("active");
    $("#individual").removeClass("active");
    $('.show-individual').addClass("hidden");
    showDonateAsIndividual();
};
const showDonateToRestaurantFields= () => {
    $(':input:hidden').attr('disabled', false);
    isDonateToRestaurant= true;
    clearErrors();
    $(".individual").addClass('hidden');
    $(".donate-to-restaurant").removeClass('hidden');
    $(':input:hidden').attr('disabled', true);
    if(registeredRestaurants === null || registeredRestaurants === undefined) {
        getRegisteredRestaurants();
    }
};
const showDonateAsIndividual= () => {
    isDonateToRestaurant = false;
    clearErrors();
    $(':input:hidden').attr('disabled', false);
    $(".individual").removeClass('hidden');
    $(".donate-to-restaurant").addClass('hidden');
    $(':input:hidden').attr('disabled', true);
};




