<?php

namespace Aurora\Modules\IframeAppWebclient\Enums;

class AuthMode extends \Aurora\System\Enums\AbstractEnumeration
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
