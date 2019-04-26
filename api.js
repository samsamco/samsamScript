
//---------twilio sms-------

function sendSms_Api(code,gsm) {

    result=false
    
    $.ajax({

        url:"https://payez-dimpot.fr/sms/web/api/send-sms",
        method:"post",
        data:{"code":code,"phone":gsm},
        success:function(data){
            if(data.status){
                result=data.status
            }
        },
        error:function(error){

        }
    });

    return result

}


//---------tracking-------

function sendTracking_Api(Userip,ViewID) {

    Token = new Date().getTime();

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', ViewID, {
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
