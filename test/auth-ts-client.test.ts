import AuthClient from '../src/auth-ts-client'
import nock from 'nock'
import TenantRegistrationResultInterface from '../src/interfaces/tenant/tenant-registration-result-interface'
import AccessTokenResponseInterface from '../src/interfaces/access-token-response-interface'
import TenantVerificationResponseInterface from '../src/interfaces/tenant/tenant-verification-response-interface'
import TenantVerificationResultInterface from '../src/interfaces/tenant/tenant-verification-result-interface'
import AuthUserDataInterface from '../src/interfaces/user/auth-user-data-interface'
import UserRegistrationResultInterface from '../src/interfaces/user/user-registration-result-interface'
import UserLoginDataInterface from '../src/interfaces/user/user-login-data-interface'
import { makeRe } from 'minimatch'
import UserVerificationResponseInterface from '../src/interfaces/user/user-verification-response-interface'
import UserVerificationResultInterface from '../src/interfaces/user/user-verification-result-interface'

const tenantEndpoint = nock('http://auth:3000')
  // register tenant
  .post('/tenant', {
    email: 'test@test.com',
    password: 'Password1'
  })
  .reply(200, {
    id: '2349389432',
    email: 'test@test.com',
    login: 'test@test.com'
  } as TenantRegistrationResultInterface)
  // login tenant
  .post('/tenant/login', {
    email: 'test@test.com',
    password: 'Password1'
  })
  .reply(200, {
    accessToken: 'jwt-token'
  } as AccessTokenResponseInterface)
  // verify token tenant
  .post('/tenant/verify', {
    token: 'jwt-token'
  })
  .reply(200, {
    decoded: {
      id: 'UUID',
      aud: 'Example',
      iat: 1243234,
      isTenant: true,
      jti: '1232123',
      login: 'test@test.com'
    } as TenantVerificationResultInterface
  } as TenantVerificationResponseInterface)
  // logout tenant
  .post('/tenant/logout', {
    token: 'jwt-token'
  })
  .reply(200, {
    result: 1
  })

const userEndpoint = nock('http://auth:3000', {
  reqheaders: {
    Authorization: 'Bearer jwt-token'
  }
})
  // create user
  .post('/user', {
    email: 'test@test.com',
    login: 'test@test.com',
    password: 'Password1',
    scope: 'admin',
    sub: '123'
  } as AuthUserDataInterface)
  .reply(200, {
    email: 'test@test.com',
    id: 'UUID',
    login: 'test@test.com',
    scope: 'admin',
    sub: '123',
    tenant: 'tenant'
  } as UserRegistrationResultInterface)
  // login user
  .post('/auth', {
    deviceId: '123',
    login: 'test@test.com',
    password: 'Password1'
  } as UserLoginDataInterface)
  .reply(200, {
    accessToken: 'user-jwt-token'
  } as AccessTokenResponseInterface)
  // verify user
  .post('/auth/verify', {
    token: 'user-jwt-token'
  })
  .reply(200, {
    decoded: {
      aud: 'Example',
      deviceId: '123',
      exp: 123456,
      iat: 123456,
      id: 'UUID',
      jti: '1231',
      login: 'test@test.com',
      scope: 'admin',
      sub: '123'
    } as UserVerificationResultInterface
  } as UserVerificationResponseInterface)
  // logout user
  .post('/auth/logout', {
    token: 'user-jwt-token'
  })
  .reply(200, {
    result: 1
  })
  // delete user
  .delete('/user/test@test.com')
  .reply(200, {
    result: 1
  })

const client = new AuthClient('http://auth:3000')

/**
 * AuthClient test
 */
describe('AuthClient test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('AuthClientClass is instantiable', () => {
    expect(client).toBeInstanceOf(AuthClient)
  })

  it('Register tenant', () => {
    return client.registerTenant('test@test.com', 'Password1').then(result => {
      expect(result).toEqual({
        id: '2349389432',
        email: 'test@test.com',
        login: 'test@test.com'
      })
    })
  })

  it('Login tenant', () => {
    return client.loginTenant('test@test.com', 'Password1').then(result => {
      expect(result).toEqual({
        accessToken: 'jwt-token'
      })
    })
  })

  it('Verify tenant', () => {
    return client.verifyTenantToken('jwt-token').then(result => {
      expect(result).toEqual({
        id: 'UUID',
        aud: 'Example',
        iat: 1243234,
        isTenant: true,
        jti: '1232123',
        login: 'test@test.com'
      })
    })
  })

  it('Logout tenant', () => {
    return client.logoutTenant('jwt-token').then(result => {
      expect(true)
    })
  })

  it('Create User', () => {
    expect.assertions(1)
    return client
      .createUser(
        {
          email: 'test@test.com',
          login: 'test@test.com',
          password: 'Password1',
          scope: 'admin',
          sub: '123'
        },
        'jwt-token'
      )
      .then(result => {
        expect(result).toEqual({
          email: 'test@test.com',
          id: 'UUID',
          login: 'test@test.com',
          scope: 'admin',
          sub: '123',
          tenant: 'tenant'
        })
      })
  })

  it('Login user', () => {
    return client
      .loginUser(
        {
          deviceId: '123',
          login: 'test@test.com',
          password: 'Password1'
        },
        'jwt-token'
      )
      .then(result => {
        expect(result).toEqual({
          accessToken: 'user-jwt-token'
        })
      })
  })

  it('Verify user', () => {
    return client
      .verifyUserToken('user-jwt-token', 'jwt-token')
      .then(result => {
        expect(result).toEqual({
          aud: 'Example',
          deviceId: '123',
          exp: 123456,
          iat: 123456,
          id: 'UUID',
          jti: '1231',
          login: 'test@test.com',
          scope: 'admin',
          sub: '123'
        })
      })
  })

  it('Logout user', () => {
    return client.logoutUser('user-jwt-token', 'jwt-token').then(result => {
      expect(true)
    })
  })

  it('Delete user', () => {
    return client.deleteUser('test@test.com', 'jwt-token').then(result => {
      expect(true)
    })
  })
})
