jQuery(document).ready(function($) {
  console.log('FedFinder JS Standalone Active 1.52 -- BASIC email');
   
	// Use this constant to toggle ON/OFF the OpenStatesApiV2 Debugger Console Log Objects
	const debug = true;
   
   /* Be sure to map your buttons correctly!! */
   // Swap these variables out for whatever targeting that you need.
   var gFormsID = "22";
   var api_end_point = "https://civicinfo.googleapis.com/civicinfo/v2/representatives?";
   var google_api_key = "AIzaSyCJdWNNO0fWUWdGhWbS_55bBSxsCvG_rkc";
   var resultDiv = "#api-result";
   var searchBtn = "#search-federal";
   
   // Only adjust these values if you know what you're doing!
   var emails = [];
   var addressHolder = "#input_"+gFormsID+"_1";
   var cityHolder = "#input_"+gFormsID+"_2";
   var stateHolder = "#input_"+gFormsID+"_6";
   var zipHolder = "#input_"+gFormsID+"_4";
   var emailHolder = "#input_"+gFormsID+"_19";

   /* COMMENT OUT THE LINE BELOW TO SEE THE RECIPIENT LIST on the frontend! */
   $("#input_"+gFormsID+"_19").hide();
   
   
     $(searchBtn).on('click', function(e) {
       e.preventDefault();
       /* Hides all the fields, until they click the look up button */
       $("#input_"+gFormsID+"_14").show();
       //jQuery("#input_22_19").val(jQuery("#input_19_19").val() + 'email@email.x.gov'); - Way to manually append
       $("#input_"+gFormsID+"_13").show();
       $("#input_"+gFormsID+"_15").show();
       $("#input_"+gFormsID+"_16").show();
       $("#input_"+gFormsID+"_17").show();
       $("#field_"+gFormsID+"_17").show();
       $("#field_"+gFormsID+"_14").show();
       $("#input_"+gFormsID+"_19").show();
       $("#gform_submit_button_"+gFormsID+"").show();
       
       //toggle hidden fields
       $("#input_"+gFormsID+"_6, #input_"+gFormsID+"_7, #input_"+gFormsID+"_8, #input_"+gFormsID+"_9, #gform_submit_button_"+gFormsID+"").show();
              
           var address = jQuery(addressHolder).val();
           var city = jQuery(cityHolder).val();
           var state = jQuery(stateHolder).val();
           var zip = jQuery(zipHolder).val();
         
       var fulladdress = "address=" + address + " " + city + ", " + state + " " + zip;
       var address_encoded = encodeURI(fulladdress);
       var api_path = api_end_point + address_encoded + "&key=" + google_api_key;
       debug === true ? console.log(api_path): '';
       debug === true ? console.log(fulladdress): '';
       $.ajax({
         type: "GET",
         url: api_path,
         dataType: "json",
         error: function(e) {
           console.log(e);
         },
         success: function(response) {
            debug === true ? console.log("Response", response) : '';
               officials = response.officials;
               offices = response.offices;

               for (var i = 0, len = officials.length; i < len; i++) {
                for (var j = 0, len2 = offices.length; j < len2; j++) {
                  if (offices[j].officialIndices.indexOf(i) !== -1) {
                    var officeObj = {};
                    for (var key in offices[j]) {
                      if (key !== 'officialIndices')
                        officeObj[key] = offices[j][key];
                    }
                    officials[i].office = officeObj;
                    break;
                    }
                  }
                }
                var email_success = [];
               for ( var i = 0; i < officials.length; i++ ) {
                   if (!officials[i].emails) {officials[i].emails = '';}
                    else {
                    emails[i] = officials[i].emails;
                    email_success.push(i);
                    }
                   }
               debug === true ? console.log(email_success) : '';


               for (var i = 0; i < email_success.length; i++) {
                var j = email_success[i];
                var off = response.officials[j].name;
                var posit = response.officials[j].office.name;
                var positoffcombine = off+' - '+posit+', ';
                $(resultDiv).append(positoffcombine);
                debug === true ? console.log(posit) : '';
               }                   

                   
                    var emailsNew = emails.filter(function (el) {
                       return el != null && el != "";});

                   $(emailHolder).val(emailsNew);
             }
       });
  }); // End Button On click
});  