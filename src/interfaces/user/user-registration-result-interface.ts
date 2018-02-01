import RegistrationResultInterface from '../registration-result-interface'

export default interface UserRegistrationResultInterface
  extends RegistrationResultInterface {
  tenant: string
  sub: string
  scope?: any
}
