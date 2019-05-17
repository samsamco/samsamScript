
function renvoyerSMS(codegen, tel, elem) {


    $.ajax({
        url: "https://payez-dimpot.fr/sms/web/api/send-sms",
        method: "post",
        async: true,
        data: {"code": codegen, "phone": tel.replace(/^0/gi, "+33")},
        success: function (data) {
            if (data.status) {

            }
        }
    }).done(function (data) {
        //console.log(data);
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
        async: true,
        data: {
            "updatetel": true,
            "id": localStorage.getItem('id'),
            "tel": newphone,
            "updatetelsource": landing_page_source
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


function insertlead(nom, tel, email, age = null, statut = null, nbenfant = null, checkIfAnalyticsLoaded2, daterdv = null, landingpageSOURCE, ID_google_analytic, elm, tranche = null) {

    $('.p-errors-phone-exist').hide();

    var source = 'none';

    //console.log($(elm))

    if ($(elm).hasClass('download_pinel')) {
        source = 'download_pinel';
    }
    if ($(elm).hasClass('eligilibity_pinel')) {
        source = 'eligilibity_pinel';
    }
    else if($(elm).hasClass('simulationscpigouv'))
    {
        source = 'simulationscpigouv';
    }
    else if($(elm).hasClass('simulationassur'))
    {
        source = 'simulationassur';
    }
    else if($(elm).hasClass('download_ebook'))
    {
        source = 'download_ebook';
    }
    else if($(elm).hasClass('telechargerappstore'))
    {
        source = 'telechargerappstore';
    }
    else if($(elm).hasClass('telechargerplaystore'))
    {
        source = 'telechargerplaystore';

    }else if($(elm).hasClass('link_pinel'))
    {
        source = 'link_pinel';

    }else if($(elm).hasClass('redirecttoamf'))
    {
        source = 'redirecttoamf';
    }
    else if($(elm).hasClass('rdv'))
    {
        source = 'rdv';
    }

    $('#errors-simulate').html(null);
    $('#errors-simulate').hide();





    var resulat = false;
    $.ajax({
        url: "https://labanquedelimmobilier.net/landing/leadpinel.php",
        type: "post",
        async: true,
        data: {
            "from": landingpageSOURCE,
            "nom": nom,
            "tel": tel,
            "email": email,
            "age": age,
            "statut": statut,
            "nbenfant": nbenfant,
            "daterdv": daterdv,
            "ID_google_analytic": ID_google_analytic,
            "client_id": checkIfAnalyticsLoaded2,
            "tranche": tranche,

        },
        success: function (data) {
            if (data.registred) {

                sendTracking_Api(Userip,ID_google_analytic)
                sendAdConversion_Api(ID_google_Ad)
                sendFbConversion_Api(ID_faceboo_Ad)

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


                //console.log(codegen);

                $.ajax({
                    url: "https://payez-dimpot.fr/sms/web/api/send-sms",
                    method: "post",
                    data: {"code": codegen, "phone": tel.replace(/^0/gi, "+33")},
                    success: function (data) {
                        if (data.status) {

                            resulat = true;
                            localStorage.setItem('smssent', 1);
                            localStorage.setItem('smsvalide', 0);

                            //$(elm).find('.spinner-border.spinner-border-sm').addClass('d-none');

                            $('#gsm').val('');

                            $('.modal').modal('hide');

                            $('#selectInputModal').modal('hide');
                            $('#modalebook').modal('hide');
                            // $('#selectInputModal').removeClass('show');

                            //console.log("is show")

                            // $('#smsfirst').modal();
                            $('#smsfirst').modal('show');


                        }
                        else
                        {
                            $(elm).find('.spinner-border.spinner-border-sm').addClass('d-none');

                            var form = $(elm).closest('form');

                            $(form.gsm).addClass('hasError');
                            $(form.gsm).animateCss('shake');

                            //errors.push('Remplir le télephone');

                            alert('Veuillez insérer un numéro de téléphone valide');

                            $('#errors-simulate').text("Veuillez insérer un numéro de téléphone valide");
                            $('#errors-simulate').show();

                            resulat = false;

                        }
                    }
                })

            } else {


                $('#errors-simulate').append(''+data.Message);
                $('#errors-simulate').show();

                $('.p-errors-phone-exist').show();

                $(elm).find('.spinner-border.spinner-border-sm').addClass('d-none');

                //console.log(data);

                resulat = false;

            }
        }
    });


    if (!(/test/i.test(nom))) {
        $.ajax({
            url: "https://www.payer-dimpot.com/web/insert-lead",
            method: "post",
            data: {
                "client_id": checkIfAnalyticsLoaded2(),
                "name": nom,
                "email": email,
                "phone": tel,
                "view_id": ID_google_View
            },
            success: function (data1) {
                console.log(data1)

            },error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status);
                //alert(thrownError);
            }



        })
    }




}

function validersms(newcode,urlhref=null) {

    if (localStorage.getItem('smssent') == 1 && localStorage.getItem('codegen') != "") {

        if (newcode != localStorage.getItem('codegen')) {
            $('.errorwrapper').text('Le code inséré n\'est pas valide');
            return false;

        }else{

            localStorage.setItem('smsvalide',1);

            $('#smsfirst').modal('hide');
            $('[data-target*=modallivre]').attr('href','https://lascpi.fr/public/livres/ReussissezVotreInvestissement.pdf');
            $('[data-target*=modallivre]').attr('target','_blank');
            $('[data-target*=modalapplication]').attr('href','https://play.google.com/store/apps/details?id=scpi.simulateur.co');
            $('[data-target*=modalapplication]').attr('target','_blank');
            $('[data-target*=modalportail]').attr('href','https://www.amf-france.org/Epargne-Info-Service/Comprendre-les-produits-financiers/Placements-collectifs/Immobilier');
            $('[data-target*=modalportail]').attr('target','_blank');
            $('[data-target]').removeAttr('data-target');
            $('[data-toggle]').removeAttr('data-toggle');

            if (localStorage.getItem('source') != null) {

                $('.modal').modal('hide');

                switch (localStorage.getItem('source')) {

                    case "simulationassur":

                        $('header').removeClass('etape1');
                        $('header').removeClass('etape2');
                        $('header').addClass('etape3');


                        $('.rowsimul').addClass('d-none');

                        $('.resultatfinal').removeClass('d-none');


                        $('[data-toggle=prendrerdv]').attr('data-toggle','modalsuccess');
                        $('.modal .bgyellow.d-flex.align-items-center.w-75.mx-auto.my-3').parent().addClass('p-3');
                        $('.modal .bgyellow.d-flex.align-items-center.w-75.mx-auto.my-3').addClass('d-none');
                        $('.modal .bgyellow.d-flex.align-items-center.w-75.mx-auto.my-3').removeClass('d-flex');
                        $('.modal bgyellow  d-flex align-items-center w-75 mx-auto my-3').addClass('d-none');
                        $('.mobileetape3.text-center button').removeClass('d-flex');
                        $('.mobileetape3.text-center button').addClass('d-none');

                        document.getElementsByTagName('header')[0].classList.remove('etape1');
                        document.getElementsByTagName('header')[0].classList.remove('etape2');
                        document.getElementsByTagName('header')[0].classList.add('etape3');
                        document.getElementsByClassName('rowsimul')[0].classList.add('d-none');
                        document.getElementsByClassName('resultatfinal')[0].classList.remove('d-none');



                        break;

                    case "rdv":

                        $('#modalsuccess').modal('show');

                        break;

                    case "download_pinel":

                        // $('[data-toggle=modal]').addClass('directDownload');
                        // //console.log('smsmsms')
                        // $('[data-toggle=modal]').removeAttr('data-target');
                        // $('[data-toggle=modal]').removeAttr('data-toggle');
                        // $('.modalebook').addClass('directDownload');

                        $('[data-toggle=modal]:not(.readlink)').addClass('directDownload');
                        $('.readlink').attr('href',$('.readlink').attr('data-href'));
                        $('[data-toggle=modal]').removeAttr('data-target');
                        $('[data-toggle=modal]').removeAttr('data-toggle');



                        var element = document.createElement('a');
                        element.setAttribute('href', 'https://payez-dimpot.fr/simulateur-pinel/public/livres/Guide-loi-Pinel.pdf');
                        element.setAttribute('download', 'Guide-loi-Pinel.pdf');
                        element.setAttribute('target', '_blank');
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                        // if (localStorage.getItem('nom') != null && localStorage.getItem('email') != null && localStorage.getItem('smsvalide') != null) {

                        // }

                        break;

                    case "eligilibity_pinel":

                        $('#selectInputModal').modal('hide');

                        //console.log($('#selectInput').val());
                        if ($('#selectInput').val() == 1 || $('#selectInput').val() == '1') {
                            $('#not-eligible').show();
                            $('#eligible').hide();
                        } else {
                            $('#not-eligible').hide();
                            $('#eligible').show();
                        }

                        $('#response_eligibility').modal('show');

                        break;

                    case "simulationscpigouv":


                        $('.underline .col').removeClass('bg-red');
                        $('.underline .col').addClass('bg_darkblue');

                        $('.underline .col:last-child').removeClass('bg_darkblue');
                        $('.underline .col:last-child').addClass('bg-red');

                        $('.sumulateur_content').addClass('d-none');
                        $('.part_3').removeClass('d-none');

                        $('.col.h-25').remove();

                        $('.col-12.col-md-7').addClass('col-md-6');
                        $('.col-12.col-md-7').removeClass('col-md-7');


                        $('.col-12.col-md-4.text-center.py-3').addClass('col-md-6');
                        $('.col-12.col-md-4.text-center.py-3').removeClass('col-md-4');


                        $('.content').animateCss('fadeOutLeftBig');
                        $('#chartContainer').removeClass('d-none');
                        $('#chartContainer').animateCss('fadeInRightBig');
                        $('.content').addClass('d-none');
                        $('.content').removeClass('d-md-block');

                        var res = calculer();

                        $('#rc').text(addCommas(res.Rc)+' €');
                        $('#br').text(addCommas(res.Br)+' €');
                        $('#ccp').text(addCommas(res.cpp)+' €');

                        $('.montant').val(localStorage.getItem('montant'));
                        $('.rendement').val(localStorage.getItem('rendement'));

                        setTimeout(function(){simuler(6)},500);

                        break;

                    case "telechargerappstore":

                        window.open('https://play.google.com/store/apps/details?id=scpi.simulateur.co','_blank');


                        break;

                    case "telechargerplaystore":

                        window.open('https://play.google.com/store/apps/details?id=scpi.simulateur.co','_blank');

                        break;


                    case "download_ebook":


                        var element = document.createElement('a');
                        element.setAttribute('href', 'https://lascpi.fr/public/livres/ReussissezVotreInvestissement.pdf');
                        element.setAttribute('download', 'ReussissezVotreInvestissement.pdf');
                        element.setAttribute('target', '_blank');
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                        break;

                    case 'link_pinel':

                        window.open(urlhref,'_blank');

                        break;

                    case "redirecttoamf":

                        window.open('https://www.amf-france.org/Epargne-Info-Service/Comprendre-les-produits-financiers/Placements-collectifs/Immobilier','_blank');


                }

            }


        }
    } else {

    }

}


// require('jquery.inputmask.bundle');


/******Calculer SCPI ****/

function calc() {

    var bill = localStorage.getItem('montant');
    var tip = bill * .06;
    var revenu = tip / 12

    localStorage.setItem('ran', Number(tip).toFixed());

    localStorage.setItem('rvm', Number(revenu).toFixed());

}


/********Calculer*****/

// $('a.btn').on('click',function(event){
//     event.preventDefault();
// })

$('.slow').click(function(){
    document.querySelector('.simulateur').scrollIntoView({
        behavior: 'smooth'
    });
    $('.montant').focus();
})



function isNumber(evt) {

    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

    return true;

}


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

    $(this).find('.spinner-border').removeClass('d-none');

//     if (!$(this).hasClass('has-icon')) {
//         $('#errors-simulate').html(null);
//         $('#errors-simulate').hide();
//     }

//     var errors = [];
//     age = null
//     statut = null
//     nbenfant = null


//     var form = $(this).closest('form').get(0);
//     var nom = form.nom.value != null && form.nom.value.trim() != "" ? form.nom.value : null;
//     var email = form.email.value != null && form.email.value.trim() != "" && regexEmail.test(form.email.value.toLowerCase()) ? form.email.value : null;
//     var gsm = form.gsm.value != null && form.gsm.value.trim() != ""  ? form.gsm.value : null;
//     var tranche = $('#selectInput').val();


//     var age  =form.age!=null && form.age.value.trim()!="" && !isNaN(form.age.value) ? form.age.value:null;
//     var statut = form.statut!=null && form.statut.value.trim()!="" ? form.statut.value:null;
//     var nbenfant = form.nbenfant!=null && form.nbenfant.value.trim()!="" ? form.nbenfant.value:0;



//     ifnom = true;
//     ifemail = true;
//     ifgsm = true;
//     ifage = true;
//     ifstatut = true;



//     if ($(this).hasClass('has-icon')) {

//         if (nom == null || nom == '') {
//             $(form.nom).parent().addClass('hasError');
//             $(form.nom).parent().animateCss('shake');
//             ifnom = false;
//             errors.push('Remplir le nom');
//         } else {
//             $(form.nom).parent().removeClass('hasError');
//         }

//         if (email == null || email == '') {
//             $(form.email).parent().addClass('hasError');
//             $(form.email).parent().animateCss('shake');
//             ifemail = false;
//             console.log(email)
//             errors.push('Remplir l\'email');
//         } else {
//             $(form.email).parent().removeClass('hasError');
//         }

//         if (gsm == null || gsm == '') {
//             $(form.gsm).parent().addClass('hasError');
//             $(form.gsm).parent().animateCss('shake');
//             ifgsm = false;
//             errors.push('Remplir le télephone');
//         } else {
//             $(form.gsm).parent().removeClass('hasError');
//         }

//     } else {

//         if (nom == null || nom == '') {
//             $(form.nom).addClass('hasError');
//             $(form.nom).animateCss('shake');
//             ifnom = false;
//             errors.push('Remplir le nom');
//             $(this).find('.spinner-border.spinner-border-sm').addClass('d-none');
//         } else {
//             $(form.nom).removeClass('hasError');
//         }

//         if (email == null || email == '') {
//             $(form.email).addClass('hasError');
//             $(form.email).animateCss('shake');
//             ifemail = false;
//             errors.push('Remplir l\'email');
//             $(this).find('.spinner-border.spinner-border-sm').addClass('d-none');
//         } else {
//             $(form.email).removeClass('hasError');
//         }

//         if (gsm == null || gsm == '' ) {
//             $(form.gsm).addClass('hasError');
//             $(form.gsm).animateCss('shake');
//             ifgsm = false;
//             errors.push('Remplir le télephone');
//             $(this).find('.spinner-border.spinner-border-sm').addClass('d-none');
//         } else {
//             $(form.gsm).removeClass('hasError');
//         }


//         if (age == null || age == '' ) {
//             $(form.age).addClass('hasError');
//             $(form.age).animateCss('shake');
//             ifage = false;
//             errors.push('Remplir l\'age');
//             $(this).find('.spinner-border.spinner-border-sm').addClass('d-none');
//         } else {
//             $(form.age).removeClass('hasError');
//         }

//         if (statut == null || statut == '' ) {
//             $(form.statut).addClass('hasError');
//             $(form.statut).animateCss('shake');
//             ifstatut = false;
//             errors.push('Remplir le statut');
//             $(this).find('.spinner-border.spinner-border-sm').addClass('d-none');
//         } else {
//             $(form.statut).removeClass('hasError');
//         }
//     }

    




//     if (ifgsm == false || ifnom == false || ifemail == false || (form.age!=null && (ifage == false || ifstatut == false ) )) {

//         console.log(123);

//         $(this).find('.spinner-border.spinner-border-sm').addClass('d-none');

//         if (!$(this).hasClass('has-icon')) {
//             for (var i = 0, l = errors.length; i < l; i++) {
//                 $('#errors-simulate').append('' + errors[i] + '</br>');
//             }
//             //$('#errors-simulate').show();
//             console.log(12374);
//         }
//         return;
//     }

//     if (!$(this).hasClass('has-icon')) {
//         $('#errors-simulate').html(null);
//         $('#errors-simulate').hide();
//     }


//     $('#errors-simulate').html('');
//     $('#errors-simulate').hide();


    //insertlead(nom, gsm, email, age , statut , nbenfant , checkIfAnalyticsLoaded2, daterdv = null, landing_page_source, ID_google_analytic, $(this), tranche);

});


$('.valideernumero').click(function () {

    var codegen = $('.codegen').val();
    var urlhref = localStorage.getItem('urlhref');

    validersms(codegen,urlhref);
    $('.codegen').val('');

});




$('.renvoyer').click(function () {


    var codegen = Math.floor(1000 + Math.random() * 9000);

    localStorage.setItem('codegen', codegen);

    var tel = localStorage.getItem('tel');
    renvoyerSMS(codegen, tel, $(this));


});



$('.chnagernumero').click(function () {

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


// $('#selectInput').change(function () {

//     if ($(this).val() != 0) {
//         $("#selectInputModal").modal();
//     }

// });

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

$(document).on("click",".directDownload",function(event){

    var element = document.createElement('a');
    element.setAttribute('href', 'https://payez-dimpot.fr/simulateur-pinel/public/livres/Guide-loi-Pinel.pdf');
    element.setAttribute('download', 'Guide-loi-Pinel.pdf');
    element.setAttribute('target', '_blank');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

});




$('.calculer').click(function(){

    var montant = $('.montant').val();
    var rendement = $('.rendement').val();

    if(montant!=null && montant!=""  && !isNaN(montant) && rendement!=null && rendement!="") {

        localStorage.setItem('montant',montant);
        localStorage.setItem('rendement',rendement);

        if(localStorage.getItem('nom')!=null &&  localStorage.getItem('email')!=null && localStorage.getItem('smsvalide')==1)
        {
            $('.underline .col').removeClass('bg-red');
            $('.underline .col').addClass('bg_darkblue');

            $('.underline .col:last-child').removeClass('bg_darkblue');
            $('.underline .col:last-child').addClass('bg-red');

            $('.sumulateur_content').addClass('d-none');
            $('.part_3').removeClass('d-none');

            calculer();

            $('#rc').text(addCommas(res.Rc)+' €');
            $('#br').text(addCommas(res.Br)+' €');
            $('#ccp').text(addCommas(res.cpp)+' €');

            $('.montant , .rendement').removeClass('hasError');

        }
        else if(localStorage.getItem('smsvalide')==0)
        {
            $('.modal').modal('hide');
            $('#smsfirst').modal('show');
        }
        else
        {
            $('.underline .col').removeClass('bg-red');
            $('.underline .col:first-child').addClass('bg_darkblue');
            $('.underline .col:nth-child(2)').removeClass('bg_darkblue');
            $('.underline .col:nth-child(2)').addClass('bg-red');
            $('.sumulateur_content').addClass('d-none');


            $('.part_1').animateCss('fadeOutLeftBig');
            $('.part_2').removeClass('d-none');
            $('.part_2').animateCss('fadeInRightBig');
            $('.part_1').addClass('d-none');
        }

    }
    else
    {
        if(!(montant!=null && montant!="" && !isNaN(montant) ))
        {
            $('.montant').animateCss('shake');
            $('.montant').addClass('hasError');
        }
        else if(!(rendement!=null && rendement!=""))
        {
            $('.rendement').animateCss('shake');
            $('.rendement').addClass('hasError');
        }
    }
})


function calculer()
{
    var montant =localStorage.getItem('montant');
    var rendement = localStorage.getItem('rendemement');

    var ran = Number(montant) * Number(rendement);
    var rab = ran + ran * 0.12;
    var  fraisgestion = rab - ran;
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var montans=Number(localStorage.getItem('montant'));

    var rans=Number(ran);





    var montant = Number(montant);
    var  rendementnet = Number(rendement);



    for (var i = 2; i <= 6; i++) {

        montant = Number(montant)+ (montant * 0.015);
        rendementnet = Number(rendementnet) + (rendementnet * 0.01);
        ran = montant * rendementnet;
        rab = ran + ran * 0.12;
        fraisgestion = rab - ran;

        montans =Number(montans) + Number(montant);
        rans +=Number(ran);
    }


    var cpp = montant;
    var Br = montans - (localStorage.getItem('montant')*6)  + rans;
    var Rc = Br/6;


    return {'Rc':Rc.toFixed(2) , 'cpp':cpp.toFixed(2) , 'Br':Br.toFixed(2) };;


}



function simuler(nbannes){

    var montant =localStorage.getItem('montant');
    var rendementnet = localStorage.getItem('rendement');



    var ran = Number(montant) * Number(rendementnet);
    var rab = ran + ran * 0.12;
    var fraisgestion = rab - ran;

    var data1 = [];
    var data2 = [];
    var data3 = [];

    data1.push({y:Number(parseFloat(ran).toFixed(2)),label:"Année 1"});
    data2.push({y:Number(parseFloat(rab).toFixed(2)),label:"Année 1"});
    data3.push({y:Number(parseFloat(fraisgestion).toFixed(2)),label:"Année 1"});

    for (var i = 2; i <= nbannes; i++) {
        montant = Number(montant) + (montant * 0.01);
        rendementnet = Number(rendementnet) + (rendementnet * 0.01);
        ran = montant * rendementnet;
        rab = ran + ran * 0.12;
        fraisgestion = rab - ran;

        data1.push({y:Number(parseFloat(ran).toFixed(2)),label:"Année "+i});
        data2.push({y:Number(parseFloat(rab).toFixed(2)),label:"Année "+i});
        data3.push({y:Number(parseFloat(fraisgestion).toFixed(2)),label:"Année "+i});
    }

    chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        backgroundColor: "transparent",
        labelFontColor: "red",
        axisY: {
            title: "Montant en euros (€)",
            valueFormatString: "# €",
            includeZero: true,
            labelFontColor: "#fff",
            titleFontColor: "#fff",
            gridColor: "#fff",
            labelFontFamily: "Signika"
        },
        axisX:{

            labelFontColor: "#fff",
            gridColor: "#fff",
            labelFontFamily: "Signika"
        },
        toolTip: {
            shared: true,
            content: toolTipFormatter,
            backgroundColor: "#0056a6",
            fontFamily: "Signika",
            borderThickness:0,
            cornerRadius: 15,
        },
        title: {
            text: "Récapitulatif sur six ans d'investissement",
            fontColor: "white",
            fontFamily: "Signika",
            fontSize: 25,
            margin: 10
        },
        legend : {
            fontColor: "#fff",
        },
        dataPointWidth: 10,
        data: [{
            type: "column",
            showInLegend: true,
            color:"#ec3143",
            name: 'Frais de gestion',
            dataPoints: data3,
        },
            {
                type: "column",
                showInLegend: true,
                color:"#ffffff",
                name: 'Rente annuelle nette',
                dataPoints: data1
            },
            {
                type: "column",
                showInLegend: true,
                color:"#03206a",
                name: 'Rente annuelle brute',
                dataPoints: data2
            }]
    });

    try
    {
        chart.render();
    }
    catch(ex)
    {

    }

}

function toolTipFormatter(e) {
    var str = "";
    var total = 0 ;
    var str3;
    var str2 ;
    for (var i = 0; i < e.entries.length; i++){
        var str1 = "<span class=\"carre\" style= \"background:"+e.entries[i].dataSeries.color + "\">  </span>  <span class=\"line-height-normal\"  style= \"color:#fff \"> " + e.entries[i].dataSeries.name + "</span> : <strong class=\"color-white font-weight-bold \">"+  e.entries[i].dataPoint.y + " €</strong> <br/> " ;
        total = e.entries[i].dataPoint.y + total;
        str = str.concat(str1);
    }
    str2 = "<strong class=\"color-white\" >" + e.entries[0].dataPoint.label + "  </strong> <br/>";
    // var d = "<div>"+str2.concat(str)+"</div>"
    return ('<div class="opacitygrap">'+str2.concat(str)+'</div>');
}


$('#selectInput').change(function () {

    //console.log(localStorage.getItem('id'));
    //console.log(localStorage.getItem('smsvalide'));

    if ($(this).val() != 0) {

        if(localStorage.getItem('id') != null && localStorage.getItem('smsvalide') == '1'){

            if ($('#selectInput').val() == 1 || $('#selectInput').val() == '1') {
                $('#not-eligible').show();
                $('#eligible').hide();
            } else {
                $('#not-eligible').hide();
                $('#eligible').show();
            }

            $('#response_eligibility').modal('show');

        }

        if((localStorage.getItem('id') == undefined || localStorage.getItem('id') == null) && localStorage.getItem('smsvalide') == undefined
        ){

            $("#selectInputModal").modal('show');

        }

        if(localStorage.getItem('id') != undefined && localStorage.getItem('smsvalide') == 0){
            $('#smsfirst').modal('show');

        }

    }

});


$('.readlink').click(function () {

    var urlhref  = $(this).attr('data-href')

    if(localStorage.getItem('id') != null && localStorage.getItem('smsvalide') == '1'){
        window.href=urlhref
    }else{
        localStorage.setItem('urlhref',urlhref);
    }

});



$('.f1 input').on('keydown',function (event) {

    if (event.keyCode === 13) {
        event.preventDefault();
        $(".calculer").click();
    }


});


$('.f2 input').on('keydown',function (event) {

    if (event.keyCode === 13) {
        event.preventDefault();
        $(".telecharger").click();

    }


});

$('.formPopup input ').on('keydown',function (event) {

    if (event.keyCode === 13) {
        console.log('ok')

        // event.preventDefault();
        $(".telecharger").click();
    }


});

$('.montant:not(.firstmont)').on('keydown',function (event) {

    if (event.keyCode === 13) {
        console.log('ok')

        // event.preventDefault();
        $(".telecharger").click();
    }


});





$('[name=nom] , [name=email] , [name=gsm]').on('keydown',function (event) {

    if (event.keyCode === 13) {
        console.log('ok')

        // event.preventDefault();
        $(".telecharger").click();
    }


});


$('form').on('submit',function (event) {

    return false


});



$('.codegen').on('keydown',function (event) {

    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementsByClassName("valideernumero")[0].click();
    }


});


function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
}
