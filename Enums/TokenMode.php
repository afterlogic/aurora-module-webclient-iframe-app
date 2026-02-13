<?php

namespace Aurora\Modules\IframeAppWebclient\Enums;

class TokenMode extends \Aurora\System\Enums\AbstractEnumeration
{
    public const GETRequest = 1;
    public const POSTRequest = 2;

    /**
     * @var array
     */
    protected $aConsts = array(
        'GETRequest' => self::GETRequest,
        'POSTRequest' => self::POSTRequest,
    );
}
