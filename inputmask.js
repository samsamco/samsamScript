$('.phonenumber').keyup(function (e) {

    if ($phone.val().length === 2) {

        if($phone.val().charAt(0) != 0)
            $phone.val(0);
        

        if($phone.val().charAt(1) != 6 && $phone.val().charAt(1) != 7)
            $("#phone-number").val('0');

    }

})


$('.phonenumber').keydown(function (e) {
    
    var key = e.which || e.charCode || e.keyCode || 0;
    $phone = $(this);


    if ($phone.val().length === 1) {

        if($phone.val().charAt(0) != 0)
            $phone.val(0);
    }


    if ($phone.val().length === 2) {

        if($phone.val().charAt(1) != 6 && $phone.val().charAt(1) != 7)
            $phone.val(0);

    }


    if ($phone.val().length === 1) {

        if($phone.val().charAt(1) != 0)
            $phone.val(0);

    }


// Allow numeric (and tab, backspace, delete) keys only
return (key == 8 || 
    key == 9 ||
    key == 46 ||
    (key >= 48 && key <= 57) ||
    (key >= 96 && key <= 105)); 
})

.bind('focus click', function () {
    $phone = $(this);

    if ($phone.val().length === 0) {
        $phone.val('0');
    }

})

.blur(function () {
    $phone = $(this);

    if ($phone.val() === '0') {
        $phone.val('');
    }
});
 