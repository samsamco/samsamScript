const $ = require('jquery');
// this "modifies" the jquery module: adding behavior to it
// the bootstrap module doesn't export/return anything
require('bootstrap');

// or you can include specific pieces
// require('bootstrap/js/dist/tooltip');
// require('bootstrap/js/dist/popover');

$(document).ready(function () {
    $('[data-toggle="popover"]').popover()
    $('[data-toggle="tooltip"]').tooltip()
});


function renvoyerSMS(codegen, tel, elem) {


    $.ajax({
        url: "https://payez-dimpot.fr/sms/web/api/send-sms",
        method: "post",
        async: false,
        data: {"code": codegen, "phone": tel.replace(/^0/gi, "+33")},
        success: function (data) {
            if (data.status) {

            }
        }
    }).done(function (data) {
        console.log(data);
        if (data.status) {
            localStorage.setItem('codegen', codegen);
            localStorage.setItem('tel', tel);
            localStorage.setItem('smssent', 1);
            elem.removeAttr("disabled", "");
            elem.find('.spinner-border.spinner-border-sm').addClass('d-none');
            $('.errorwrapper').text('Votre code à été envoyé');
            return true;
        }
    });


}


var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var regexSms = /^((\+)33|0)(6|7)(\d{2}){4}$/g;


function checkIfAnalyticsLoaded2() {
    if (window.ga && ga.create) {
        return ga.getAll()[0].get('clientId');
    } else {
        return "notshow-" + new Date().getTime();
    }
}

function changerPhoneCRM(id, newphone) {
    $.ajax({
        url: "https://labanquedelimmobilier.net/landing/leadpinel.php",
        type: "post",
        async: false,
        data: {
            "updatetel": true,
            "id": id,
            "tel": newphone,
            "updatetelsource": true
        },
        success: function (data) {


        }
    }).done(function (data) {
        if (data.success) {
            localStorage.setItem('tel', newphone);
            // $('#smssecond').modal('hide');
            // $('#smsfirst').modal('show');
            return true;
        }
    });
}

function insertlead(nom, tel, email, age = null, statut = null, nbenfant = null, checkIfAnalyticsLoaded2, daterdv = null, landingpageSOURCE, view_id, elm, tranche = null) {

    $('.p-errors-phone-exist').hide();

    var source = 'download_pinel';

    if ($(elm).hasClass('eligilibity_pinel')) {
        source = 'eligilibity_pinel';
    }

    var resulat = false;
    $.ajax({
        url: "https://labanquedelimmobilier.net/landing/leadpinel.php",
        type: "post",
        async: false,
        data: {
            "from": landingpageSOURCE,
            "nom": nom,
            "tel": tel,
            "email": email,
            "age": age,
            "statut": statut,
            "nbenfant": nbenfant,
            "daterdv": daterdv,
            "view_id": view_id,
            "client_id": checkIfAnalyticsLoaded2,
            "tranche": tranche,

        },
        success: function (data) {
            if (data.registred) {

                localStorage.setItem('source', source);
                localStorage.setItem('id', data.id);
                localStorage.setItem('age', age);
                localStorage.setItem('nom', nom);
                localStorage.setItem('statut', statut);
                localStorage.setItem('nbenfant', nbenfant);
                localStorage.setItem('email', email);
                localStorage.setItem('tel', tel);

                var codegen = Math.floor(1000 + Math.random() * 9000);

                localStorage.setItem('codegen', codegen);

                console.log(codegen);

                $.ajax({
                    url: "https://payez-dimpot.fr/sms/web/api/send-sms",
                    method: "post",
                    data: {"code": codegen, "phone": tel.replace(/^0/gi, "+33")},
                    success: function (data) {
                        if (data.status) {

                            resulat = true;
                            localStorage.setItem('smssent', 1);
                            localStorage.setItem('smsvalide', 0);

                            $(elm).find('.spinner-border.spinner-border-sm').addClass('d-none');
                            $('#gsm').val(null);
                            $('#selectInputModal').modal('hide');
                            $('#smsfirst').modal('show');

                        }
                    }
                })

            } else {

                $('.p-errors-phone-exist').show();

                $(elm).find('.spinner-border.spinner-border-sm').addClass('d-none');

                console.log(data);

                resulat = false;

            }
        }
    });


    // $.ajax({
    //     url: "https://payez-dimpot.fr/analytics/web/insert-lead",
    //     method: "post",
    //     data: {
    //         "client_id": checkIfAnalyticsLoaded2(),
    //         "name": nom,
    //         "email": email,
    //         "phone": tel,
    //         "view_id": 193175857
    //     },
    //     success: function (data1) {
    //
    //     }
    // });


}

function validersms(newcode) {
    if (localStorage.getItem('smssent') == 1 && localStorage.getItem('codegen') != "") {
        if (newcode != localStorage.getItem('codegen')) {
            $('.errorwrapper').text('Le code inséré n\'est pas valide');
            return false;
        } else {

            localStorage.setItem('smsvalide', true);

            $('#smsfirst').modal('hide');

            if (localStorage.getItem('source') != null) {
                $('.modal').modal('hide');
                switch (localStorage.getItem('source')) {
                    case "simulateur":

                        $('header').removeClass('etape1');
                        $('header').removeClass('etape2');
                        $('header').addClass('etape3');


                        $('.rowsimul').addClass('d-none');

                        $('.resultatfinal').removeClass('d-none');

                        break;

                    case "rdv":

                        $('#modalsuccess').modal('show');

                        break;

                    case "download_pinel":


                        var element = document.createElement('a');
                        element.setAttribute('href', 'https://payez-dimpot.fr/simulateur-pinel/public/livres/Guide-loi-Pinel.pdf');
                        element.setAttribute('download', 'Guide-loi-Pinel.pdf');
                        element.setAttribute('target', '_blank');
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                        break;

                    case "eligilibity_pinel":

                        $('#selectInputModal').modal('hide');

                        console.log($('#selectInput').val());
                        if ($('#selectInput').val() == 1 || $('#selectInput').val() == '1') {
                            $('#not-eligible').show();
                            $('#eligible').hide();
                        } else {
                            $('#not-eligible').hide();
                            $('#eligible').show();
                        }

                        $('#response_eligibility').modal('show');

                        break;


                }

            }


        }
    } else {
        toastr.options = {
            "closeButton": true,
            "debug": true,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "2000",
            "timeOut": "3000",
            "extendedTimeOut": "2000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "preventDuplicates": true
        }

        toastr["error"]("Le code n'est pas encore envoyé à votre appareil");
    }

}


require('../js/jquery.inputmask.bundle');
require('../js/toastr.min');

$(document).ready(function () {

    $(".phonenumber").inputmask({
        mask: "0599999999",
        definitions: {'5': {validator: "(6|7)"}}
    });

});


$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    }
});


$('.telecharger').click(function () {

    if (!$(this).hasClass('has-icon')) {
        $('#errors-simulate').html(null);
        $('#errors-simulate').hide();
    }

    var errors = [];

    $(this).find('.spinner-border.spinner-border-sm').removeClass('d-none');

    var form = $(this).closest('form').get(0);
    var nom = form.nom.value != null && form.nom.value.trim() != "" ? form.nom.value : null;
    var email = form.email.value != null && form.email.value.trim() != "" && regexEmail.test(form.email.value.toLowerCase()) ? form.email.value : null;
    var gsm = form.gsm.value != null && form.gsm.value.trim() != "" && regexSms.test(form.gsm.value.toLowerCase()) ? form.gsm.value : null;
    var tranche = $('#selectInput').val();

    ifnom = true;
    ifemail = true;
    ifgsm = true;

    if ($(this).hasClass('has-icon')) {

        if (nom == null || nom == '') {
            $(form.nom).parent().addClass('hasError');
            $(form.nom).parent().animateCss('shake');
            ifnom = false;
            errors.push('Remplir le nom');
        } else {
            $(form.nom).parent().removeClass('hasError');
        }

        if (email == null || email == '') {
            $(form.email).parent().addClass('hasError');
            $(form.email).parent().animateCss('shake');
            ifemail = false;
            errors.push('Remplir l\'email');
        } else {
            $(form.email).parent().removeClass('hasError');
        }

        if (gsm == '') {
            $(form.gsm).parent().addClass('hasError');
            $(form.gsm).parent().animateCss('shake');
            ifgsm = false;
            errors.push('Remplir le télephone');
        } else {
            $(form.gsm).parent().removeClass('hasError');
        }

    } else {

        if (nom == null || nom == '') {
            $(form.nom).addClass('hasError');
            $(form.nom).animateCss('shake');
            ifnom = false;
            errors.push('Remplir le nom');
        } else {
            $(form.nom).removeClass('hasError');
        }

        if (email == null || email == '') {
            $(form.email).addClass('hasError');
            $(form.email).animateCss('shake');
            ifemail = false;
            errors.push('Remplir l\'email');
        } else {
            $(form.email).removeClass('hasError');
        }

        if (gsm == '') {
            $(form.gsm).addClass('hasError');
            $(form.gsm).animateCss('shake');
            ifgsm = false;
            errors.push('Remplir le télephone');
        } else {
            $(form.gsm).removeClass('hasError');
        }


    }

    if (ifgsm == false || ifnom == false || ifemail == false) {
        $(this).find('.spinner-border.spinner-border-sm').addClass('d-none');

        if (!$(this).hasClass('has-icon')) {
            for (var i = 0, l = errors.length; i < l; i++) {
                $('#errors-simulate').append('' + errors[i] + '</br>');
            }
            $('#errors-simulate').show();
        }
        return;
    }

    if (!$(this).hasClass('has-icon')) {
        $('#errors-simulate').html(null);
        $('#errors-simulate').hide();
    }

    insertlead(nom, gsm, email, age = null, statut = null, nbenfant = null, checkIfAnalyticsLoaded2, daterdv = null, landing_page_source, view_id, $(this), tranche);

});


$('.valideernumero').click(function () {

    var codegen = $('.codegen').val();
    validersms(codegen);
    $('.codegen').val('');

});


$('.renvoyer').click(function () {


    var codegen = Math.floor(1000 + Math.random() * 9000);

    localStorage.setItem('codegen', codegen);

    var tel = localStorage.getItem('tel');
    renvoyerSMS(codegen, tel, $(this));


});

$('.change-phone-number').click(function () {

    $('#smsfirst').modal('hide');
    $('#smssecond').modal('show');

});


$('.renvoyer2').click(function () {

    var id = localStorage.getItem('id');
    var newphone = $('#newphone').val();
    changerPhoneCRM(id, newphone);

    var codegen = Math.floor(1000 + Math.random() * 9000);

    localStorage.setItem('codegen', codegen);

    var tel = localStorage.getItem('tel');
    renvoyerSMS(codegen, tel, $(this));

    $('#smssecond').modal('hide');
    $('#smsfirst').modal('show');

});


$('.fermerpop').click(function (event) {
    event.preventDefault();

    $('.modal').modal('hide');
    $(".modal-backdrop").remove();
    $('.modal').find('form input:not([type=button])').closest('.input-group').removeClass('hasError');
    $('.modal').find('form select').closest('.input-group').removeClass('hasError');
    $('.modal').find('form select').val('');
    $('.modal').find('form input:not([type=button])').val('');
});


$('#selectInput').change(function () {

    if ($(this).val() != 0) {
        $("#selectInputModal").modal();
    }

});

$('.prev1').on('click', function () {
    // $('#form-total-p-0').show();
    // $('#form-total-p-1').hide();
    $('#errors-simulate').hide();
    $('#errors-simulate').html(null);
    $('#selectInputModal').modal('hide');
});

$('.next1').on('click', function () {
    $('#form-total-p-1').show();
    $(this).closest('section').hide();
});

$(document).ready(function () {

    $('.directDownload').click(function () {

        var element = document.createElement('a');
        element.setAttribute('href', 'https://payez-dimpot.fr/simulateur-pinel/public/livres/Guide-loi-Pinel.pdf');
        element.setAttribute('download', 'Guide-loi-Pinel.pdf');
        element.setAttribute('target', '_blank');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

    });

});
