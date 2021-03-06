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
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
	public function init() 
	{
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
		if (!empty($oUser) && ($oUser->isNormalOrTenant() && $this->isEnabledForEntity($oUser) || $oUser->Role === \Aurora\System\Enums\UserRole::SuperAdmin))
		{
			return array(
				'Login' => $oUser->{self::GetName().'::Login'},
				'HasPassword' => (bool) $oUser->{self::GetName().'::Password'},
				'EIframeAppAuthMode' => (new Enums\AuthMode)->getMap(),
				'EIframeAppTokenMode' => (new Enums\TokenMode)->getMap(),
				'AuthMode' => $this->getConfig('AuthMode', Enums\AuthMode::NoAuthentication),
				'TokenMode' => $this->getConfig('TokenMode', 0),
				'Url' => $this->getConfig('Url', ''),
				'AppName' => $this->getConfig('AppName', '')
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
	public function UpdateSettings($AppName = null, $AuthMode = null, $TokenMode = null,  $Url = null, $Login = '', $Password = '')
	{
		if (\is_numeric($AuthMode) && \is_numeric($TokenMode) && $Url)
		{
			\Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);
			
			$this->setConfig('AppName', $AppName);
			$this->setConfig('AuthMode', $AuthMode);
			$this->setConfig('TokenMode', $TokenMode);
			$this->setConfig('Url', $Url);

			return $this->saveModuleConfig();
		}
		
		if (!empty($Login) && !empty($Password))
		{
			\Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);
			$oUser = \Aurora\System\Api::getAuthenticatedUser();
			if ($oUser)
			{
				$oUser->{self::GetName().'::Login'} = $Login;
				$oUser->{self::GetName().'::Password'} = $Password;
				return \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
			}
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
		
		$iAuthMode = $this->getConfig('AuthMode', Enums\AuthMode::NoAuthentication);
				
		if (($iAuthMode === Enums\AuthMode::CustomCredentialsSetByUser || $iAuthMode === Enums\AuthMode::CustomCredentialsSetByAdmin)
				&& !empty($oUser) && $oUser->isNormalOrTenant())
		{
			return array(
				'Login' => $oUser->{self::GetName().'::Login'},
				'Password' => $oUser->{self::GetName().'::Password'},
			);
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
		
		$oUser = \Aurora\Modules\Core\Module::Decorator()->GetUserUnchecked($UserId);
		if ($oUser)
		{
			return array(
				'EnableModule' => $this->isEnabledForEntity($oUser),
				'Login' => $oUser->{self::GetName().'::Login'},
				'HasPassword' => (bool) $oUser->{self::GetName().'::Password'}
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
		
		$oUser = \Aurora\Modules\Core\Module::Decorator()->GetUserUnchecked($UserId);
		if ($oUser)
		{
			$this->updateEnabledForEntity($oUser, $EnableModule);
			
			if (!empty($Login) && !empty($Password))
			{
				$oUser->{self::GetName().'::Login'} = $Login;
				$oUser->{self::GetName().'::Password'} = $Password;
				
				return \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
			}
			
			return true;
		}
		
		return false;
	}
}
