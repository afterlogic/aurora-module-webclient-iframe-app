import _ from 'lodash'

import typesUtils from 'src/utils/types'

import enums from './enums'
// enums is not initialized yet so we cannot get IframeAppAuthMode and IframeAppTokenMode here

class IframeAppSettings {
  constructor(appData) {
    const IframeAppAuthMode = enums.getIframeAppAuthMode()
    const IframeAppTokenMode = enums.getIframeAppTokenMode()

    const iframeAppWebclientData = typesUtils.pObject(appData.IframeAppWebclient)
    if (!_.isEmpty(iframeAppWebclientData)) {
      this.appName = typesUtils.pString(iframeAppWebclientData.AppName)
      this.authMode = typesUtils.pEnum(iframeAppWebclientData.AuthMode, IframeAppAuthMode)
      this.hasPassword = typesUtils.pBool(iframeAppWebclientData.HasPassword)
      this.login = typesUtils.pString(iframeAppWebclientData.Login)
      this.tokenMode = typesUtils.pEnum(iframeAppWebclientData.TokenMode, IframeAppTokenMode)
      this.url = typesUtils.pString(iframeAppWebclientData.Url)
    }
  }

  saveIframeAppSettings({ authMode, appName, url, tokenMode, login, hasPassword }) {
    this.authMode = authMode
    this.appName = appName
    this.url = url
    this.tokenMode = tokenMode
    this.login = login
    this.hasPassword = hasPassword
  }
}

let settings = null

export default {
  init(appData) {
    enums.init(appData) // should be done before settings initialization
    settings = new IframeAppSettings(appData)
  },
  saveIframeAppSettings(data) {
    settings.saveIframeAppSettings(data)
  },
  getIframeAppSettings() {
    return {
      appName: settings.appName,
      authMode: settings.authMode,
      eIframeAppAuthMode: settings.eIframeAppAuthMode,
      eIframeAppTokenMode: settings.eIframeAppTokenMode,
      hasPassword: settings.hasPassword,
      login: settings.login,
      tokenMode: settings.tokenMode,
      url: settings.url,
    }
  },
}
