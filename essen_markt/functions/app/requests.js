module.exports = function (app, firebaseApp) {

    /**
     * Retrieves all the products from the database
     */
    app.get('/getProducts', (request, response) => {
        const ref = firebaseApp.database().ref('/products');
        ref.on('value', snap => {
            console.log(snap.val());
            response.send(snap.val());
        });
    });

    /**
     * Retrieves the user details of a particular user
     */
    app.get('/getUserDetails/:uid', (request, response) => {
        console.log("details:" + request.params.uid);
        const ref = firebaseApp.database().ref('/users').child(request.params.uid);
        ref.on('value', snap => {
            response.send(snap.val());
        });
    });

    /**
     * Uploads the product object to the database
     */

    app.post('/addProduct', (request, response) => {
        firebaseApp.database().ref('/products/').push(request.body);
        response.send("ok");
    });

    /**
     * Deletes a particular product object from the database
     */
    app.post('/deleteProduct', (request, response) => {
        var ref = firebaseApp.database();
        var productsRef = firebaseApp.database().ref('/products');
        var array = [];
        productsRef.orderByChild('id').equalTo(request.body.id).once('value', function (snap) {
            snap.forEach((item) => {
                console.log(item.val());
                item.ref.remove();
                productsRef.orderByChild('userId').equalTo(request.body.userId).once('value', snap => {
                    snap.forEach((child) => {
                        array.push(child.val());
                    });
                    console.log(array);
                    response.send(array);
                });
            });
        });
    });

    /**
     * Retrieves the list of registered restaurants
     */
    app.get('/getRegisteredRestaurants/:uid', (request, response) => {
        let array = [];
        let userId= request.params.uid;
        let ref = firebaseApp.database().ref('/registeredRestaurants').once('value', (snap) => {
            console.log(snap.val());
            snap.forEach((child) => {
                array.push(child.val());
            });
            var filteredArray = array.filter(product => product.userId !== userId);
            response.send(filteredArray);
        });
    });

    /**
     * Adds the details of a new restaurant to the registered restaurant list
     */
    app.post('/registerRestaurant', (request, response) => {
        firebaseApp.database().ref('/registeredRestaurants/').push(request.body);
        response.send("ok");
    });

    /**
     * Retrieves the product details based on the filter values
     */
    app.post('/search', (request, response) => {
        let array = [];
        const cityRef = firebaseApp.database().ref('/products');
        cityRef.orderByChild(request.body.filter).equalTo(request.body.searchVal).once('value', function (snap) {
            snap.forEach((child) => {
                array.push(child.val());
            });
                response.send(array);
        });
    });

    /**
     * Adds the details of a user to the database
0 *    */
    app.post('/addUser', (request, response) => {
        console.log(request.body.id + request.body.name + request.body.mail);
        firebaseApp.database().ref('/users/' + request.body.id).set({
            name: request.body.name,
            email: request.body.mail
        });
        response.send("ok");
    });
};