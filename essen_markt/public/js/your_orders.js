$(document).ready (() => {
    getOrderHistory();
});

function getOrderHistory()  {
    $.ajax({
        url: 'http://localhost:5000/search',
        data: {
            searchVal: userId,
            filter:'userId'
        },
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            console.log("success");
            const searchObj  = data;
            const objCount   = data.length;
            let tempArray = [];

            $('.product-container').css("display","block");

            if( objCount > 0)  {
                let context = data;
                let source = document.getElementById('display-template').innerHTML;
                let template = Handlebars.compile(source);
                let html = template({context});
                $('.product-container').html(html);
            }
            else {
                $('.product-container').html("No results found");
            }
        },
        error: function() {
            $("#error").removeClass("hidden");
            $("#error").append("error occurred in displaying user data");
        },
    });
}

const deleteItem = (id) => {
    $.ajax({
        url: 'http://localhost:5000/deleteProduct',
        data: {
            userId: userId,
            id:id
        },
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            console.log("success");
            const searchObj  = data;
            const objCount   = data.length;
            let tempArray = [];

            $('.product-container').css("display","block");

            if( objCount > 0)  {
                let context = data;
                let source = document.getElementById('display-template').innerHTML;
                let template = Handlebars.compile(source);
                let html = template({context});
                $('.product-container').html(html);
            }
            else {
                $('.product-container').html("No results found");
            }
        },
        error: function() {
            $("#error").removeClass("hidden");
            $("#error").append("error occurred in displaying user data");
        },
    });
};

const retrieveIndividual = (id) =>  {
    var queryString = "?user=" + userId + "&id=" + id ;
    window.location.href = "individual_search.html" + queryString;
};