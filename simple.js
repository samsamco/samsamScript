
function testfunctions() {

     alert($('#exampleInputEmail1').val())

}


function telverification_Api(tel) {

}

function checkUser_Api(yurl) {
    

    if(localStorage.getItem("wcxvfdsvfdko_registred")==1)
    {

        window.location.href=yurl;
    }
    else if(localStorage.getItem("wcxvfdsvfdko_registred")==2)
    {
        $('#smsfirst').show();
    }
    else
    {
        $('#form-total-p-0 .tranchebtn').removeClass('activetrache');
        $(elm).addClass('activetrache');

        $('#form-total-p-0').animateCss('fadeOutLeftBig');
        $('#form-total-p-1').show();
        $('#form-total-p-1').animateCss('fadeInRightBig');
        $('#form-total-p-0').hide();
        $('#form-total-t-0').addClass('coloredline');
        $('.steps ul li:nth-child(2)').addClass('current');
    }

}


function checkIfAnalytics() {

    if(window.ga && ga.create) {
        return 1;
    } else {
        return 0;
    }
}


//---------animations-------

$.fn.extend({
    animateCss: function(animationName, callback) {
        var animationEnd = (function(el) {
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

        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    }
});



//---------validSms_Api-------

function validSms_Api() {

    var codegen = Math.floor(1000 + Math.random() * 9000);

    if(localStorage.getItem('nbrTentatif')<=3)
    {
        $.ajax({
            url:"https://payez-dimpot.fr/sms/web/api/send-sms",
            method:"post",
            data:{"code":lead.codegen,"phone":lead.tel.replace(/^0/gi,"+33")},
            success:function(data){
                if(data.status)
                {
                        localStorage.setItem("smssent",true);
                        localStorage.setItem("smsvalide",false);
                        localStorage.setItem("nombre",Number(lead.nombre)+1);
                        localStorage.setItem("codegen",lead.codegen);
                        localStorage.setItem("source",lead.source);

                }
                else
                {
                    $('.errorwrapper2').text('Veuillez entrer un numéro de téléphone valide');
                }
            },
            error:function(error){
                $('.errorwrapper2').text('Erruer interne.Veuillez réessayer');
            }
        });
    }
    else
    {
        $('.errorwrapper2').text('Vous ne pouvez pas envoyer plus que 3 code');
    }
}




//---------valid ChekvalidLead-------

function ChekvalidLead(urly) {

    var codegend = $('.codegen').val();
    if(!isNaN(codegend))
    {
        if(codegend == lead.codegen)
        {

            // data: {"setsms": true, "smssent": true,"smsvalide":true},

            if (localStorage.getItem('source')=='simulateur') {
                $('.valideernumero').closest('.sms').modal('hide');
            }
            else
            {
                if (localStorage.getItem('source')=='chargement') {
                    $('.valideernumero').closest('.sms').modal('hide');
                    var element = document.createElement('a');
                    element.setAttribute('href', urly+'/livres/Guide-loi-Pinel.pdf');
                    element.setAttribute('download', 'Guide-loi-Pinel.pdf');
                    element.setAttribute('target', '_blank');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
                else  {
                    $('.valideernumero').closest('.sms').modal('hide');
                    $('#exampleModalCenter3').modal('show');
                }
            }
        }

    }
    
}




function chnagernumero(){

    var codegen = Math.floor(1000 + Math.random() * 9000);
    lead.codegen=codegen;

    lead.tel=$('.newphone').val();

    $('.errorwrapper2').html('');

    $.ajax({
        url:"https://payez-dimpot.fr/sms/web/api/send-sms",
        method:"post",
        data:{"code":lead.codegen,"phone":lead.tel.replace(/^0/gi,"+33")},
        success:function(data) {
            if (data.status) {
                        localStorage.setItem("smssent",true);
                        localStorage.setItem("smsvalide",false);
                        localStorage.setItem("nombre",Number(lead.nombre)+1);
                        localStorage.setItem("codegen",lead.codegen);
                        localStorage.setItem("source",lead.source);
            }
        }
    })
    $('#smsfirst').modal('hide');
    $('#smssecond').modal('show');
}



function validerChangementTel_Api(){

    var telv =  $('#smssecond .phonenumber').val();
    var codegen = Math.floor(1000 + Math.random() * 9000);
    lead.codegen=codegen;

    if(telv!=lead.tel)
    {
        //il faut les inverser
        $.ajax({
            url: "https://www.labanquedelimmobilier.net/landing/landing_rachid.php",
            type: "post",
            data: {"updatetel": 1,"tel":telv,"id":lead.id},
            success: function (data) {
                if(data.registred)
                {
                    lead.tel=telv;
                    $.ajax({
                        url: "https://payez-dimpot.fr/sms/web/api/send-sms",
                        method: "post",
                        data: {"code": lead.codegen, "phone": telv.replace(/^0/gi, "+33")},
                        success: function (data) {
                            if (data.status) {

                                $('.renvoyer2').closest('.sms').modal('hide');
                                $('#smsfirst').modal('show');
                            }
                        }
                    })
                }
                else if(data.err==2)
                {
                    $('.errorwrapper').text('Vous avez déja envoyé par ce numéro de téléphone ');
                    /*Swal.fire({
                        text: 'Vous avez déja envoyé par ce numéro de téléphone ',
                        type: 'error',
                        confirmButtonText: 'Fermer'
                    })*/
                }
            }
        })
    }
    else {
        if(lead.nombre<3)
        {
            $.ajax({
                url: "https://payez-dimpot.fr/sms/web/api/send-sms",
                method: "post",
                data: {"code": lead.codegen, "phone": telv.replace(/^0/gi, "+33")},
                success: function (data) {
                    if (data.status) {
                        $('.renvoyer2').closest('.sms').modal('hide');
                        $('#smsfirst').modal('show');
                    }
                }
            })
        }
        else
        {
            $('.errorwrapper').text('Vous avez déja envoyé par ce numéro de téléphone ');

        }
    }
}


function Send_lead(view_id,id_site){

    var form = $(this).closest('form').get(0);

    var patt = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var re = /^((\+)33|0)(6|7)(\d{2}){4}$/g;

    var nom = form.nom.value!=null && form.nom.value.trim() !="" ? form.nom.value:null;
    var email = form.email.value!=null && form.email.value.trim() !="" && patt.test(form.email.value) ? form.email.value:null;
    var gsm = form.gsm.value!=null && form.gsm.value.trim() !="" && re.test(form.gsm.value)  ? form.gsm.value:null;
    var tranche =form.tranche.val();
    

    valide=false;

    if(email!=null)
    {
        $('.emailerror').text('');
        valide=true;
    }
    else
    {
        $('.emailerror').text('L\'adresse email n\'est pas valide');
        valide=false;
    }

    if(gsm!=null)
    {
        $('.telerror').text('');
        if(valide)
            valide=true;
    }
    else
    {
        $('.telerror').text('Le numéro de téléphone n\'est pas valide');
        valide=false;
    }

    if(nom!=null)
    {
        $('.nomerror').text('');
        if(valide)
            valide=true;
    }
    else
    {
        $('.nomerror').text('Le nom n\'est pas valide');
        valide=false;
    }

    lead.nom = nom;
    lead.tel = gsm;
    lead.email = email;
    lead.source = "Simulateur Pinel";
    lead.tranche=tranche;

    if(valide) {

            if_traking_exist = checkIfAnalytics();

        if(!(/test/i.test(lead.nom))) {


            if(if_traking_exist==1) {
                $.ajax({
                    url: "https://payez-dimpot.fr/analytics/web/insert-lead",
                    method: "post",
                    data: {
                        "client_id": ga.getAll()[0].get('clientId'),
                        "name": lead.nom,
                        "email": lead.email,
                        "phone": lead.tel,
                        "view_id": view_id,
                        "id_site": id_site
                    },
                    success: function (data1) {

                    }
                })
            }



            $.ajax({
                url:"https://www.labanquedelimmobilier.net/landing/set_lead.php",
                type:"post",
                data:{"nom":lead.nom,"tel":lead.tel,"email":lead.email,"tranche":lead.tranche,"from":lead.source, "view_id": 193175857,"client_id":if_traking_exist},
                success:function(data) {
                    if (data.registred) {

                        $('.svgcontainer').html('<div id="wrapper"><div class="profile-main-loader"><div class="loader">'+
                            '<svg class="circular-loader" viewBox="25 25 50 50" >'+
                            '<circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#70c542" stroke-width="2" />'+
                            '</svg>'+
                            '</div>'+
                            '</div>'+
                            '</div>');

                        $('.buttonscontainer').hide();
                        var id =data.id;
                        var codegen = Math.floor(1000 + Math.random() * 9000);
                        lead.codegen=codegen;

                        sendSms_Api(codegen,lead.tel)
    
                    }
                    else if(data.err==2)
                    {
                        $('.svgcontainer').html('');
                        $('.buttonscontainer').show();
                        $('.telerror').text('Ce numéro de téléphone est déjà utilisé');
                    }
                }
            })


        }
    }

}


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

function montant_keyup(event){

    if(event.keyCode==13)
    {
        montant = $('.montant').val().replace("€", "").trim();
        if(montant!="" && montant!=null && !isNaN(montant))
        {
            $('.montant').removeClass('hasError');

            if(montant<2000)
            {
                Swal.fire({
                    text: 'Vous ne pouvez pas économiser moins de 2000 € d\'impôt par an ',
                    type: 'error',
                    confirmButtonText: 'Fermer'
                })
            }
            else{
                calc();
            }
        }
        else
        {
            Swal.fire({
                text: 'Veuillez insérer une valeur valide ',
                type: 'error',
                confirmButtonText: 'Fermer'
            })
        }
    }
    else if(event.keyCode>=97 && event.keyCode<=105)
    {
        console.log(event.keyCode);
        /* $(this).val($(this).val().replace("€", "").trim()+" €");*/
    }
}



function ClosePop(event){
    event.preventDefault();

    $('.modal').modal('hide');
    $(".modal-backdrop").remove();
    $('.modal').find('form input:not([type=button])').closest('.input-group').removeClass('hasError');
    $('.modal').find('form select').closest('.input-group').removeClass('hasError');
    $('.modal').find('form select').val('');
    $('.modal').find('form input:not([type=button])').val('');
}


function calc() {
    var b = montant / .02;
    var n = montant * 9;

    /*   if ($('#ment').val() == 25) {*/
    var d = ((b * 1.45) / 25) / 12;
    var e = (b * .027) / 12;
    var men = (d - e - (montant / 12));
    /*} else if ($('#ment').val() == 20) {
        var d = ((b * 1.32) / $('#ment').val()) / 12;
        var e = (b * .027) / 12;
        var men = (d - e - (montant / 12));
    } else if ($('#ment').val() == 15) {
        var d = ((b * 1.23) / $('#ment').val()) / 12;
        var e = (b * .027) / 12;
        var men = (d - e - (montant / 12));
    }*/

    document.getElementById("total").innerHTML = addCommas(Number(b)) + " €";
    document.getElementById("tip").innerHTML = addCommas(Number(n).toFixed()) + " €";
    document.getElementById("epargne").innerHTML = addCommas(Number(men).toFixed()) + " €";
    document.getElementById("loca").innerHTML = addCommas(Number(e).toFixed()) + " €";
}



function calculerButton () {

    montant = $('.montant').val().replace("€", "").trim();

    if(montant!="" && montant!=null && !isNaN(montant))
    {
        if(montant<2000)
        {
            Swal.fire({
                text: 'Vous ne pouvez pas économiser moins de 2000 € d\'impôt par an ',
                type: 'error',
                confirmButtonText: 'Fermer'
            })
        }
        else{

            calc();
        }
    }
    else
    {
        Swal.fire({
            text: 'Veuillez insérer une valeur valide ',
            type: 'error',
            confirmButtonText: 'Fermer'
        })
    }
}


$('.modal').on('hidden.bs.modal', function () {
    clicked=false;
    $('.modal').find('form input:not([type=button])').closest('.input-group').removeClass('hasError');
    $('.modal').find('form select').closest('.input-group').removeClass('hasError');
    $('.modal').find('form select').val('');
    $('.modal').find('form select').removeAttr('size');
    $('.modal').find('form input:not([type=button])').val('');
});


function telecharger(event) {

    var clicked = $(this);

    if (localStorage.getItem('smssent') == true && localStorage.getItem('smsvalide') == true) {

        var element = document.createElement('a');
        element.setAttribute('href', 'https://loi.pinel-2019-gouv.fr/public/livres/Guide-loi-Pinel.pdf');
        element.setAttribute('download', 'Guide-loi-Pinel.pdf');
        element.setAttribute('target', '_blank');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element); 

    }else if(localStorage.getItem('smssent') == true && localStorage.getItem('smsvalide') == false){

        $('#smsfirst').modal('show');

    
    }else if(localStorage.getItem('smssent') == false && localStorage.getItem('smsvalide') == false){


        var from = clicked.text();
        if (/Obtenir/i.test(from)) {
            $('#modalebook form input[name=from]').val('Téléchargement : Le boutton obtenir');
            $('#modalebook form input[type=submit]').val('Obtenir le livre');
            $('#modalebook  h5').html('Obtenez votre livre gratuitement');
        }
        if (/Lire en ligne/i.test(from)) {
            $('#modalebook form input[name=from]').val('Téléchargement : Le boutton lire en ligne');
            $('#modalebook form input[type=submit]').val('Lire en ligne');
            $('#modalebook h5').html('Lire en ligne votre livre gratuitement');
        }
        if (/Découvrir/i.test(from)) {
            $('#modalebook form input[name=from]').val('Téléchargement : Le boutton Découvrir');
            $('#modalebook form input[type=submit]').val('Découvrez');
            $('#modalebook h5').html('Informez-vous sur la loi pinel');
        }
        if (/En savoir plus/i.test(from)) {
            if ($(this).is("a")) {
                if ($(this).closest('.d-flex').find('h5') != null && $(this).closest('.d-flex').find('h5').text() != "") {
                    $('#modalebook form input[name=from]').val('Téléchargement : lien de savoir plus sur (' + $(this).closest('.d-flex').find('h5').text() + ')');
                }
            }
            else if ($(this).is("button")) {

                $('#modalebook form input[name=from]').val('Téléchargement : le button de savoir plus ');
            }

            $('#modalebook form input[type=submit]').val('En savoir plus');

            $('#modalebook h5').html('Informez-vous sur la loi pinel');

        }
        if (/ebook_pinel.png/i.test($(this).attr('src'))) {
            $('#modalebook form input[name=from]').val('Téléchargement : Image ebook pinel ');
            $('#modalebook form input[type=submit]').val('Télécharger');
            $('#modalebook h5').html('Téléchargez votre livre gratuitement');
        }

        $('#modalebook').modal('show');
    
    }

}




