let socketReceiver;
let userName;

//Added api to display cities based on search
function showPlaces () {
    var searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));
}

$(document).ready(() => {

    getUserDetails();

    //category filter click
    $('.filter-values').on('click','a', function(event){
        event.preventDefault();
        const id = $(this).attr('id');
        retrieveItems(id);
    });

    //list time filter click
    $('.filter-values-days').on('click','a', function(event){
        event.preventDefault();
        const id = $(this).attr('id');
        retrieveItemsOnTime(id);
    });
    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }

    });

    // when the client clicks SEND in the chat box
    $('#datasend').click(function () {
        var message = $('#data').val();
        $('#data').val('');

        if(socketReceiver === userId) {//when the user is the actual owner of the item
            $('#conversation').append( "sorry you are the owner of the item"+ '<br>');
        } else {
            // tell server to execute 'sendchat' and pass the sender and receiver details
            socket.emit('sendChat', {
                msg: message,
                receiverId: socketReceiver,
                senderId: userId,
                senderName: userName
            }, function (data) {
                if (!data) {
                    $('#conversation').append(" sorry receiver not connected" + '<br>');
                }
            });
        }
    });

    //update the chat box on receiving message from the server
    socket.on('updateChat', function (data) {
        showChatBox(data.receiverId);
        socketReceiver = data.receiverId;
        $('#conversation').append( '<b>'+ data.id +  '</b>' +"  :" + data.msg + '<br>');
    });

});

/**
 * Used to get the user details from database
 */
const getUserDetails = () => {
    $.ajax({
        url: 'http://localhost:5000/getUserDetails/'+userId,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            userName = data.name;
        },
        error: function () {
            $('#conversation').append(" Error occurred while fetching user data" + '<br>');
        },
    });
};


/**
 * Retrieves the product details based on filter
 */
const  retrieveItems =(id)=>  {
    let searchValue;
    let filterType = (id == null) ? 'city' : 'category' ;

    if(id == null)  {
        let searchStr = $("#mapsearch").val().split(', ');
        searchValue = searchStr[0].toLowerCase();
    }
    else {
        $("#mapsearch").val('');
        searchValue = id.toLowerCase();
    }

    $.ajax({

        url: 'http://localhost:5000/search',
        data: {
            searchVal: searchValue,
            filter:filterType
        },
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            $('.results').css("display","block");

            let str = (filterType === 'city' ? searchValue : id);
            $('.results h3').html('Showing Results for: '+str);

            if( data.length > 0)  {
                $('#initial-view').addClass("hidden");
                $('.product-container').css("display","block");

                displayTemplate(data);
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

/**
 * Retrieve product list base on time
 */
const retrieveItemsOnTime = (id) =>  {
    var today = new Date();
    today.setDate(today.getDate()+parseInt(id));
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();

    if(dd<10)
        dd='0'+dd;

    if(mm<10)
        mm='0'+mm;

    today = yyyy+'-'+mm+'-'+dd;

    $.ajax({
        url: 'http://localhost:5000/search',
        data: {
            searchVal: today,
            filter:'listTime'
        },
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            $('#initial-view').addClass("hidden");
            $('.product-container').css("display","block");
            $('.results').css("display","block");

            let resultLabel = 'In '+id+' day(s)';
            $('.results h3').html('Showing Results for: '+resultLabel);

            if( data.length > 0)  {
                $('#initial-view').addClass("hidden");
                $('.product-container').css("display","block");

                displayTemplate(data);
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

/**
 * Navigate to product detailed description view
 */
const retrieveIndividual= (id) =>  {

    var queryString = "?user=" + userId + "&id=" + id ;
    window.location.href = "individual_search.html" + queryString;
};

const showChatBox = (id) => {
          socketReceiver= id;
         $("#chat-container").addClass("show");
 };

const showAlertBox = (id) => {
    $('.modal-body').html('<b>'+"Contact number: "+'</b>'+id);
    $('#myModal').modal('show');
};