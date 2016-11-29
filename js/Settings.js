'use strict';

module.exports = {
	ServerModuleName: 'IframeAppWebclient',
	HashModuleName: 'iframe-app',
	
	ShowCredentials: false,
	
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
			this.ShowCredentials = !!oAppDataSection.ShowCredentials;
			this.Login = oAppDataSection.Login;
			this.HasPassword = !!oAppDataSection.HasPassword;
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
	 * @param {boolean} bShowCredentials
	 */
	updateAdmin: function (bShowCredentials)
	{
		this.ShowCredentials = bShowCredentials;
	}
};
