<?php

class IframeAppWebclientModule extends AApiModule
{
	public $oApiIframeAppManager = null;
	
	public function init() 
	{
		$this->oApiIframeAppManager = $this->GetManager();
		
		$this->setObjectMap('CUser', array(
				'EnableModule' => array('bool', true),
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
		if (!empty($oUser) && $oUser->Role === \EUserRole::NormalUser)
		{
			return array(
				'EnableModule' => (bool) $oUser->{$this->GetName().'::EnableModule'},
				'Login' => $oUser->{$this->GetName().'::Login'},
				'HasPassword' => (bool) $oUser->{$this->GetName().'::Password'},
			);
		}
		
		return null;
	}
	
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
	 * Updates module settings.
	 * 
	 * @param boolean $EnableModule indicates if user turned module on.
	 * @param string $Login
	 * @param string $Password
	 * @return boolean
	 */
	public function UpdateSettings($EnableModule, $Login = '', $Password = '')
	{
		\CApi::checkUserRoleIsAtLeast(\EUserRole::NormalUser);
		
		$iUserId = \CApi::getAuthenticatedUserId();
		if (0 < $iUserId)
		{
			$oCoreDecorator = \CApi::GetModuleDecorator('Core');
			$oUser = $oCoreDecorator->GetUser($iUserId);
			$oUser->{$this->GetName().'::EnableModule'} = $EnableModule;
			if (!empty($Login))
			{
				$oUser->{$this->GetName().'::Login'} = $Login;
			}
			if (!empty($Password))
			{
				$oUser->{$this->GetName().'::Password'} = $Password;
			}
			$oCoreDecorator->UpdateUserObject($oUser);
		}
		return true;
	}
}
