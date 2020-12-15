(function () {
    $('#body-content').css({ 'height': window.innerHeight - ($('#divHeader').height() + 20) });
    var userID = document.cookie && document.cookie.split('=')[1];
    
    $('#btnSearchCatalogueBooks, #btnSearchMyBooks, #btnSearchOtherBooks').off().click(function (e) {
        var bookTitle = $.trim($('#txtSearchBookTitle').val());
        var bookISBN = $.trim($('#txtSearchBookISBN').val());
        var _targetId = $(e.target).attr('id')

        $.ajax({
            method: 'GET',
            url: '/searchBooks',
            data: {
                title: bookTitle,
                isbn: bookISBN
            },
            success: function (result) {
                result = result && result.length > 0 ? result : [];
                bindBooks(result,_targetId);

                $('#txtSearchBookTitle').val('');
                $('#txtSearchBookISBN').val('');
            }
        });
    });

    $('#logout').click(function () {
        var cookieValue = document.cookie && document.cookie.indexOf('G_AUTHUSER_H') > -1;
        if (cookieValue) {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
            });
        }
        $.ajax({
            url: '/logout',
            method: 'GET',
            data: {
                userid: userID
            },
            success: function (res) {
                console.log(res);
            },
            error: function () {

            }
        });
    });

    $('#divMenuBookCatalogue').click(function () {

        $('.menu').removeClass('menuHighlight');
        $(this).addClass('menuHighlight');
        $('.bodyMenu').hide();
        $('.bookTitle').val('')
        $('.bookISBN').val('')
        $('#divBooksCatalogue').show();

    });

    $('#divMenuBooks').click(function () {

        $('.menu').removeClass('menuHighlight');
        $(this).addClass('menuHighlight');
        $('.bodyMenu').hide();
        $('.bookTitle').val('')
        $('.bookISBN').val('')
        $('#divMyBooks').show();
        loadPersonalBooks();

    });

    $('#divMenuOtherUserBooks').click(function () {

        $('.menu').removeClass('menuHighlight');
        $(this).addClass('menuHighlight');
        $('.bodyMenu').hide();
        $('#divOtherUserBooks').show();
        $('.bookTitle').val('')
        $('.bookISBN').val('')
        loadOtherUserBooks();

    });

    $('#divMenuAddNewBooks').click(function () {

        $('.menu').removeClass('menuHighlight');
        $(this).addClass('menuHighlight');
        $('.bodyMenu').hide();
        $('#divAddNewBooks').show();

        $('#btnAddNewBook').off().click(function (e) {
            addNewBook(e);
        })

    });

    function loadOtherUserBooks() {

        var userID = getCookie('userid');

        $.ajax({
            method: 'GET',
            url: '/getOthersUserBooks',
            data: {
                user_id: userID
            },
            success: function (result) {
                if (result && result.length > 0) {

                    var bookDetails = result;
                    $('#tblBooksOthers').empty();

                    for (var i = 0; i < bookDetails.length; i++) {
                        var book_id = bookDetails[i].id ? bookDetails[i].id : i;
                        var tr = $('<tr/>').attr({ index: book_id });
                        $(tr).append($('<td/>').text(i + 1));
                        $(tr).append($('<td/>').text(bookDetails[i].title));
                        $(tr).append($('<td/>').text(bookDetails[i].isbn));
                        $(tr).append($('<td/>').text(bookDetails[i].publisher));
                        var date_published = bookDetails[i].date_published ? moment(bookDetails[i].date_published).format('L') : '--'
                        $(tr).append($('<td/>').text(date_published));
                        $(tr).append($('<td/>').text(bookDetails[i].author_name));
                        $('#tblBooksOthers').append(tr);
                    }

                }

            }
        });

    }

    function addNewBook(e) {

        var userID = getCookie('userid');

        var type = $('#ddlSelectCollection option:selected').val()
        var title = $('#txtBookTitle').val();
        var date_published = document.querySelector('#txtDatePublished').value != '' ? document.querySelector('#txtDatePublished').value : null;
        var isbn = $('#txtISBN').val();
        var validation = [
            $('#ddlSelectCollection option:selected').val(),
            $('#txtBookTitle').val(),
            document.querySelector('#txtDatePublished').value,
            $('#txtISBN').val()
        ]

        if (validation.indexOf('') > -1) {
            return alert('Enter all fields')
        }
        else {
            $.ajax({
                method: 'POST',
                url: '/save',
                data: {
                    type: type,
                    user_id: userID,
                    title: title,
                    date_published: date_published,
                    author_name: $('#txtAuthorName').val(),
                    isbn: isbn,
                    publisher_name: $('#txtPublisherName').val()

                },
                success: function (result) {
                    if (result.rows && result.rows.length > 0) {

                        alert('Process done');
                        $('#ddlSelectCollection option:selected').val('');
                        $('#txtBookTitle').val('');
                        document.querySelector('#txtDatePublished').value = ''
                        $('#txtISBN').val('');
                        $('#txtPublisherName').val('');
                        $('#txtAuthorName').val('');

                    }

                }
            });
        }

    }

    function addToCollection(e) {

        var _targetId = $(e.target).closest('tr').attr('id');
        var userID = getCookie('userid');

        $.ajax({
            method: 'POST',
            url: '/add_to_personal_collection',
            data: {
                type: 'personal',
                user_id: userID,
                book_id: _targetId
            },
            success: function (result) {
                if (result && result.length > 0) {
                    if (result[0].exist_book_id) {
                        alert('This book already in your collection')
                    }
                    else if (result[0].new_book_id) {
                        alert('Added to your collection')
                    }

                }

            }
        });

    }

    function loadPersonalBooks() {

        var userID = getCookie('userid');

        $.ajax({
            method: 'GET',
            url: '/get_personal_collection',
            data: {
                type: 'personal',
                user_id: userID
            },
            success: function (result) {
                if (result && result.length > 0) {

                    var bookDetails = result;
                    $('#tblBooksPersonal').empty();

                    for (var i = 0; i < bookDetails.length; i++) {
                        var book_id = bookDetails[i].id ? bookDetails[i].id : i;
                        var tr = $('<tr/>').attr({ index: book_id });
                        $(tr).append($('<td/>').text(i + 1));
                        $(tr).append($('<td/>').text(bookDetails[i].title));
                        $(tr).append($('<td/>').text(bookDetails[i].isbn));
                        $(tr).append($('<td/>').text(bookDetails[i].publisher));
                        var date_published = bookDetails[i].date_published ? moment(bookDetails[i].date_published).format('L') : '--'
                        $(tr).append($('<td/>').text(date_published));
                        $(tr).append($('<td/>').text(bookDetails[i].author_name));
                        $('#tblBooksPersonal').append(tr);
                    }

                }

            }
        });

    }

    function loadBooksTable(bookDetails) {

        $.ajax({
            method: 'GET',
            url: '/getAll',
            data: {
                title: 'Networks'
            },
            success: function (result) {
                if (result && result.length > 0) {
                    bindBooks(result,null);
                }
            }
        });

    }

    function bindBooks(bookDetails, _targetId) {

        _targetId = _targetId == 'btnSearchMyBooks' ? 'tblBooksPersonal' : (_targetId == 'btnSearchOtherBooks' ? 'tblBooksOthers' : 'tblBooksAll')

        $('#'+_targetId).empty();

        for (var i = 0; i < bookDetails.length; i++) {
            var book_id = bookDetails[i].id ? bookDetails[i].id : i;
            var tr = $('<tr/>').attr({ id: book_id });
            $(tr).append($('<td/>').text(i + 1));
            $(tr).append($('<td/>').text(bookDetails[i].title));
            $(tr).append($('<td/>').text(bookDetails[i].isbn));
            $(tr).append($('<td/>').text(bookDetails[i].publisher));
            var date_published = bookDetails[i].date_published ? moment(bookDetails[i].date_published).format('L') : '--'
            $(tr).append($('<td/>').text(date_published));
            $(tr).append($('<td/>').text(bookDetails[i].author_name));
            $(tr).append($('<td/>')
                .append(
                    $('<button/>').attr({ class: 'widget-button btn', id: 'add_to_collection', title: 'Add to personal collection' })
                        .text('Add to my collection').off().click(function (e) {
                            addToCollection(e);
                        })
                ));
            $('#'+_targetId).append(tr);
        }

    }

    function getCookie(Name) {
        
        var search = Name + "="
        if (document.cookie.length > 0) { // if there are any cookies
            offset = document.cookie.indexOf(search)
            if (offset != -1) { // if cookie exists
                offset += search.length
                // set index of beginning of value
                end = document.cookie.indexOf(";", offset)
                // set index of end of cookie value
                if (end == -1)
                    end = document.cookie.length
                return unescape(document.cookie.substring(offset, end))
            }
        }
    }

    loadBooksTable();
    $('#divMenuBookCatalogue').addClass('menuHighlight');
})();