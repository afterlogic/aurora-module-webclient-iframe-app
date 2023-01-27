<?php

namespace Aurora\Modules\IframeAppWebclient\Enums;

class AuthMode extends \Aurora\System\Enums\AbstractEnumeration
{
    public const NoAuthentication = 0;
    public const AuroraUserCredentials = 1;
    public const CustomCredentialsSetByUser = 2;
    public const CustomCredentialsSetByAdmin = 3;

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
