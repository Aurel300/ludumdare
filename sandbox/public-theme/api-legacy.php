<?php
require_once __DIR__."/../legacy-config.php";
if (defined('LEGACY_DEBUG')) {
	if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
		$action = trim($_GET['action']);
		if ( $action == "LEGACY_LOGIN" ) {
			$RETURN_URL = "/";
			if ( isset($_GET['beta']) )
				$RETURN_URL .= "?beta";
			
			setcookie( "lusha", "111.this_is_fake", time()+6*60*60, "/", str_replace("theme","",$_SERVER['SERVER_NAME']) );
			header("Location: ".$RETURN_URL);
			die();
		}
	}
}

require_once __DIR__."/../api.php";
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/legacy_user.php";
require_once __DIR__."/../core/access.php";

// IMPORTANT: This Legacy API is intended for use with the legacy LD website. 
// *** This code will not work for you ***

$response = json_NewResponse();

// MAIN (Only accept POST requests) //
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
	$action = trim($_POST['action']);
	
	if ( $action == "LOGOUT" ) {
		setcookie( "lusha", "", 0, "/", str_replace("theme","",$_SERVER['SERVER_NAME']) );
		$response['logout'] = 1;
	}
	else if ( $action == "GET_HASH" ) {
		// This is only available to whitelisted clients, or while debugging //
		if ( defined('LEGACY_DEBUG') || defined('IP_WHITELIST') && core_OnWhitelist($_SERVER['REMOTE_ADDR'],IP_WHITELIST) ) {
			$id = intval($_POST['id']);
			$ip = ($_POST['ip']);
			if ( $id > 0 && (inet_pton($ip) !== false) ) {
				//error_log($ip." - ".$_POST['ip']);
				$user = legacy_GetUser($id);
				// Not in Database yet
				if ( empty($user) ) {
					// Do handshake, confirm user exists //
					$result = legacy_FetchUserInfo($id);
					if ( isset($result['register_date']) ) {
						// Generate Hash //
						$user['hash'] = legacy_GenerateUserHash($id);
					}
					legacy_SetExtraInfo($id,$result);
				}
				
				if ( $user ) {
					access_LogUser( $id, $ip );
					$response['hash'] = $user['hash'];
				}
			}
		}
	}
//	else if ( $action == "ACCESS" ) {
//		$response['id'] = intval($_POST['id']);
//		$response['ip'] = $_SERVER['REMOTE_ADDR'];
//		
//		$response['ret'] = access_LogUser( intval($_POST['id']), $_SERVER['REMOTE_ADDR'] );
//	}
//	else if ( $action == "HAXCESS" ) {
//		$response['id'] = intval($_POST['id']);
//		$response['ret'] = access_GetUser( intval($_POST['id']) );
//	}
//	else if ( $action == "LAXCESS" ) {
//		$response['ret'] = access_GetIp( $_SERVER['REMOTE_ADDR'] );
//	}
	else if ( $action == "LEGACY_FETCH" ) {
		if (defined('LEGACY_DEBUG')) {
			$id = intval($_POST['id']);
			if ( $id === 111 ) {
				// Fake Fetch URL
				$data['hash'] = 'this_is_fake';
			}
		}
	}
}

json_Emit($response);
