<?php

namespace Aurora\Modules\IframeAppWebclient\Enums;

class TokenMode extends \Aurora\System\Enums\AbstractEnumeration
{
    public const CookieOnly = 0;
    public const GETRequest = 1;
    public const POSTRequest = 2;

    /**
     * @var array
     */
    protected $aConsts = array(
        'CookieOnly' => self::CookieOnly,
        'GETRequest' => self::GETRequest,
        'POSTRequest' => self::POSTRequest,
    );
}
