'use strict';
var
	_ = require('underscore'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: '%ModuleName%',
	HashModuleName: TextUtils.getUrlFriendlyName('%ModuleName%'), /*'iframe-app',*/
	
	AppName: TextUtils.i18n('%MODULENAME%/LABEL_APP_NAME'),
	AuthMode: 0,
	TokenMode: 0,
	Url: '',
	Token: '',
	
	Login: '',
	HasPassword: false,
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['%ModuleName%'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.EIframeAppAuthMode = Types.pObject(oAppDataSection.EIframeAppAuthMode);
			this.EIframeAppTokenMode = Types.pObject(oAppDataSection.EIframeAppTokenMode);
			
			this.AuthMode = Types.pEnum(oAppDataSection.AuthMode, this.EIframeAppAuthMode, this.AuthMode);
			this.TokenMode = Types.pEnum(oAppDataSection.TokenMode, this.EIframeAppTokenMode, this.TokenMode);
			this.Url = Types.pString(oAppDataSection.Url, this.Url);
			this.Login = Types.pString(oAppDataSection.Login, this.Login);
			this.HasPassword = Types.pBool(oAppDataSection.HasPassword, this.HasPassword);
			this.AppName = Types.pString(oAppDataSection.AppName, this.AppName);
			this.Token = Types.pString(oAppDataSection.Token, this.Token);
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
	 * @param {string} sAppName
	 * @param {int} iAuthMode
	 * @param {int} iTokenMode
	 * @param {string} sUrl
	 */
	updateAdmin: function (sAppName, iAuthMode, iTokenMode, sUrl)
	{
		this.AppName = sAppName;
		this.AuthMode = iAuthMode;
		this.TokenMode = iTokenMode;
		this.Url = sUrl;
	}
};
