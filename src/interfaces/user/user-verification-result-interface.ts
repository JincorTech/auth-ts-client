import VerificationResultInterface from '../verification-result-interface'

export default interface UserVerificationResultInterface
  extends VerificationResultInterface {
  deviceId: string
  sub: string
  exp: number
  scope?: any
}
