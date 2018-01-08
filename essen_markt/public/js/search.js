let socketReceiver;
let userName;

$(document).ready(() => {
    getUserDetails();
    $('#chat-container').addClass('hidden');
    $('.filter-values').on('click','a', function(event){
        event.preventDefault();
        const id = $(this).attr('id');
        retrieveItems(id);
    });

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
        if(socketReceiver === userId) {
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
        $('#conversation').append( data.id +":" + data.msg + '<br>');
    });

});

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
function retrieveItems(id)  {
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
            console.log("success");
            const searchObj  = data;
            const objCount   = data.length;
            let tempArray = [];
            console.log(data);

            $('.product-container').css("display","block");

            if( objCount > 0)  {
                let context = data;
                let source = document.getElementById('display-template').innerHTML;
                let template = Handlebars.compile(source);
                let html = template({context});
                $('.product-container').html(html);
            }
            else {
                $('#product-container').text("No results found");
            }
        },
        error: function() {
            $("#error").removeClass("hidden");
            $("#error").append("error occurred in displaying user data");
        },
    });
}

function retrieveItemsOnTime(id)  {


    $.ajax({

        url: 'http://localhost:5000/search',
        data: {
            searchVal: id,
            filter:'listTime'
        },
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            console.log("success");
            const searchObj  = data;
            const objCount   = data.length;
            let tempArray = [];
            console.log(data);

            $('.product-container').css("display","block");

            if( objCount > 0)  {
                let context = data;
                let source = document.getElementById('display-template').innerHTML;
                let template = Handlebars.compile(source);
                let html = template({context});
                $('.product-container').html(html);
            }
            else {
                $('#product-container').text("No results found");
            }
        },
        error: function() {
            $("#error").removeClass("hidden");
            $("#error").append("error occurred in displaying user data");
        },
    });
}


function retrieveIndividual(id)  {

    var queryString = "?user=" + userId + "&id=" + id ;
    window.location.href = "individual_search.html" + queryString;

}
 function showChatBox(id) {
          socketReceiver= id;
         $(':input:hidden').attr('disabled', false);
         $("#chat-container").removeClass("hidden");
         $(':input:hidden').attr('disabled', true);
 };