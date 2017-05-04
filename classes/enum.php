<?php
/**
 * @copyright Copyright (c) 2017, Afterlogic Corp.
 * @license AGPL-3.0 or AfterLogic Software License
 *
 * This code is licensed under AGPLv3 license or AfterLogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

/**
 * @package Api
 * @subpackage Enum
 */
class EIframeAppAuthMode extends \AbstractEnumeration
{
	const NoAuthentication = 0;
	const AuroraUserCredentials = 1;
	const CustomCredentialsSetByUser = 2;
	const CustomCredentialsSetByAdmin = 3;

	/**
	 * @var array
	 */
	protected $aConsts = array(
		'NoAuthentication' => self::NoAuthentication,
		'AuroraUserCredentials' => self::AuroraUserCredentials,
		'CustomCredentialsSetByUser' => self::CustomCredentialsSetByUser,
		'CustomCredentialsSetByAdmin' => self::CustomCredentialsSetByAdmin,
	);
}

/**
 * @package Api
 * @subpackage Enum
 */
class EIframeAppTokenMode extends \AbstractEnumeration
{
	const CookieOnly = 0;
	const GETRequest = 1;
	const POSTRequest = 2;

	/**
	 * @var array
	 */
	protected $aConsts = array(
		'CookieOnly' => self::CookieOnly,
		'GETRequest' => self::GETRequest,
		'POSTRequest' => self::POSTRequest,
	);
}
