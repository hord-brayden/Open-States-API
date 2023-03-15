/* wp_enqueue_script( 'fed-search', get_template_directory_uri() . '/inc/js/findfeds.js', array(), '1', true ); */

jQuery(document).ready(function($) {
	console.log('FedFinder JS Standalone Active 0.9854');
   
   /*
	* #input_18_1 address
	* #input_18_2 city
	* #input_18_3 state
	* #input_18_4 zip
	* ALL BELOW SHOULD BE HIDDEN ON LOAD
	* #field_18_5 contains #search-legislators btn
	* #input_18_6 bcc container field
	* #input_18_7 subject line
	* #input_18_8 email body
	* #input_18_9 your email
	* #gform_submit_button_18 submit btn
	*/
   
   var gFormsID = "18";
   // Swap these variables out for whatever targeting that you need.
   var addressHolder = "#input_"+gFormsID+"_1";
   var cityHolder = "#input_"+gFormsID+"_2";
   var stateHolder = "#input_"+gFormsID+"_3";
   var zipHolder = "#input_"+gFormsID+"_4";
   var emailHolder = "#input_"+gFormsID+"_6";
   var resultDiv = "#api-result";

   var u = "";
   // Use this constant to toggle ON/OFF the OpenStatesApiV2 Debugger Console Log Objects
   const debug = true;
   
	 $("#search-legislators").on('click', function(e) {
	   e.preventDefault();
	   
	   //toggle hidden fields
	   $("#input_"+gFormsID+"_6, #input_"+gFormsID+"_7, #input_"+gFormsID+"_8, #input_"+gFormsID+"_9, #gform_submit_button_"+gFormsID+"").show();
		 
	   var api_end_point = "https://civicinfo.googleapis.com/civicinfo/v2/representatives?";
	   var google_api_key = "AIzaSyCJdWNNO0fWUWdGhWbS_55bBSxsCvG_rkc";
		 
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

			 // Build the Info Obj
			 let officialSpitOut = {
			   senator1: response.officials[2].name,
			   senator2: response.officials[3].name,
			   senatorEmail1: response.officials[2].emails,
			   senatorEmail2: response.officials[3].emails,
			   member1:  response.officials[4].name,
			   member2:  response.officials[5].name,
			   memberEmail1:  response.officials[4].emails,
			   memberEmail2:  response.officials[5].emails
			 };
				 
				 if (!officialSpitOut.senatorEmail1) {
				   officialSpitOut.senatorEmail1 = u;
			   }
			   if (!officialSpitOut.senatorEmail2) {
				   officialSpitOut.senatorEmail2 = u;
			   }
			   if (!officialSpitOut.memberEmail1) {
				   officialSpitOut.memberEmail1 = u;
				}
			   if (!officialSpitOut.memberEmail2) {
				   officialSpitOut.memberEmail2 = u;
			   }
			 
			   var infoFill = document.createTextNode(
				   'Your Senator is ' 
				   + officialSpitOut.senator1 
				   + ' their email is ' 
				   + officialSpitOut.senatorEmail1 
				   + ' and your member is ' 
				   + officialSpitOut.member1 
				   + ' and their email is ' 
				   + officialSpitOut.memberEmail1);

			   var result = $("<div></div>");
			   $(resultDiv).append(result);
				 debug === true ? $(resultDiv).html(infoFill) : "";
				 $(emailHolder).val(officialSpitOut.senatorEmail1 + ', '
				   + officialSpitOut.senatorEmail2 + ', '
				   + officialSpitOut.memberEmail1 + ', '
				   + officialSpitOut.memberEmail2);
			 }
	   });
  }); // End Button On click
});  