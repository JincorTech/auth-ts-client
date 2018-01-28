import VerificationResultInterface from '../verification-result-interface'

export default interface TenantVerificationResultInterface
  extends VerificationResultInterface {
  isTenant: boolean
}
