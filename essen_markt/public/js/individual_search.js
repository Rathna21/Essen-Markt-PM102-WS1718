
let itemId= getQueryVariable("id");
$(document).ready(() => {
    getProductDetails();
});

const getProductDetails = () => {
    let filterType = "id";
    $.ajax({
        url: 'http://localhost:5000/search',
        data: {
            searchVal: itemId,
            filter: filterType
        },
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            const searchObj  = data;
            const objCount   = data.length;
            let tempArray = [];
            console.log(data[0]);
            if( objCount > 0)  {
                let context = data;
                let source = document.getElementById('display-template').innerHTML;
                let template = Handlebars.compile(source);
                let html = template({context});
                $('.product-container').html(html);
            }
            else {
                $('#product-container').text("Details not found");
            }
        },
        error: function() {
            $("#error").removeClass("hidden");
            $("#error").append("error occurred in displaying user data");
        }
    });
}