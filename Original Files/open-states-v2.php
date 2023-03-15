<?php

//*** REGISTER: Enqueue Script Localization for AJAX PHP Callback Functions with Admin File: admin-ajax.php ***//
// Read This: https://wordpress.stackexchange.com/questions/216140/update-user-meta-using-with-ajax //

function localize_program_builder_ajax_scripts() {
    $theme_url = get_template_directory_uri();
    $ajax_url = admin_url('admin-ajax.php');
    $ajax_scripts = array(
      array('name' => 'open-states-v2', 'localized_var' => 'ajax_open_states', 'path' => '/inc/js/openstates2.js'),
    );

    $count_ajax_scripts = count($ajax_scripts);
    for($c = 0; $c < $count_ajax_scripts; $c++) {
        wp_register_script($ajax_scripts[$c]['name'], $theme_url . $ajax_scripts[$c]['path'], array('jquery'), '1.0', true);
        wp_localize_script($ajax_scripts[$c]['name'], $ajax_scripts[$c]['localized_var'], $ajax_url);
        wp_enqueue_script($ajax_scripts[$c]['name']);
    }
}
add_action('wp_enqueue_scripts', 'localize_program_builder_ajax_scripts');

function open_states_api() {
		// if( !isset($_POST) || empty($_POST) ) {
		// 			header('HTTP/1.1 400 Empty POST Values');
		// 			echo 'Could Not Verify POST Values.';
		// 			exit;
		// }

		$os_post_data = $_POST['query'];

		$os_curl = curl_init();

		curl_setopt($os_curl, CURLOPT_URL, 'https://openstates.org/graphql?' . $os_post_data);

		curl_setopt($os_curl, CURLOPT_HTTPHEADER, array(
		    'Content-Type: application/graphql',
		    'X-API-KEY: 7d891cbc-bdf8-4a11-9480-b88512b9098d',
		));

		// curl_setopt($os_curl, CURLOPT_POST, 1);
		// curl_setopt($os_curl, CURLOPT_POSTFIELDS, $os_post_data);

		$os_results_data = curl_exec($os_curl);

		if(curl_errno($os_curl)) {
		    print "Error: " . curl_error($os_curl);
				return "Error curling the URL";
		    exit();
		}

		curl_close($os_curl);
		exit();
		// $results = array(
		// 		'os_results_data' 	=> $os_results_data,
		// 		'os_post_data' 			=> $os_post_data,
		// );
		// console_log($results);
		//
		// return $results;

}

add_action('wp_ajax_nopriv_open_states_api', 'open_states_api');
add_action('wp_ajax_open_states_api', 'open_states_api');
