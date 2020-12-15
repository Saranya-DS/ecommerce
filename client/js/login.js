(function () {
    $('#btnLogin').click(function () {
        var loginData = {
            username: $('#txtUserName').val(),
            password: $('#txtPassword').val()
        }
        login(loginData);
    });
    function login(loginData) {
        var loginCredentials = [
            $('#txtUserName').val(),
            $('#txtPassword').val()
        ]

        if (loginCredentials.indexOf('') > -1 || loginData.email == '') {
            return alert('Enter credentials')
        } else {
            $.ajax({
                url: '/login',
                method: 'POST',
                data: loginData,
                success: function (response) {
                    if (response && response.status == 'Login Success') {
                        window.userID = response.response[0].user_id;
                        document.cookie = "userid=" + window.userID;
                        location.href = '/books';
                    } else {
                        alert(response.status);
                        $('#txtUserName').val('').focus();
                        $('#txtPassword').val('');
                    }
                },
                error: function () {

                }
            });
        }

    }
    function onSignIn(googleUser) {
        
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }
})();