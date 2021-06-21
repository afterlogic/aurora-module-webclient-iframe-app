import _ from 'lodash'

import typesUtils from 'src/utils/types'

class IframeAppEnums {
  constructor (appData) {
    const iframeAppWebclientData = typesUtils.pObject(appData.IframeAppWebclient)
    if (!_.isEmpty(iframeAppWebclientData)) {
      this.IframeAppAuthMode = typesUtils.pObject(iframeAppWebclientData.EIframeAppAuthMode)
      this.IframeAppTokenMode = typesUtils.pObject(iframeAppWebclientData.EIframeAppTokenMode)
    }
  }
}

let enums = null

export default {
  init (appData) {
    enums = new IframeAppEnums(appData)
  },

  getIframeAppAuthMode () {
    return enums.IframeAppAuthMode
  },

  getIframeAppTokenMode () {
    return enums.IframeAppTokenMode
  },
}
