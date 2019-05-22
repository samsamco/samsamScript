//---------tracking------

function sendTracking_Api(Userip,ID_google_analytic) {

    // Token = new Date().getTime();

    console.log(Userip+" "+ID_google_analytic+" "+Token)

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', ID_google_analytic, {
        'custom_map': {
            'dimension1': 'Token',
            'dimension2': 'Token',
            'dimension3': 'Userip',
            'metric1': 'avg_page_load_time'
        }
    });

    gtag('event', 'Step0', {'Token': Token ,'Userip': Userip, 'avg_page_load_time': 1});
}



//---------Adword conversion-------

function sendAdConversion_Api(Id_adword_conversion) {

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '{{ Id_adword_conversion }}');
    gtag('event', 'conversion', {'send_to': Id_adword_conversion});


}

// ---------Facebook conversion-------


function sendFbConversion_Api(ID_faceboo_Ad ) {

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('track', 'Purchase', {currency: "USD", value: 477.00});


}


//---------EVENT conversion-------


// $('.telecharger').click(function () {



// })









