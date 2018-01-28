import AccessTokenResponseInterface from './access-token-response-interface'
import AuthUserDataInterface from './user/auth-user-data-interface'
import TenantRegistrationResultInterface from './tenant/tenant-registration-result-interface'
import TenantVerificationResultInterface from './tenant/tenant-verification-result-interface'
import UserLoginDataInterface from './user/user-login-data-interface'
import UserRegistrationResultInterface from './user/user-registration-result-interface'
import UserVerificationResultInterface from './user/user-verification-result-interface'

export default interface AuthClientInterface {
  registerTenant(
    email: string,
    password: string
  ): Promise<TenantRegistrationResultInterface>
  loginTenant(
    email: string,
    password: string
  ): Promise<AccessTokenResponseInterface>
  verifyTenantToken(token: string): Promise<TenantVerificationResultInterface>
  logoutTenant(token: string): Promise<void>
  createUser(
    data: AuthUserDataInterface,
    tenantToken: string
  ): Promise<UserRegistrationResultInterface>
  loginUser(
    data: UserLoginDataInterface,
    tenantToken: string
  ): Promise<AccessTokenResponseInterface>
  verifyUserToken(
    token: string,
    tenantToken: string
  ): Promise<UserVerificationResultInterface>
  logoutUser(token: string, tenantToken: string): Promise<void>
  deleteUser(login: string, tenantToken: string): Promise<void>
}
