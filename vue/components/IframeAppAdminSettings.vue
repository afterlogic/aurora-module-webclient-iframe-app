<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'IFRAMEAPPWEBCLIENT.HEADING_BROWSER_TAB'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'IFRAMEAPPWEBCLIENT.LABEL_APP_NAME'"></div>
            <div class="col-5 q-ml-xl">
              <q-input outlined dense class="bg-white" v-model="appName" @keyup.enter="save"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'IFRAMEAPPWEBCLIENT.LABEL_AUTH_MODE'"></div>
            <div class="col-5 q-ml-xl">
              <q-select outlined dense class="bg-white" v-model="currentModeAuth"
                        :options="authModeList"/>
            </div>
          </div>
          <div class="row q-mb-md" v-if="showTokenMode">
            <div class="col-2 q-my-sm" v-t="'IFRAMEAPPWEBCLIENT.LABEL_AUTH_MODE'"></div>
            <div class="col-5 q-ml-xl">
              <q-select outlined dense class="bg-white" v-model="currentTokenMode"
                        :options="tokenModeList"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'IFRAMEAPPWEBCLIENT.LABEL_IFRAME_URL'"></div>
            <div class="col-5 q-ml-xl">
              <q-input outlined dense class="bg-white" v-model="url" @keyup.enter="save"/>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pa-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="save"
               :label="saving ? $t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS') : $t('COREWEBCLIENT.ACTION_SAVE')">
        </q-btn>
      </div>
    </div>
    <UnsavedChangesDialog ref="unsavedChangesDialog"/>
  </q-scroll-area>
</template>

<script>
import UnsavedChangesDialog from '../../../AdminPanelWebclient/vue/src/components/UnsavedChangesDialog'
import settings from '../settings'
import webApi from 'src/utils/web-api'
import notification from 'src/utils/notification'
import errors from 'src/utils/errors'

export default {
  name: 'IframeAppAdminSettings',
  components: {
    UnsavedChangesDialog,
  },
  mounted() {
    this.populate()
  },
  data () {
    return {
      saving: false,
      authMode: 0,
      tokenMode: 0,
      authModeList: [],
      iframeAppAuthMode: {},
      iframeAppTokenMode: {},
      currentModeAuth: '',
      currentTokenMode: '',
      tokenModeList: [],
      appName: '',
      url: ''
    }
  },
  computed: {
    showTokenMode() {
      return this.currentModeAuth.value !== this.iframeAppAuthMode.NoAuthentication
    }
  },
  methods: {
    save() {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          AppName: this.appName,
          AuthMode: this.currentModeAuth.value,
          TokenMode: this.currentTokenMode.value,
          Url: this.url
        }
        webApi.sendRequest({
          moduleName: 'IframeAppWebclient',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.saveIframeAppSettings({
              appName: this.appName,
              authMode: this.currentModeAuth.value,
              tokenMode: this.currentTokenMode.value,
              url: this.url
            })
            this.populate()
            notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
        })
      }
    },
    populate() {
      const data = settings.getIframeAppSettings()
      this.iframeAppAuthMode = data.eIframeAppAuthMode
      this.iframeAppTokenMode = data.eIframeAppTokenMode
      this.appName = data.appName
      this.url = data.url
      this.authMode = data.authMode
      this.tokenMode = data.tokenMode
      this.authModeList = this.getAuthModeList()
      this.currentModeAuth = this.getCurrentAuthMode()
      this.tokenModeList = this.getTokenModeList()
      this.currentTokenMode = this.getCurrentTokenMode()
    },
    getAuthModeList () {
      return [
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_NO_AUTH'),
          value: this.iframeAppAuthMode.NoAuthentication
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_AURORA_CREDS'),
          value: this.iframeAppAuthMode.AuroraUserCredentials
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_CUSTOM_CREDS_BY_USER'),
          value: this.iframeAppAuthMode.CustomCredentialsSetByUser
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_CUSTOM_CREDS_BY_ADMIN'),
          value: this.iframeAppAuthMode.CustomCredentialsSetByAdmin
        }
      ]
    },
    getCurrentAuthMode() {
      let currentMode = ''
      this.authModeList.forEach((mode) => {
        if (mode.value === this.authMode) {
          currentMode = mode
        }
      })
      return currentMode
    },
    getTokenModeList () {
      return [
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_COOKIE_ONLY'),
          value: this.iframeAppTokenMode.CookieOnly
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_GET_REQUEST'),
          value: this.iframeAppTokenMode.GETRequest
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_POST_REQUEST'),
          value: this.iframeAppTokenMode.POSTRequest
        }
      ]
    },
    getCurrentTokenMode() {
      let currentMode = ''
      this.tokenModeList.forEach((mode) => {
        if (mode.value === this.tokenMode) {
          currentMode = mode
        }
      })
      return currentMode
    }
  }
}
</script>