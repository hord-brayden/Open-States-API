<script>
      /**
       * Build and execute request to look up voter info for provided address.
       * @param {string} address Address for which to fetch voter info.
       * @param {function(Object)} callback Function which takes the
       *     response object as a parameter.
       */
       function lookup(address, callback) {
       /**
         * Election ID for which to fetch voter info.
         * @type {number}
         */
        var electionId = 2000;
 
        /**
         * Request object for given parameters.
         * @type {gapi.client.HttpRequest}
         */
        var req = gapi.client.request({
            'path' : '/civicinfo/v2/voterinfo',
            'params' : {'electionId' : electionId, 'address' : address}
        });
       req.execute(callback);
      }

      /**
       * Render results in the DOM.
       * @param {Object} response Response object returned by the API.
       * @param {Object} rawResponse Raw response from the API.
       */
      function renderResults(response, rawResponse) {
        var el = document.getElementById('results');
        if (!response || response.error) {
          el.appendChild(document.createTextNode(
              'Error while trying to fetch polling place'));
          return;
        }
        var normalizedAddress = response.normalizedInput.line1 + ' ' +
            response.normalizedInput.city + ', ' +
            response.normalizedInput.state + ' ' +
            response.normalizedInput.zip;
        if (response.pollingLocations.length > 0) {
          var pollingLocation = response.pollingLocations[0].address;
          var pollingAddress = pollingLocation.locationName + ', ' +
              pollingLocation.line1 + ' ' +
              pollingLocation.city + ', ' +
              pollingLocation.state + ' ' +
              pollingLocation.zip;
          var normEl = document.createElement('strong');
          normEl.appendChild(document.createTextNode(
              'Polling place for ' + normalizedAddress + ': '));
          el.appendChild(normEl);
          el.appendChild(document.createTextNode(pollingAddress));
        } else {
          el.appendChild(document.createTextNode(
              'Could not find polling place for ' + normalizedAddress));
        }
      }

      /**
       * Initialize the API client and make a request.
       */
       
      function load() {
        gapi.client.setApiKey('AIzaSyCJdWNNO0fWUWdGhWbS_55bBSxsCvG_rkc');
        var address = jQuery('#address').val();
          var city = jQuery('#city').val();
          var state = jQuery('#state').val();
          var zip = jQuery('#zip').val();
        var fulladdress = address + " " + city + ", " + state + " " + zip;
        var address_encoded = encodeURI(fulladdress);
        lookup(fulladdress, renderResults);
      }
</script>

<script src="https://apis.google.com/js/client.js?onload=load"></script>