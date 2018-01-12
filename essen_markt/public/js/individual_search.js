
let itemId= getQueryVariable("id");
$(document).ready(() => {
    getUserDetails();
    getProductDetails();

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
        $('#conversation').append( '<b>'+ data.id +  '</b>' +"  :" + data.msg + '<br>');
    });


});

//get product details of the item which is clicked in the search result
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
            if( data.length > 0)  {
                displayTemplate(data);
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
};

const showChatBox =(id) => {
    socketReceiver= id;
    $("#chat-container").addClass("show");
};

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

const showAlertBox = (id) => {
    $('.modal-body').html('<b>'+"Contact number: "+'</b>'+id);
    $('#myModal').modal('show');
};