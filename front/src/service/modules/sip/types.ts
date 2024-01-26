import type { ComputedRef, MaybeRef, Ref } from 'vue'

export enum OperatorStatus {
  Online = 'online',
  Offline = 'offline',
  Invisible = 'invisible'
}

export interface SipUser {
  username: string
  password: string
  host: string
  agentHost: string
  server: string
  project: string
}

export interface SIPProvider {
  isConnected: Ref<boolean>
  isRegistered: Ref<boolean>
  isMuted: Ref<boolean>
  hasIncomingCall: Ref<boolean>
  hasOutgoingCall: Ref<boolean>
  isOnCall: Ref<boolean>
  isCallInitializing: Ref<boolean>
  isCallHangup: Ref<boolean>
  calleeNumber: Ref<string>
  remotePhoneNumber: Ref<string>
  operatorNumber: ComputedRef<string>
  operatorStatus: Ref<OperatorStatus>
  connect: (options: SIPConnectOptions) => Promise<void>
  disconnect: () => Promise<void>
  mute: () => void
  unmute: () => void
  hold: () => void
  unhold: () => void
  answer: () => void
  decline: () => void
  call: (number: string) => void
  hangup: () => void
  reconnect: () => void
  unregister: () => Promise<void>
  register: () => Promise<void>
}

export interface SIPConnectOptions {
  // 'wss://10.20.20.2:8089/ws'
  server: string
  // host 10.20.20.2
  host: string
  // username 190
  username: string
  // password 1010
  password: string

  audioElement: MaybeRef<HTMLAudioElement | undefined>
}
