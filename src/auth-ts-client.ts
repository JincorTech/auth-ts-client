import * as request from 'web-request'

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
  ): Promise<TenantRegistrationResult> {
    const response = await request.json<TenantRegistrationResult>('/tenant', {
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
  ): Promise<AccessTokenResponse> {
    const response = await request.json<AccessTokenResponse>('/tenant/login', {
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
  ): Promise<TenantVerificationResult> {
    return (await request.json<TenantVerificationResponse>('/tenant/verify', {
      baseUrl: this.baseUri,
      method: 'POST',
      body: {
        token
      }
    })).decoded
  }

  public async logoutTenant(token: string): Promise<void> {
    await request.json<TenantVerificationResult>('/tenant/logout', {
      baseUrl: this.baseUri,
      method: 'POST',
      body: {
        token
      }
    })
  }

  public async createUser(
    userData: AuthUserData,
    tenantToken: string
  ): Promise<UserRegistrationResult> {
    const response = await request.json<UserRegistrationResult>('/user', {
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
    userData: UserLoginData,
    tenantToken: string
  ): Promise<AccessTokenResponse> {
    const response = await request.json<AccessTokenResponse>('/auth', {
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
  ): Promise<UserVerificationResult> {
    return (await request.json<UserVerificationResponse>('/auth/verify', {
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
