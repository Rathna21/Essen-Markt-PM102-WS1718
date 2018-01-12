const firebase= require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var app	= express();
var server= require('http').createServer(app);
var io= require('socket.io').listen(server);
var cron= require('node-cron');

server.listen(5000,function () {
    console.log('Express server listening on port 5000');
});
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//initialize firebase config
const firebaseApp = firebase.initializeApp({
    credential: firebase.credential.cert({
            "type": "service_account",
            "project_id": "foodmarkt-8a675",
            "private_key_id": "fe22fbb461bb1603bd4369c545f30f2375d3d82f",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDeAb0VWChEdLQM\nBHz1TJ1h+rHVwZztuxfi0tE39Tfwk93/2u7kmH898dTsliKn78MelkoJEeDkrwem\nRgQs2ATpgGgN8LLCp7KTDfnGcdvAuGZyPK1Xodn3xhCvENraozEcicegKOFU4t7t\ni9+9wEojdaTKLEZDWc17KIJHIF/lMMq0w6kvo8IlyNpGNmLMyaOV1ljpMW+Ykd2b\n2xblhpgbbLrY+sf61Of7fYLC9xPOaiz5aWUqBuiAnu0UHyexijhz+llw0CpjR/dB\nDd65sSUtUy+qT64xBD0GUm15PLdwBTgVKrUIaSN6pOZ0x1JRgz7TtF3uuESPxBtP\nheaK5NdvAgMBAAECggEAAxKNFl2I+SGQWFY7kH2F9BQvH+E1FckwFHCMerTHGGpD\neUYDZmCB6k6NftS5GA/maGb2EVgQ/7k4ZuGzLxeyQbUIO6EoKC9/9i8MVOXAf9NN\nf6k9UOgphxdTpcia7smxZU62142ZSL53DVyRNSQTIph/NlkUg9wbTugJnYhiK17R\n4/uupDeoE1/yRJHqxGQGUVokXGD2rL9XTMkW0IL8Jz/Eoui00xTx8iPgDARCCUtF\nz8frZmHv6rL876K0BwGxc5jFAtix1Ruj1jMQG62i4sMosNryoCqpbeCCbOTOTswR\nM2ECXhElDPaaBHjXiLVa9f1c4gQq4RqSiu7SuDyUIQKBgQD6mD6L/tZzR4G7DTUk\nhloCaKRELWw+3qUpqt9BCRRafS5Z03U3BxeHoB6wu0uuCUvTp1pAA5BIuFoQo9Yv\n6jk5Ah4oYJu1qZYdhc+EUHc5JVkORxYGczX3+b3MLf4lUJW6bvc3+BO7fnI2MAXn\nyDs7IDk+DAvVQxsfkwO+jWo1PwKBgQDiy6KS6rhWwyz5QWuOWNdMHPpG06t9lGGK\naj22XKTbnJKFhdkv6w4XgzfRNrgVdJcfKX28WbzR19HObrF+xoxsT6VDhJMZnVYi\nmNZmDmoHA7sPmhVkQGftZlpmwSjH3LgHiwvDUoSCNC510nv7LLwcuVEa+u7K9DBH\nzQ7Qed3h0QKBgEKTHdLNgiWgMqwCB0NL2i/XowRl2OMe/VwDhEpf4iNkLGM61WIo\nJS0n8d9b8vAqkhWJ2WU2TSe0qmDPVgDmxgsKL/7kI5nwkuwG96mcQwBQlsc/RW+z\nPfxCQhUzhthc/1pHTrB03LEsF6Wjvn3kaS/9EJgWVTJ0IImT4iPGqBe7AoGBAIWi\nJ3EaDPRSnLVh7tY5UuLuUCpbnrioLbE5WJOTkzAz2cIDVC3/+pWwI7uK2n0J7eHW\nuNe6qJ+c42sXnk5s/2DyrRZTj7mQE6jfFbWc2Ky5bgeLav9fU912ad4SAs2BKI6J\nR60XeiyeQqH6HEOr4EushjW3lezQZYJpOUluBWeBAoGBAPREZGn6kA7FuxsPBKsg\nslA6YG1LauoyQHM9nr0QsRvDLrjAsDezeVr68s+6V8XdnKrhgMqCuHora7mdIFwd\nuhtSqnP/qae5Q7ALlJz8ZimfvAOsgARnGcvNdwbfs4Xs8Oa0qwTiD5VhLIkvu7v5\ngJDAFt563KDKMQqfPGmw8fP5\n-----END PRIVATE KEY-----\n",
            "client_email": "foodmarkt-8a675@appspot.gserviceaccount.com",
            "client_id": "114693243346073291633",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://accounts.google.com/o/oauth2/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/foodmarkt-8a675%40appspot.gserviceaccount.com"
        }
    ),
    databaseURL: "https://foodmarkt-8a675.firebaseio.com"
});

var post = require('./app/requests')(app, firebaseApp);// added to handle requests from client


// Scheduler that runs on daily basis to remove the expired items from database
cron.schedule('0 0 0 * * *', function(){
    console.log('running a task every day');
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10)
    {
        dd='0'+dd;
    }

    if(mm<10)
    {
        mm='0'+mm;
    }
    today = yyyy+'-'+mm+'-'+dd;
    var ref = firebaseApp.database();
    var productsRef = firebaseApp.database().ref('/products');
    var array = [];
    productsRef.orderByChild('listTime').equalTo(today).once('value', function (snap) {
        snap.forEach((item) => {
            console.log(item.val());
            item.ref.remove();
        });
    });
});

var userIds= {};

io.sockets.on('connection', function (socket) {

    socket.on('addUser', function(data  ){
        console.log("adds");
        //Add socket details of the user
        socket.userId= data;
        // store the details of all the connected users
        userIds[data]= socket;
        console.log(data);
    });
    socket.on('donateRequest', function(data, callback){
        console.log("here: "+ data.receiverId);
        if( data.receiverId in userIds) {
            //if receiver is online or connected
            callback(true);
            userIds[data.receiverId].emit('donateRequest', {receiverId: data.senderId});
        }else {
            callback(false);
            console.log("no receiver");
        }
    });

    //response that indicates the acceptance or declination of donate request
    socket.on('respondRequest', function (data) {
        userIds[data.receiverId].emit('respondRequest',data.result);
    });

    socket.on('sendChat', function (data, callback) {
        if( data.receiverId in userIds){
            //if receiver is online or connected
            callback(true);
            //send the chat data to both sender and the receiver
            userIds[data.receiverId].emit('updateChat', {id: data.senderName, msg: data.msg, receiverId: data.senderId});
            userIds[data.senderId].emit('updateChat', {id: data.senderName, msg: data.msg, receiverId: data.receiverId});

        }else {
            //if receiver is not online or connected
            callback(false);
            console.log("no receiver");
        }
    });

    socket.on('disconnect', function () {
        if(!socket.userId) return;
        delete userIds[socket.userId];
        console.log(Object.keys(userIds));
    });
});

