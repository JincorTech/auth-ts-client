import * as request from 'web-request'
import AccessTokenResponseInterface from './interfaces/access-token-response-interface'
import AuthClientInterface from './interfaces/auth-client-interface'
import AuthUserDataInterface from './interfaces/user/auth-user-data-interface'
import TenantRegistrationResultInterface from './interfaces/tenant/tenant-registration-result-interface'
import TenantVerificationResponseInterface from './interfaces/tenant/tenant-verification-response-interface'
import TenantVerificationResultInterface from './interfaces/tenant/tenant-verification-result-interface'
import UserLoginDataInterface from './interfaces/user/user-login-data-interface'
import UserRegistrationResultInterface from './interfaces/user/user-registration-result-interface'
import UserVerificationResponseInterface from './interfaces/user/user-verification-response-interface'
import UserVerificationResultInterface from './interfaces/user/user-verification-result-interface'

export default class AuthClient implements AuthClientInterface {
  private baseUri: string

  constructor(baseUrl?: string) {
    this.baseUri = baseUrl || 'http://auth:3000'

    request.defaults({
      throwResponseError: true
    })
  }

  public async registerTenant(
    email: string,
    password: string
  ): Promise<TenantRegistrationResultInterface> {
    const response = await request.json<
      TenantRegistrationResultInterface
    >('/tenant', {
      baseUrl: this.baseUri,
      method: 'POST',
      body: {
        email,
        password
      }
    })

    return response
  }

  public async loginTenant(
    email: string,
    password: string
  ): Promise<AccessTokenResponseInterface> {
    const response = await request.json<
      AccessTokenResponseInterface
    >('/tenant/login', {
      baseUrl: this.baseUri,
      method: 'POST',
      body: {
        email,
        password
      }
    })

    return response
  }

  public async verifyTenantToken(
    token: string
  ): Promise<TenantVerificationResultInterface> {
    return (await request.json<
      TenantVerificationResponseInterface
    >('/tenant/verify', {
      baseUrl: this.baseUri,
      method: 'POST',
      body: {
        token
      }
    })).decoded
  }

  public async logoutTenant(token: string): Promise<void> {
    await request.json<TenantVerificationResultInterface>('/tenant/logout', {
      baseUrl: this.baseUri,
      method: 'POST',
      body: {
        token
      }
    })
  }

  public async createUser(
    userData: AuthUserDataInterface,
    tenantToken: string
  ): Promise<UserRegistrationResultInterface> {
    const response = await request.json<
      UserRegistrationResultInterface
    >('/user', {
      baseUrl: this.baseUri,
      method: 'POST',
      body: userData,
      headers: {
        Authorization: `Bearer ${tenantToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    return response
  }

  public async loginUser(
    userData: UserLoginDataInterface,
    tenantToken: string
  ): Promise<AccessTokenResponseInterface> {
    const response = await request.json<AccessTokenResponseInterface>('/auth', {
      baseUrl: this.baseUri,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tenantToken}`
      },
      body: userData
    })

    return response
  }

  public async verifyUserToken(
    userToken: string,
    tenantToken: string
  ): Promise<UserVerificationResultInterface> {
    return (await request.json<
      UserVerificationResponseInterface
    >('/auth/verify', {
      baseUrl: this.baseUri,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tenantToken}`
      },
      body: {
        token: userToken
      }
    })).decoded
  }

  public async logoutUser(
    userToken: string,
    tenantToken: string
  ): Promise<void> {
    await request.json<string>('/auth/logout', {
      baseUrl: this.baseUri,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tenantToken}`
      },
      body: {
        token: userToken
      }
    })
  }

  public async deleteUser(
    userLogin: string,
    tenantToken: string
  ): Promise<void> {
    await request.json<void>(`/user/${userLogin}`, {
      baseUrl: this.baseUri,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tenantToken}`
      }
    })
  }
}
