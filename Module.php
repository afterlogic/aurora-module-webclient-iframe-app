<?php
/**
 * @copyright Copyright (c) 2017, Afterlogic Corp.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program. If not, see <http://www.gnu.org/licenses/>
 */

namespace Aurora\Modules\IframeAppWebclient;

/**
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
	public function init() 
	{
		$this->incClass('enum');
		
		$this->extendObject('CUser', array(
				'Login' => array('string', ''),
				'Password' => array('string', '')
			)
		);
	}
	
	/**
	 * Obtains list of module settings for authenticated user.
	 * 
	 * @return array
	 */
	public function GetSettings()
	{
		\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::Anonymous);
		
		$oUser = \Aurora\System\Api::getAuthenticatedUser();
		if (!empty($oUser) && ($oUser->Role === \EUserRole::NormalUser && $this->isEnabledForEntity($oUser) || $oUser->Role === \EUserRole::SuperAdmin))
		{
			return array(
				'Login' => $oUser->{$this->GetName().'::Login'},
				'HasPassword' => (bool) $oUser->{$this->GetName().'::Password'},
				'EIframeAppAuthMode' => (new \EIframeAppAuthMode)->getMap(),
				'EIframeAppTokenMode' => (new \EIframeAppTokenMode)->getMap(),
				'AuthMode' => $this->getConfig('AuthMode', \EIframeAppAuthMode::NoAuthentication),
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
			\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::SuperAdmin);
			
			$this->setConfig('AppName', $AppName);
			$this->setConfig('AuthMode', $AuthMode);
			$this->setConfig('TokenMode', $TokenMode);
			$this->setConfig('Url', $Url);

			return $this->saveModuleConfig();
		}
		
		if (!empty($Login) && !empty($Password))
		{
			\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::NormalUser);
			$oUser = \Aurora\System\Api::getAuthenticatedUser();
			if ($oUser)
			{
				$oCoreDecorator = \Aurora\System\Api::GetModuleDecorator('Core');
				$oUser->{$this->GetName().'::Login'} = $Login;
				$oUser->{$this->GetName().'::Password'} = $Password;
				return $oCoreDecorator->UpdateUserObject($oUser);
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
		\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::NormalUser);
		
		$oUser = \Aurora\System\Api::getAuthenticatedUser();
		
		$iAuthMode = $this->getConfig('AuthMode', \EIframeAppAuthMode::NoAuthentication);
				
		if (($iAuthMode === \EIframeAppAuthMode::CustomCredentialsSetByUser || $iAuthMode === \EIframeAppAuthMode::CustomCredentialsSetByAdmin)
				&& !empty($oUser) && $oUser->Role === \EUserRole::NormalUser)
		{
			return array(
				'Login' => $oUser->{$this->GetName().'::Login'},
				'Password' => $oUser->{$this->GetName().'::Password'},
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
		\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::SuperAdmin);
		
		$oUser = null;
		$oCoreDecorator = \Aurora\System\Api::GetModuleDecorator('Core');
		if ($oCoreDecorator)
		{
			$oUser = $oCoreDecorator->GetUser($UserId);
		}
		if ($oUser)
		{
			return array(
				'EnableModule' => $this->isEnabledForEntity($oUser),
				'Login' => $oUser->{$this->GetName().'::Login'},
				'HasPassword' => (bool) $oUser->{$this->GetName().'::Password'}
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
		\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::SuperAdmin);
		
		$oUser = null;
		$oCoreDecorator = \Aurora\System\Api::GetModuleDecorator('Core');
		if ($oCoreDecorator)
		{
			$oUser = $oCoreDecorator->GetUser($UserId);
		}
		if ($oUser)
		{
			$this->updateEnabledForEntity($oUser, $EnableModule);
			
			if (!empty($Login) && !empty($Password))
			{
				$oUser->{$this->GetName().'::Login'} = $Login;
				$oUser->{$this->GetName().'::Password'} = $Password;
				
				return $oCoreDecorator->UpdateUserObject($oUser);
			}
			
			return true;
		}
		
		return false;
	}
}
