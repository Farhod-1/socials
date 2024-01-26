import type { SIPConnectOptions, SIPProvider } from '@/service/modules/sip/types'
import { OperatorStatus } from '@/service/modules/sip/types'
import { Web } from 'sip.js'
import { computed, inject, provide, ref, toValue } from 'vue'

const SIPSymbol = Symbol('SIPSymbol')

// Timeout to discover IP, it will cause a delay on call
const ICEGatheringTimeout = 500

export function provideSIP() {
  const isConnected = ref(false)
  const isCallHangup = ref(false)
  const connectionError = ref<string>()
  const isRegistered = ref(false)
  const isMuted = ref(false)
  const isOnCall = ref(false)
  const isOnHold = ref(false)
  const isCallInitializing = ref(false)
  const hasIncomingCall = ref(false)
  const hasOutgoingCall = ref(false)
  const connectedUsername = ref<string>()
  const calleeNumber = ref<string>()
  const remotePhoneNumber = ref<string>()
  // const operatorStatus = useLocalStorage('call24_operator_status', OperatorStatus.Online)
  const operatorStatus = ref(OperatorStatus.Offline)

  const sipUser = ref<Web.SimpleUser>()
  const sipOptions = ref<SIPConnectOptions>()

  const operatorNumber = computed(() => {
    if (sipOptions.value) {
      return `${sipOptions.value.username}@${sipOptions.value.host}`
    } else {
      return ''
    }
  })

  async function connect(options: SIPConnectOptions) {
    const simpleUserOptions: Web.SimpleUserOptions = {
      aor: `sip:${options.username}@${options.host}`,
      userAgentOptions: {
        authorizationPassword: options.password,
        authorizationUsername: options.username,
        transportOptions: {
          keepAliveInterval: 30,
          server: options.server
        }
      },
      registererOptions: {
        expires: 120,
        refreshFrequency: 80
      },
      media: {
        remote: {
          audio: toValue(options.audioElement)
        },
        constraints: {
          audio: true,
          video: false
        }
      }
    }

    sipOptions.value = options

    const user = new Web.SimpleUser(options.server, simpleUserOptions)

    // Supply delegate to handle inbound calls (optional)
    user.delegate = {
      onServerConnect() {
        isConnected.value = true
      },
      onServerDisconnect(error?: Error) {
        isConnected.value = false

        if (error) {
          connectionError.value = error.message
        } else {
          connectionError.value = 'Disconnected'
        }
      },
      onCallCreated: function () {
        // @ts-ignore
        const displayName = user.session.remoteIdentity.displayName
        // @ts-ignore
        const remotePhone = user.session.remoteIdentity.uri.user
        remotePhoneNumber.value = remotePhone

        calleeNumber.value = displayName ? `${displayName} (${remotePhone})` : remotePhone

        console.log('onCallCreated')

        isCallInitializing.value = false
        hasOutgoingCall.value = true
      },
      onCallReceived: async () => {
        console.log('onCallReceived')
        isCallInitializing.value = false
        hasIncomingCall.value = true
        hasOutgoingCall.value = false
      },
      onCallAnswered() {
        console.log('onCallAnswered')
        hasIncomingCall.value = false
        hasOutgoingCall.value = false
        isOnCall.value = true
      },
      onCallHangup() {
        console.log('onCallHangup')
        hasIncomingCall.value = false
        hasOutgoingCall.value = false
        isOnCall.value = false
        isCallHangup.value = true
        calleeNumber.value = undefined
        remotePhoneNumber.value = undefined
      },
      onCallHold(held: boolean) {
        isOnHold.value = held
      },
      onMessageReceived(message: string) {},
      onRegistered() {
        isRegistered.value = true
        connectedUsername.value = user.id
      },
      onUnregistered() {
        isRegistered.value = false
      },
      onCallDTMFReceived(tone: string, duration: number) {}
    }

    // Connect to server
    await user.connect()

    sipUser.value = user
  }

  async function disconnect() {
    await sipUser.value?.disconnect()
  }

  function mute() {
    if (sipUser.value) {
      sipUser.value.mute()
      isMuted.value = sipUser.value.isMuted()
    }
  }

  function unmute() {
    if (sipUser.value) {
      sipUser.value.unmute()
      isMuted.value = sipUser.value.isMuted()
    }
  }

  function answer() {
    if (sipUser.value) {
      isCallInitializing.value = true
      sipUser.value
        .answer({
          sessionDescriptionHandlerOptions: {
            // @ts-ignore
            iceGatheringTimeout: ICEGatheringTimeout
          }
        })
        .finally(() => {
          isCallInitializing.value = false
        })
    }
  }

  function decline() {
    sipUser.value?.decline()
  }

  function hangup() {
    sipUser.value?.hangup()
  }

  function hold() {
    sipUser.value?.hold()
  }

  function unhold() {
    sipUser.value?.unhold()
  }

  function call(number: string) {
    // calledNumber.value = number
    if (sipUser.value && sipOptions.value && isRegistered.value) {
      sipUser.value.call(`sip:${number}@${sipOptions.value.host}`, {
        sessionDescriptionHandlerOptions: {
          // @ts-ignore
          iceGatheringTimeout: ICEGatheringTimeout
        },

        sessionDescriptionHandlerOptionsReInvite: {
          // @ts-ignore
          iceGatheringTimeout: ICEGatheringTimeout
        }
      })
    }
  }

  function reconnect() {
    sipUser.value?.connect()
  }

  function register() {
    return sipUser.value?.register()
  }

  function unregister() {
    return sipUser.value?.unregister()
  }

  const sip = {
    isConnected,
    isCallInitializing,
    hasOutgoingCall,
    isOnCall,
    isRegistered,
    isMuted,
    hasIncomingCall,
    operatorStatus,
    calleeNumber,
    remotePhoneNumber,
    operatorNumber,
    isCallHangup,
    connect,
    disconnect,
    reconnect,
    register,
    unregister,
    mute,
    unmute,
    answer,
    decline,
    call,
    hangup,
    hold,
    unhold
  } as SIPProvider

  provide<SIPProvider>(SIPSymbol, sip)

  return sip
}

export function useSIP() {
  const sip = inject<SIPProvider>(SIPSymbol)

  if (!sip) {
    throw new Error('SIP not provided')
  }

  return sip
}
