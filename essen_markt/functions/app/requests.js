
module.exports = function(app, firebaseApp) {
    app.get('/getProducts',(request, response) => {
        const ref= firebaseApp.database().ref('/products');
        ref.on('value', snap => {
            console.log(snap.val());
            response.send(snap.val());
        });
    });
    app.get('/getUserDetails/:uid',(request, response) => {
        console.log("details:"+ request.params.uid);
        const ref= firebaseApp.database().ref('/users').child(request.params.uid);
        ref.on('value', snap => {
            console.log(snap.val());
            response.send(snap.val());
        });
    });

    app.post('/addProduct', (request, response) => {
        firebaseApp.database().ref('/products/').push(request.body);
        response.send("ok");
        // console.log("here");
        // let productsRef= firebaseApp.database().ref('/products');
        // productsRef.orderByChild('city').equalTo('man').once('value', function (snap)  {
        //     console.log(snap.val());
        // });
    });
   app.get('/deleteProduct', (request, response) => {
       var ref = firebaseApp.database();
       var productsRef= firebaseApp.database().ref('/products');
       console.log("comes here");
       firebaseApp.storage.ref('/images/1514985765656').delete();
       // productsRef.orderByChild('id').equalTo('1514985765656').once('value', function (snap) {
       //     snap.forEach((item) =>{
       //         console.log("comes here too");
       //         console.log(item.val());
       //         item.ref.remove();
       //
       //     });
       // });
       // var query = rootRef.orderByChild("id").equalTo(rvm);
       // query.once("value", function(snapshot) {
       //     snapshot.forEach(function(itemSnapshot) {
       //         itemSnapshot.ref.remove();
       //     });
       // });
   });

    app.get('/getRegisteredRestaurants', (request, response) => {
        let array=[];
        let ref= firebaseApp.database().ref('/registeredRestaurants').once('value', (snap) => {
            console.log(snap.val());
            snap.forEach( (child) => {
                array.push(child.val());
            });
            console.log
            response.send(array);
        });
    });
    app.post('/registerRestaurant', (request, response) => {
        firebaseApp.database().ref('/registeredRestaurants/').push(request.body);
        response.send("ok");
    });

    app.post('/search', (request, response) => {
        console.log('inside search '+request.body.searchVal);
        console.log('filterType '+request.body.filter);
        let array=[];
        if( request.body.searchVal != null && request.body.filter != null ) {
            const cityRef= firebaseApp.database().ref('/products');
            cityRef.orderByChild(request.body.filter).equalTo(request.body.searchVal).once('value', function (snap)  {
                snap.forEach( (child) => {
                    array.push(child.val());
                });
                response.send(array);
            });
        }
    });

    app.post('/addUser', (request, response) => {
        console.log(request.body.id+ request.body.name+ request.body.mail);
        firebaseApp.database().ref('/users/'+ request.body.id).set({
            name: request.body.name,
            email: request.body.mail
        });
        response.send("ok");
    });
};