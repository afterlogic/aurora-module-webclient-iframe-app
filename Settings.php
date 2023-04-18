<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\IframeAppWebclient;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property string $AppName
 * @property int $AuthMode
 * @property int $TokenMode
 * @property string $Url
 */

class Settings extends \Aurora\System\Module\Settings
{
    protected function initDefaults()
    {
        $this->aContainer = [
            "Disabled" => new SettingsProperty(
                false,
                "bool",
                null,
                "Setting to true disables the module",
            ),
            "AppName" => new SettingsProperty(
                "",
                "string",
                null,
                "Denotes app name used in the interface for the integrated app",
            ),
            "AuthMode" => new SettingsProperty(
                0,
                "int",
                null,
                "Defines the mode of sending authentication data into the integrated app",
            ),
            "TokenMode" => new SettingsProperty(
                0,
                "int",
                null,
                "Defines the mode of sending auth token into the integrated app",
            ),
            "Url" => new SettingsProperty(
                "",
                "string",
                null,
                "URL of the integrated app",
            ),
        ];
    }
}
