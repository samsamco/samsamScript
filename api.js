//---------tracking------

function sendTracking_Api(Userip,ID_google_analytic) {

    Token = new Date().getTime();

    console.log(Userip+" "+ID_google_analytic+" "+Token)

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', ID_google_analytic, {
        'custom_map': {
            'dimension1': 'clientId',
            'dimension2': 'Token',
            'dimension3': 'Userip',
            'metric1': 'avg_page_load_time'
        }
    });

    gtag('event', 'Step0', {'Token': Token ,'Userip': Userip, 'avg_page_load_time': 1});
}



//---------Adword conversion-------

function sendAdConversion_Api(Id_adword_conversion) {


    gtag('event', 'conversion', {'send_to': Id_adword_conversion});

}

//---------EVENT conversion-------


// $('.telecharger').click(function () {



// })









