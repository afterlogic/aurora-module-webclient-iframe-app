<?php

namespace Aurora\Modules\IframeAppWebclient\Enums;

class TokenMode extends \Aurora\System\Enums\AbstractEnumeration
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
