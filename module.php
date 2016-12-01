<?php

class IframeAppWebclientModule extends AApiModule
{
	public $oApiIframeAppManager = null;
	
	protected $aSettingsMap = array(
		'AuthMode' => array(0, 'int'),
	);
	
	public function init() 
	{
		$this->incClass('enum');
		
		$this->oApiIframeAppManager = $this->GetManager();
		
		$this->setObjectMap('CUser', array(
				'Login' => array('string', ''),
				'Password' => array('string', '')
			)
		);
	}
	
	/**
	 * Obtaines list of module settings for authenticated user.
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
				'AuthMode' => $this->getConfig('AuthMode', EIframeAppAuthMode::NoAuthentication),
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
	public function UpdateSettings($AuthMode = null, $Login = '', $Password = '')
	{
		if (is_numeric($AuthMode))
		{
			\CApi::checkUserRoleIsAtLeast(\EUserRole::SuperAdmin);
			
			$this->setConfig('AuthMode', $AuthMode);
			
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
		\CApi::checkUserRoleIsAtLeast(\EUserRole::Anonymous);
		
		$oUser = \CApi::getAuthenticatedUser();
		if (!empty($oUser) && $oUser->Role === \EUserRole::NormalUser)
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
	public function UpdatePerUserSettings($UserId, $EnableModule)
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
			if ($EnableModule)
			{
				$this->setEnabledForEntity($oUser);
			}
			else
			{
				$this->setDisabledForEntity($oUser);
			}
			return true;
		}
		
		return false;
	}
}
