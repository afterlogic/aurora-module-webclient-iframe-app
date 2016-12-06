'use strict';

module.exports = {
	ServerModuleName: 'IframeAppWebclient',
	HashModuleName: 'iframe-app',
	
	AuthMode: false,
	TokenMode: false,
	Url: false,
	
	Login: '',
	HasPassword: false,
	
	/**
	 * Initializes settings of the module.
	 * 
	 * @param {Object} oAppDataSection module section in AppData.
	 */
	init: function (oAppDataSection)
	{
		if (oAppDataSection)
		{
			this.AuthMode = oAppDataSection.AuthMode;
			this.TokenMode = oAppDataSection.TokenMode;
			this.Url = oAppDataSection.Url;
			this.Login = oAppDataSection.Login;
			this.HasPassword = !!oAppDataSection.HasPassword;
			this.AppName = oAppDataSection.AppName;
			
			this.EIframeAppAuthMode = oAppDataSection.EIframeAppAuthMode;
		}
	},
	
	/**
	 * Updates module settings after editing.
	 * 
	 * @param {string} sLogin New value of setting 'Login'
	 * @param {boolean} bHasPassword Indicates if user has custom password
	 */
	update: function (sLogin, bHasPassword)
	{
		this.Login = sLogin;
		this.HasPassword = bHasPassword;
	},
	
	/**
	 * Updates admin module settings after editing.
	 * 
	 * @param {int} iAuthMode
	 */
	updateAdmin: function (iAuthMode, iTokenMode, sUrl)
	{
		this.AuthMode = iAuthMode;
		this.TokenMode = iTokenMode;
		this.Url = sUrl;
	}
};
