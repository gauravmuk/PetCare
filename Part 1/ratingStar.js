$(document).ready(function(){
    $('span[class="star"]').on('click', function() {
        var starIndex;
        switch($(this).attr('id')) {
            case 'star1':
                starIndex = 1;
                break;
            case 'star2':
                starIndex = 2;
                break;
            case 'star3':
                starIndex = 3;
                break;
            case 'star4':
                starIndex = 4;
                break;
            case 'star5':
                starIndex = 5;
                break;
        }
        for (var i = 1; i <= starIndex; i++) {
            $('#star' + i).html('&#9733;');
        }
        for (var i = starIndex + 1; i <= 5; i++) {
            $('#star' + i).html('&#9734;');
        }
    });
});