console.log('Open States v2 JS sheet is loaded.');

jQuery(document).ready(function($) {

    // Legacy form presets
    //$("#input_19_6,#input_19_7").prop('disabled', true);
    //$("#gform_wrapper_3 .gform_footer").hide(0);

    // Define Google Map Variables to string join input Google Maps API
    let map_query_vars = {
        // Address
        address: '#input_19_1',
        // City
        city: '#input_19_2',
        // State
        state: '#input_19_6',
        // Zipcode
        zip: '#input_19_4',
    };

    // Define Form Elements to Hide on page load, and reveal on "Lookup Click"
    const hidden_elements = [
        '#gform_submit_button_6',
        '#meet-your-reps',
        '#field_19_11',
        '#field_19_12',
        '#field_19_14',
        '#field_19_13',
        '#field_19_15',
        '#field_19_16',
        '#field_19_18',
        '#field_19_17',
        '#field_19_19',
    ];

    // Define BCC Input Element
    const bcc = '#input_19_19';

    // Google Maps API Key
    const google_key = 'AIzaSyBn8qk06cqO9Qjk28Rc8ODFDJHSA1NJcmE';
    // This Open States API Key is not used here, only in the PHP File, here for temp reference
    const open_states_key = '7d891cbc-bdf8-4a11-9480-b88512b9098d';
    // Use this constant to toggle ON/OFF the OpenStatesApiV2 Debugger Console Log Objects
    const debug = true;

    // Function: Open States API V2
    function OpenStatesApiV2(google_key, map_query_vars, hidden_elements, bcc = false, debug = false) {

        debug === true ? console.log('Developer Mode: Open State API V2 Initiated') : '';

        // Hide Elements
        HideElements(hidden_elements);

        if(google_key && map_query_vars) {
            let map_query = [
                // Address
                $(map_query_vars.address).val(),
                // City
                $(map_query_vars.city).val(),
                // State
                $(map_query_vars.state).val(),
                // Zipcode
                $(map_query_vars.zip).val(),
            ];

            debug === true ? console.log(map_query.join(', ')) : '';

            // Clear BCC Input Value
            $(bcc).val('');

            // Define Google Maps Variables
            let google_uri = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
            let location = map_query.join(', ');
            let map_path = encodeURI(google_uri + location + '&key=' + google_key);

            // Init Google Maps API Call
            $.get(map_path, function(data){
                // Define Latitude & Longitude Coordinates
                let coords = {
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng
                };

                // Define Open States API URI, Query Object String, and Query URI (Used only in PHP action)
                let api_uri = `https://openstates.org/graphql`;
                // The GraphQL Query Object
                let query = `query={`
                                + `people(latitude: ${coords.lat}, longitude: ${coords.lng}, first:100) {`
                                    + `edges { `
                                        + `node { `
                                            + `id name sortName familyName givenName image `
                                            + `contactDetails {type value note label} `
                                            + `currentMemberships {organization {classification name} }`
                            +`} } } }`;
                // URI Encode the GraphQL Query to be used in PHP API Call
                let query_uri = encodeURI(query);

                let open_states_request = {
                    url: ajax_open_states,
                    method: 'POST',
                    data: {
                      action: 'open_states_api',
                      query: query
                    },
                };

                // Init Open States v2 API GET Request
                $.ajax(open_states_request).success(function(data) {

                    let json_data = JSON.parse(data);

                    debug === true ? console.log({data: data, json_data: json_data, edges: json_data.data.people.edges}) : '';

                    let reps = json_data.data.people.edges;

                    // Purge old results
                    $('#api-result ul.result-list').empty()

                    // Loop through, build, and append new results
                    $.each(reps, function(index, rep) {

                        let contact_details = rep.node.contactDetails;
                        let current_memberships = rep.node.currentMemberships;

                        // Legislator Object
                        let xrep = {
                            name:     rep.node.name,
                            img:      rep.node.image,
                            email:    function() {
                                          var set_email = '';
                                          for(c=0; c<contact_details.length; c++) {
                                              if(contact_details[c].type == 'email') {
                                                  set_email = contact_details[c].value; break;
                                              }
                                          }
                                          //console.log({set_email: set_email});
                                          return set_email;
                                      },
                            party:    function(){
                                          var set_party = '';
                                          for(m=0; m<current_memberships.length; m++) {
                                              if(current_memberships[m].organization.classification == 'party') {
                                                  set_party = current_memberships[m].organization.name; break;
                                              }
                                          }
                                          //console.log({set_party: set_party});
                                          return set_party;
                                      }
                        };

                        let xrep_party = xrep.party();
                        let xrep_email = xrep.email();

                        debug === true ? console.log({xrep: xrep, email: xrep_email, party: xrep_party }) : '';

                        // Legislator Markup
                        let xrep_markup = `<li class="active-rep col-md-6 animated ">`
                                              +`<div class="rep-wrap ">`
                                                  +`<div class="rep-wrap-inner row">`
                                                      +`<div class="rep-picture col-xs-12 col-sm-4 col-lg-4 text-center">`
                                                          +`<div class="rep-pic-wrap">`
                                                              +`<img src="${xrep.img}" style="width:350px;" onerror="this.onerror=null;this.src='https://via.placeholder.com/300/?text=${encodeURI(xrep.name)}'">`
                                                          +`</div>`
                                                      +`</div>`
                                                      +`<div class="rep-info col-xs-12 col-sm-8 col-lg-8">`
                                                          +`<div class="row">`
                                                              +`<h3>${xrep.name}</h3>`
                                                          +`</div>`
                                                          +`<div class="row">`
                                                              +`<span class="party-badge label label-primary">${xrep_party}</span>`
                                                              +`<p><em>${xrep_email}</em></p>`
                                                          +`</div>`
                                                      +`</div>`
                                                  +`</div>`
                                              +`</div>`
                                          +`</li>`;

                        // Append Legislator Markup
                        $('#api-result ul.result-list').append(xrep_markup);

                        // Append Email to BCC Field
                        let bcc_current_val = $(bcc).val();
                        // Only Append the Email if it is not empty "" so it does not accidentally inject an extra comma separator
                        /* Still needs some work to eliminate the comma at the end of the string, since it appends it after every email, and gForms won't accept emails formatted like {your_email_field_1919} test@test.com. It needs a comma seperator to parse with their email validation */
                        xrep_email != "" ? $(bcc).val(bcc_current_val + xrep_email + ',') : '';
                    });

                    // Reveal Hidden Elements
                    RevealHiddenElements(hidden_elements);
                });

            });
        }
    } // End Function: OpenStatesApiV2()

    // Hide Elements in the Form
    function HideElements(elementsToHide) {
        $.each(elementsToHide, function(index, elementSelector) {
            $(elementSelector).addClass('hide hidden');
        });
    }

    // Reveal Elements in the Form (callback to onClick function below)
    function RevealHiddenElements(hiddenElements) {
        $.each(hiddenElements, function(index, elementSelector) {
            $(elementSelector).removeClass('hide hidden');
        });
    }

    // Init: Hide Elements in the Form
    HideElements(hidden_elements);

    $('#search-legislators').on('click', function(e) {
        // Run it!!!
        OpenStatesApiV2(google_key, map_query_vars, hidden_elements, bcc, debug);
    });

});
