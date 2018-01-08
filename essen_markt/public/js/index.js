let googleProvider;
let facebookProvider;
$(document).ready(() => {
     googleProvider = new firebase.auth.GoogleAuthProvider();
     facebookProvider = new firebase.auth.FacebookAuthProvider();
});
const clearSignUpScreen = () => {
    $("#sign-up").addClass("hidden");
    $("#error").addClass("hidden");
    $("#sign-up-mail").val("");
    $("#sign-up-pwd").val("");
    $("#sign-up-name").val("");
    $("#login").removeClass("hidden");
};

const clearLoginScreen = () => {
    $("#login").addClass("hidden");
    $("#error").addClass("hidden");
    $("#login-mail").val("");
    $("#login-pwd").val("");
    $("#sign-up").removeClass("hidden");
};

const addUserData = (id, name, email) => {
    $.ajax({
        url: 'http://localhost:5000/addUser',
        data: {
            id: id,
            name: name,
            mail: email
        },
        dataType: 'text',
        type: 'POST',
        success: function () {
            navigateToProductsPage(id);
        },
        error: function () {
            $("#error").removeClass("hidden").append("error occurred in adding user data");
        },
    });
};
const navigateToProductsPage = (data) => {

    var queryString = "?user=" + data;
    window.location.href = "product_display.html" + queryString;
};

const userLoginGoogle = () => {
    googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(googleProvider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        $("#error").addClass("hidden");
        addUserData(user.uid, user.displayName, user.email);

    }).catch(function (error) {
        // Handle Errors here.
        let errorMessage = error.message;
        $("#error").removeClass("hidden").html(errorMessage);
    });
};

const userLoginFacebook = () => {
    firebase.auth().signInWithPopup(facebookProvider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //let token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        $("#error").addClass("hidden");
        addUserData(user.uid, user.displayName, user.email);
    }).catch(function (error) {
        // Handle Errors here.
        let errorMessage = error.message;
        $("#error").removeClass("hidden").html(errorMessage);
    });
};

const userLogin = () => {
    firebase.auth().signInWithEmailAndPassword($("#login-mail").val(), $("#login-pwd").val()).then(function () {
        let user = firebase.auth().currentUser;
        $("#error").addClass("hidden");
        navigateToProductsPage(user.uid);
    }, function (error) {
        let errorMessage = error.message;
        $("#error").removeClass("hidden").html(errorMessage);
       // $("#error").html(errorMessage);
    });
};

const userSignUp = () => {
    firebase.auth().createUserWithEmailAndPassword($("#sign-up-mail").val(), $("#sign-up-pwd").val()).then(function () {
        let user = firebase.auth().currentUser;
        $("#error").addClass("hidden");
        addUserData(user.uid, $("#sign-up-name").val(), user.email)
    }, function (error) {
        let errorMessage = error.message;
        $("#error").removeClass("hidden").html(errorMessage);
    });
};

const openForgotPasswordView = () => {
    $("#login-signUp-header").addClass("hidden");
    $("#login").addClass("hidden");
    $("#forgot-password-div").removeClass("hidden");
    $("#error").addClass("hidden");
};

const openLoginView = () => {
    $("#reset-mail").val("");
    $("#login-signUp-header").removeClass("hidden");
    $("#login").removeClass("hidden");
    $("#error-forgot-password").addClass("hidden");
    $("#success-forgot-password").addClass("hidden");
    $("#forgot-password-div").addClass("hidden");
 };

const sendPasswordResetMail = () => {
    firebase.auth().sendPasswordResetEmail($("#reset-mail").val()).then(function() {
        $('#error-forgot-password').addClass("hidden");
        $('#success-forgot-password').removeClass("hidden").html("Reset link sent to your e-mail successfully");

    }, function(error) {
        // An error happened.
        let message = error.message;
        $("#error-forgot-password").removeClass("hidden").html(error.message);
    });
};
