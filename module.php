<?php

class IframeAppWebclientModule extends AApiModule
{
	public function init() 
	{
		$this->incClass('enum');
		
		$this->setObjectMap('CUser', array(
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
		\CApi::checkUserRoleIsAtLeast(\EUserRole::Anonymous);
		
		$oUser = \CApi::getAuthenticatedUser();
		if (!empty($oUser) && ($oUser->Role === \EUserRole::NormalUser && $this->isEnabledForEntity($oUser) || $oUser->Role === \EUserRole::SuperAdmin))
		{
			return array(
				'Login' => $oUser->{$this->GetName().'::Login'},
				'HasPassword' => (bool) $oUser->{$this->GetName().'::Password'},
				'EIframeAppAuthMode' => (new \EIframeAppAuthMode)->getMap(),
				'EIframeAppTokenMode' => (new \EIframeAppTokenMode)->getMap(),
				'AuthMode' => $this->getConfig('AuthMode', EIframeAppAuthMode::NoAuthentication),
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
		if (is_numeric($AuthMode) && is_numeric($TokenMode) && $Url)
		{
			\CApi::checkUserRoleIsAtLeast(\EUserRole::SuperAdmin);
			
			$this->setConfig('AppName', $AppName);
			$this->setConfig('AuthMode', $AuthMode);
			$this->setConfig('TokenMode', $TokenMode);
			$this->setConfig('Url', $Url);

			return $this->saveModuleConfig();
		}
		
		if (!empty($Login) && !empty($Password))
		{
			\CApi::checkUserRoleIsAtLeast(\EUserRole::NormalUser);
			$oUser = \CApi::getAuthenticatedUser();
			if ($oUser)
			{
				$oCoreDecorator = \CApi::GetModuleDecorator('Core');
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
		\CApi::checkUserRoleIsAtLeast(\EUserRole::NormalUser);
		
		$oUser = \CApi::getAuthenticatedUser();
		
		$iAuthMode = $this->getConfig('AuthMode', EIframeAppAuthMode::NoAuthentication);
				
		if (($iAuthMode === EIframeAppAuthMode::CustomCredentialsSetByUser || $iAuthMode === EIframeAppAuthMode::CustomCredentialsSetByAdmin)
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
		\CApi::checkUserRoleIsAtLeast(\EUserRole::SuperAdmin);
		
		$oUser = null;
		$oCoreDecorator = \CApi::GetModuleDecorator('Core');
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
		\CApi::checkUserRoleIsAtLeast(\EUserRole::SuperAdmin);
		
		$oUser = null;
		$oCoreDecorator = \CApi::GetModuleDecorator('Core');
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
