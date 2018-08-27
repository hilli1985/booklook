let dataBook;
let items;
let item;

var source = $("#entry-template").html();
var template = Handlebars.compile(source);

let render = function(select) {
    //render in case of error
    $('.books').empty();
    if (select==='select'){
        $('.books').append("Sorry You Have To Select First");
        return;
    }
    $('.books').append("<h3 class='loading'>" + "Loading..." + "</h3>");
    items = dataBook.items;
    if (!items) {
        $('.loading').remove();
        $('.books').append("<h3 class='not found'>" + "Sorry Notihng Found..." + "</h3>");
        return;
    }
    // render results
    for (let i = 0; i < 10; i++) {
        item = items[i].volumeInfo;
        let title = item.title;
        let description = item.description;
        let authors;
        if (!item.authors) {
            authors = '';
        } else if (item.authors.length >= 1) {
            authors = item.authors[0];
            let image;
            if (item.imageLinks) {
                image = item.imageLinks.thumbnail;
            } else
            image = '';
            var context = { title: title, 
                description: description, 
                authors: authors, 
                image: image };
                var html = template(context);
                $('.loading').remove();
                $('.books').append(html);
            }
        }
    }
    
    let _searchItemByTitle =  function(title){
        for (let i = 0; i < items.length; i++) {
            let item = items[i].volumeInfo;
            if (item.title===title){
                var context = { title: item.title, 
                    description: item.description, 
                    authors: item.authors[0], 
                    image: item.imageLinks.thumbnail };
                return context;
                } 
            }
        };
        
        let renderSpecificBook = function(title) {
            var context = _searchItemByTitle(title);
            console.log(context);
            var html = template(context);
            $('.books').html(html);
        };
        
        //q=isbn:,q=intitle:,q=inauthor:
        var fetchBySelect = function(select,lookup_value){
            $.ajax({
                method: "GET",
                url: 'https://www.googleapis.com/books/v1/volumes?q='+select+':'+lookup_value
            }).then(function(response) {
                dataBook = response;
                render(select);
            }).catch(function(error) {
                console.log(error.data);
            });
        };    

        //Events 

        $('.form-search').on('click', '.search-btn', function(e) {  
            e.preventDefault();
            let select = $( "#select option:selected" ).val();
            console.log("selcet:"+select);
            let lookup_value = $('.form-search').find('#lookup-value').val();
            console.log("lookup_value:"+lookup_value);
            fetchBySelect(select,lookup_value);
        });
        
        $('.books').on('click', '.img-btn', function() {
            let title = ($(this).closest(".book").children('h3').text());
            console.log(title);
            renderSpecificBook(title);
        });