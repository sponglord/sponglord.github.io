<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Checkout SDK Test</title>
    <script src="test/lib/jquery-2.1.4.min.js"></script>
    <script src="dist/checkoutSDK.1.2.3.js"></script>
    <script src="./src/utils/apple-pay-stubs.js"></script>
<!--    <script type="text/javascript" src="http://localhost:8080/checkoutshopper/assets/js/sdk/checkoutSDK.1.2.3.js"></script>-->
<!--    <script src="https://checkoutshopper-test.adyen.com/checkoutshopper/assets/js/sdk/checkoutSecuredFields.1.1.1.js"></script>-->

    <style>
        h1{
            margin: 0px;
            font-family: "Open Sans", sans-serif;
            font-size: 25px;
        }

        body {
            margin: 0;
        }

        .my-pay-btn{
            margin-top: 20px;
            display: block;
        }

        .container {
            margin: 0 auto;
            width: 40%;
        }

        #webshopTitle {
            font-family: apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        }

        @media only screen and (max-width: 667px) {
            .container {
                width: 100%;
            }
        }

        .chckt-sdk {
            padding-bottom: 40px;
        }

    </style>
</head>
<body>
    <div class="container">
        <h1>Checkout SDK v1.9.9.9 (NOT 2)</h1>

        <?php

            include './test/php/config.php';

            if ($testingAgainstLocalHost) {
                print '<div>Testing against: <span class="local">http://localhost:8080</span></div>';

            } else {
                print '<div>TESTING AGAINST:  <span class="test">https://checkout-test.adyen.com</span></div>';
            }
        ?>

        <h2 id="webshopTitle">Details</h2>
        <input type="text" id="descTxt" value="Basket value:" readonly style="width: 90px; border:none;"/>
        <input type="text" id="amtTxt" value="79" style="width: 30px;"/>
        <input type="text" id="curTxt" value="EUR" style="width: 40px; "/>
        <input type="button" id="payBtn" class="my-pay-btn" value="Proceed to Checkout"/>
        <input type="hidden" id="merchantInfo" data-skin="handlebars" data-shopper-ref="nick spong" data-merchant-account="TestMerchant"/>
        <div id="adyenPaymentDiv" class="adyen-payment-div"></div>
    </div>

        <script type="text/javascript">

            var $ = jQuery;// for IE8

            $(document).ready(function() {

                $('#payBtn').on('click', function(){

                    var merchantInfo = $('#merchantInfo');

                    // Set this up on the server later on
                    var dataObj = {
                        skin: merchantInfo.attr("data-skin"),
                        shopperReference: 'ashopper',
                        countryCode : 'NL',
                        do3DS2: undefined,
                        shopperLocale : 'NL',
                        merchantAccount : merchantInfo.attr("data-merchant-account"),
                        amount : $('#amtTxt').val(),
                        currency : $('#curTxt').val()
                    };

                    // Create style object
                    var style = {
                        base: {
                            color: '#000',
                            fontSize: '14px',
                            lineHeight: '14px',
                            fontSmoothing: 'antialiased'
                            // unacceptedBaseValue: 'This will not get parsed'

                        },

                        error: {
                            color: 'red'
                        },

                        placeholder: {
                            color: '#d8d8d8'
                        },

                        validated: {
                            color: 'green'
                        }
                    };

                    window._b$dl = true;// Force logging, even if loading SDK from test

                    $.ajax({
                        url: 'test/php/setupPayments.php',
                        data: dataObj,
                        dataType: 'json',
                        method: 'POST',// jQuery > 1.9
                        type: 'POST', //jQuery < 1.9
                        success: function(data){

                            // Vn >= 1.2.0
                            var translationObject = {
                                 "paymentMethods.moreMethodsButton" : {
                                     "nl_NL" : "Ik wil meer",
                                     "fr_FR" : "Je voudrais plus"
                                 },
//                                 "creditCard.expiryDateField.title" : {
//                                     "nl_NL" : "Vervalt niet"
//                                 },
//                                 "idealIssuer.selectField.placeholder" : {
//                                     "nl_NL" : "Kies Issuer",
//                                     "fr_FR" : "Choisir"
//                                 },
//                                  "payButton" : {
//                                      "nl_NL" : "Ik wil graag betalen"
//                                  },
//                                 "creditCard.expiryDateField.placeholder" : {
//                                     "nl_NL" : "mm/yy"
//                                 }
                            };

                            // Vn >= 1.2.0
                            var sdkConfigObj = {
                                consolidateCards : true
                               ,context : 'test'
                                ,translations : translationObject
                                ,paymentMethods : {
                                    card : {
                                        sfStyles : style
                                        ,placeholders : {
                                            hostedSecurityCodeField: '111'
                                        }
                                    }//,
                                }
                            }

                            //Call adyen checkout and Send style object together with payment object to adyen checkout
                            var checkout = chckt.checkout(data, '#adyenPaymentDiv', sdkConfigObj);


                            // EXAMPLE OF ADDING 'REMOVE CARD' BUTTON TO RECURRING CARD PAYMENT METHOD
                            var addRemoveRecurringBtns = function(){

                                var recurringCardsArray = chckt.getRecurringCards();

                                recurringCardsArray.forEach(function(item){

                                    var holder = item.node.querySelector('.chckt-pm__recurring-details');

                                    var btn = document.createElement( 'input' );
                                    btn.type = 'button';
                                    btn.value = 'forget this card';

                                    btn.style.position = 'absolute';
                                    btn.style.left = '0px';
                                    btn.style.bottom = '0px';
                                    btn.style.cursor = 'pointer';
                                    btn.style['background-color'] = '#99c';

                                    holder.appendChild(btn)

                                    var resultCallback = function(error, response, cardType){

                                        if(!error){
                                            chckt.reRenderPMList();
                                            addRemoveRecurringBtns();
                                        }
                                    }

                                    btn.onclick = function(){

                                        chckt.disableRecurringContract(item.paymentMethodData, item.type, resultCallback)
                                    };
                                });
                            }

                            if(typeof chckt.getRecurringCards === 'function'){
                                addRemoveRecurringBtns();
                            }


                            $('#descTxt').remove();
                            $('#amtTxt').remove();
                            $('#curTxt').remove();
                            $('#payBtn').remove();
                            $('#webshopTitle').text('CHECKOUT');

                        },
                        error : function(){

                            if(window.console && console.log){
                                console.log('### adyenCheckout::error:: args=',arguments);
                            }
                        }
                    });

                });

                $('#payBtn').click();// FOR TESTING - JUMP STRAIGHT TO CHECKOUT PAGE

            });


            chckt.hooks.moreDetailsRequired = function(pExplanation, pExtraData){

                if(window.console && window.console.log){
                    window.console.log('### index::chckt.hooks.moreDetailsRequired:: pExplanation=',pExplanation);
                }

                return new Promise(function (resolve, reject) {

                    var xhr = new XMLHttpRequest();

                    // URL to call on Merchant server providing a POST endpoint to obtain a Merchant Session for Apple Pay.
                    // Merchant validation is always carried out server side rather than on the client for security reasons.
                    xhr.open('POST', 'https://magento-21-rik.seamless-checkout.com/index.php/rest/V1/adyen/request-merchant-session');// method, url

                    xhr.onload = function () {

                        if (this.status >= 200 && this.status < 300) {

                            resolve(JSON.parse(xhr.response));

                        } else {

                            reject({

                                status: this.status,
                                statusText: xhr.statusText
                            });
                        }
                    };

                    xhr.onerror = function () {

                        if(window.console && window.console.log){
                            window.console.log('### applePay::onerror:: xhr.statusText=',xhr.statusText);
                            window.console.log('### applePay::onerror:: xhr.status=',xhr.status);
                        }

                        reject({

                            status: this.status,
                            statusText: xhr.statusText
                        });
                    };

                    xhr.setRequestHeader("Content-Type", "application/json");

                    const params = JSON.stringify({url: pExtraData.url});

                    xhr.send(params);
                });
            };

        </script>
</body>
</html>
