<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5">{{ $t('IFRAMEAPPWEBCLIENT.HEADING_SETTINGS_TAB') }}</div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row">
            <q-checkbox dense v-model="enableIframeApp">
              <q-item-label v-t="'IFRAMEAPPWEBCLIENT.LABEL_ALLOW_IFRAMEAPP'" />
            </q-checkbox>
          </div>
          <div class="row q-mt-md" v-if="isAuthModeCredentialsSetByAdmin">
            <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_LOGIN'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="login" ref="login" @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mt-md" v-if="isAuthModeCredentialsSetByAdmin">
            <div class="col-2 q-my-sm" v-t="'COREWEBCLIENT.LABEL_PASSWORD'"></div>
            <div class="col-5">
              <q-input
                outlined
                dense
                bg-color="white"
                type="password"
                autocomplete="new-password"
                v-model="password"
                ref="password"
                @keyup.enter="save"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn
          unelevated
          no-caps
          dense
          class="q-px-sm"
          :ripple="false"
          color="primary"
          :label="$t('COREWEBCLIENT.ACTION_SAVE')"
          @click="updateSettingsForEntity"
        />
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start" :showing="loading || saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import cache from 'src/cache'

import settings from '../settings'

const FAKE_PASS = '******'

export default {
  name: 'IframeAppAdminSettingsPerUser',

  data() {
    return {
      saving: false,
      loading: false,
      enableIframeApp: false,
      enableIframeAppFromServer: false,
      isAuthModeCredentialsSetByAdmin: settings.isAuthModeCredentialsSetByAdmin(),
      login: '',
      password: '',
    }
  },

  watch: {
    $route(to, from) {
      this.parseRoute()
    },
  },

  mounted() {
    this.parseRoute()
    this.getPerUserSettings()
  },

  beforeRouteLeave(to, from, next) {
    this.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges() {
      return this.enableIframeApp !== this.enableIframeAppFromServer
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges() {
      this.enableIframeApp = this.enableIframeAppFromServer
    },

    parseRoute() {
      const userId = typesUtils.pPositiveInt(this.$route?.params?.id)
      if (this.user?.id !== userId) {
        this.user = {
          id: userId,
        }
        this.populate()
      }
    },

    populate() {
      const currentTenantId = this.$store.getters['tenants/getCurrentTenantId']
      cache.getUser(currentTenantId, this.user.id).then(({ user, userId }) => {
        if (userId === this.user.id) {
          if (user && _.isFunction(user?.getData)) {
            this.user = user
          } else {
            this.$emit('no-user-found')
          }
        }
      })
    },

    updateSettingsForEntity() {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          UserId: this.user?.id,
          TenantId: this.user.tenantId,
          EnableModule: typesUtils.pBool(this.enableIframeApp),
        }
        if (this.isAuthModeCredentialsSetByAdmin) {
          parameters.Login = this.login.trim()
          if (this.password !== FAKE_PASS) {
            parameters.Password = this.password.trim()
          }
        }
        webApi
          .sendRequest({
            moduleName: 'IframeAppWebclient',
            methodName: 'UpdatePerUserSettings',
            parameters,
          })
          .then(
            (result) => {
              this.saving = false
              if (result) {
                this.getPerUserSettings()
                notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
              } else {
                notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
              }
            },
            (response) => {
              this.saving = false
              notification.showError(
                errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
              )
            }
          )
      }
    },

    getPerUserSettings() {
      this.loading = true
      const parameters = {
        UserId: this.user?.id,
        TenantId: this.user.tenantId,
      }
      webApi
        .sendRequest({
          moduleName: 'IframeAppWebclient',
          methodName: 'GetPerUserSettings',
          parameters,
        })
        .then(
          (result) => {
            this.loading = false
            if (result) {
              this.enableIframeApp = result.EnableModule
              this.enableIframeAppFromServer = result.EnableModule
              this.login = result.Login || ''
              this.password = result.HasPassword ? FAKE_PASS : ''
            }
          },
          (response) => {
            notification.showError(errors.getTextFromResponse(response))
          }
        )
    },
  },
}
</script>

<style scoped></style>
