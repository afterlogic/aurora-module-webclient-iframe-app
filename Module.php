<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\IframeAppWebclient;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
    public function init() {}

    /**
     * @return Module
     */
    public static function getInstance()
    {
        return parent::getInstance();
    }

    /**
     * @return Module
     */
    public static function Decorator()
    {
        return parent::Decorator();
    }

    /**
     * @return Settings
     */
    public function getModuleSettings()
    {
        return $this->oModuleSettings;
    }

    /**
     * Obtains list of module settings for authenticated user.
     *
     * @return array
     */
    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        $oUser = \Aurora\System\Api::getAuthenticatedUser();
        if ($oUser && ($oUser->isNormalOrTenant() && $this->isEnabledForEntity($oUser) || $oUser->Role === \Aurora\System\Enums\UserRole::SuperAdmin)) {
            return array(
                'Login' => $oUser->getExtendedProp(self::GetName() . '::Login'),
                'HasPassword' => (bool) $this->getUserPassword($oUser),
                'EIframeAppAuthMode' => (new Enums\AuthMode())->getMap(),
                'EIframeAppTokenMode' => (new Enums\TokenMode())->getMap(),
                'AuthMode' => $this->oModuleSettings->AuthMode,
                'TokenMode' => $this->oModuleSettings->TokenMode,
                'Url' => $this->oModuleSettings->Url,
                'AppName' => $this->oModuleSettings->AppName
            );
        }

        return null;
    }

    /**
     * Updates module settings.
     *
     * @param int $AuthMode
     * @param string $Login
     * @param string $Password
     * @return bool
     */
    public function UpdateSettings($AppName = null, $AuthMode = null, $TokenMode = null, $Url = null, $Login = null, $Password = null)
    {
        if (\is_numeric($AuthMode) && \is_numeric($TokenMode) && $Url) {
            \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);

            $this->setConfig('AppName', $AppName);
            $this->setConfig('AuthMode', $AuthMode);
            $this->setConfig('TokenMode', $TokenMode);
            $this->setConfig('Url', $Url);

            return $this->saveModuleConfig();
        }

        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);
        $oUser = \Aurora\System\Api::getAuthenticatedUser();
        if ($oUser) {
            if ($Login !== null) {
                $oUser->setExtendedProp(self::GetName() . '::Login', $Login);
            }
            if ($Password !== null) {
                $this->setUserPassword($oUser, $Password);
            }
            return \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
        }

        return false;
    }

    /**
     * Obtains user credentials.
     * @return array
     */
    public function GetCredentials()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        $oUser = \Aurora\System\Api::getAuthenticatedUser();

        $iAuthMode = $this->oModuleSettings->AuthMode;

        if ($oUser && $oUser->isNormalOrTenant()) {
            if ($iAuthMode === Enums\AuthMode::AuroraUserCredentials) {
                return [
                    'Login' => $oUser->PublicId,
                    'Password' => '',
                ];
            } else {
                if ($iAuthMode === Enums\AuthMode::CustomCredentialsSetByUser || $iAuthMode === Enums\AuthMode::CustomCredentialsSetByAdmin) {
                    return [
                        'Login' => $oUser->getExtendedProp(self::GetName() . '::Login'),
                        'Password' => $this->getUserPassword($oUser),
                    ];
                }
            }
        }

        return null;
    }

    /**
     * Obtains per user settings for superadmin.
     * @param int $UserId
     * @return array
     */
    public function GetPerUserSettings($UserId)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);

        $oUser = \Aurora\Api::getUserById($UserId);
        if ($oUser) {
            return array(
                'EnableModule' => $this->isEnabledForEntity($oUser),
                'Login' => $oUser->getExtendedProp(self::GetName() . '::Login'),
                'HasPassword' => (bool) $this->getUserPassword($oUser)
            );
        }

        return null;
    }

    /**
     * Updaters per user settings for superadmin.
     *
     * @param int $UserId
     * @param bool $EnableModule
     * @return bool
     */
    public function UpdatePerUserSettings($UserId, $EnableModule, $Login = '', $Password = '')
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);

        $oUser = \Aurora\Api::getUserById($UserId);
        if ($oUser) {
            $this->updateEnabledForEntity($oUser, $EnableModule);

            if (!empty($Login) && !empty($Password)) {
                $oUser->setExtendedProp(self::GetName() . '::Login', $Login);
                $this->setUserPassword($oUser, $Password);

                return \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
            }

            return true;
        }

        return false;
    }

    protected function getUserPassword($user)
    {
        $password = $user->getExtendedProp(self::GetName() . '::Password');

        if (!empty($password)) {
            $decodedPassword = \Aurora\System\Utils::DecryptValue($password);
            if (!$decodedPassword) {
                $this->setUserPassword($user, $password);
                \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($user);
            } else {
                $password = $decodedPassword;
            }
        }

        return $password;
    }

    protected function setUserPassword(&$user, $password)
    {
        $user->setExtendedProp(self::GetName() . '::Password', \Aurora\System\Utils::EncryptValue($password));
    }
}
