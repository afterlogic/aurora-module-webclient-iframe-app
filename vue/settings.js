import _ from 'lodash'

import typesUtils from 'src/utils/types'

class IframeAppSettings {
  constructor (appData) {
    const iframeAppWebclientData = typesUtils.pObject(appData.IframeAppWebclient)
    if (!_.isEmpty(iframeAppWebclientData)) {
      this.appName = iframeAppWebclientData.AppName
      this.authMode = iframeAppWebclientData.AuthMode
      this.eIframeAppAuthMode = iframeAppWebclientData.EIframeAppAuthMode
      this.eIframeAppTokenMode = iframeAppWebclientData.EIframeAppTokenMode
      this.hasPassword = iframeAppWebclientData.HasPassword
      this.login = iframeAppWebclientData.Login
      this.tokenMode = iframeAppWebclientData.TokenMode
      this.url = iframeAppWebclientData.Url
    }
  }

  saveIframeAppSettings ({ authMode, appName, url, tokenMode }) {
    this.authMode = authMode
    this.appName = appName
    this.url = url
    this.tokenMode = tokenMode
  }
}

let settings = null

export default {
  init (appData) {
    settings = new IframeAppSettings(appData)
  },
  saveIframeAppSettings (data) {
    settings.saveIframeAppSettings(data)
  },
  getIframeAppSettings () {
    return {
      appName: settings.appName,
      authMode: settings.authMode,
      eIframeAppAuthMode: settings.eIframeAppAuthMode,
      eIframeAppTokenMode: settings.eIframeAppTokenMode,
      hasPassword: settings.hasPassword,
      login: settings.login,
      tokenMode: settings.tokenMode,
      url: settings.url
    }
  },

}
