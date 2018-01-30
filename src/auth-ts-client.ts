import * as request from 'web-request';
import AccessTokenResponseInterface from './interfaces/access-token-response-interface';
import AuthClientInterface from './interfaces/auth-client-interface';
import AuthUserDataInterface from './interfaces/user/auth-user-data-interface';
import TenantRegistrationResultInterface from './interfaces/tenant/tenant-registration-result-interface';
import TenantVerificationResponseInterface from './interfaces/tenant/tenant-verification-response-interface';
import TenantVerificationResultInterface from './interfaces/tenant/tenant-verification-result-interface';
import UserLoginDataInterface from './interfaces/user/user-login-data-interface';
import UserRegistrationResultInterface from './interfaces/user/user-registration-result-interface';
import UserVerificationResponseInterface from './interfaces/user/user-verification-response-interface';
import UserVerificationResultInterface from './interfaces/user/user-verification-result-interface';
import winston, { LoggerInstance } from 'winston';

/**
 * Auth client
 */
export default class AuthClient implements AuthClientInterface {
  /**
   * Base URL
   *
   * @type {string}
   */
  private baseUri: string;

  /**
   * Logger
   *
   * @type {LoggerInstance}
   */
  private logger: LoggerInstance;

  /**
   * Constructor
   *
   * @param {string} baseUrl Base URL
   */
  constructor(baseUrl?: string) {
    this.baseUri = baseUrl || 'http://auth:3000';

    request.defaults({
      throwResponseError: true
    });

    this.setDefaultLogger();
  }

  /**
   * Set Logger
   *
   * @param {LoggerInstance} logger Logger
   */
  public setLogger(logger: LoggerInstance) {
    this.logger = logger;
  }

  /**
   * Register tenant
   *
   * @param {string} email Email of tenant
   * @param {string} password Password of tenant
   *
   * @return {Promise<TenantRegistrationResultInterface>}
   */
  public async registerTenant(
    email: string,
    password: string
  ): Promise<TenantRegistrationResultInterface> {
    this.logger.info(`Registering tenant with email: ${email}`);

    const response = await request.json<TenantRegistrationResultInterface>(
      '/tenant',
      {
        baseUrl: this.baseUri,
        method: 'POST',
        body: {
          email,
          password
        }
      }
    );

    return response;
  }

  /**
   * Login tenant
   *
   * @param {string} email Email of tenant
   * @param {string} password Password of tenant
   *
   * @return {Promise<AccessTokenResponseInterface>}
   */
  public async loginTenant(
    email: string,
    password: string
  ): Promise<AccessTokenResponseInterface> {
    this.logger.info(`Login tenant with email: ${email}`);

    const response = await request.json<AccessTokenResponseInterface>(
      '/tenant/login',
      {
        baseUrl: this.baseUri,
        method: 'POST',
        body: {
          email,
          password
        }
      }
    );

    return response;
  }

  /**
   * Verify token tenant
   *
   * @param {string} token Token of tenant
   *
   * @return {Promise<TenantVerificationResultInterface>}
   */
  public async verifyTenantToken(
    token: string
  ): Promise<TenantVerificationResultInterface> {
    this.logger.info(`Verify tenant with token: ${token}`);

    const response = (await request.json<TenantVerificationResponseInterface>(
      '/tenant/verify',
      {
        baseUrl: this.baseUri,
        method: 'POST',
        body: {
          token
        }
      }
    )).decoded;

    return response;
  }

  /**
   * Logout tenant
   *
   * @param {string} token Token of tenant
   *
   * @return {Promise<void>}
   */
  public async logoutTenant(token: string): Promise<void> {
    this.logger.info(`Logout tenant with token: ${token}`);

    await request.json<TenantVerificationResultInterface>('/tenant/logout', {
      baseUrl: this.baseUri,
      method: 'POST',
      body: {
        token
      }
    });
  }

  /**
   * Create user
   *
   * @param {AuthUserDataInterface} userData User data
   * @param {string} tenantToken Token of tenant
   *
   * @return {Promise<UserRegistrationResultInterface>}
   */
  public async createUser(
    userData: AuthUserDataInterface,
    tenantToken: string
  ): Promise<UserRegistrationResultInterface> {
    this.logger.info(`Create user with data: ${JSON.stringify(userData)}`);

    const response = await request.json<UserRegistrationResultInterface>(
      '/user',
      {
        baseUrl: this.baseUri,
        method: 'POST',
        body: userData,
        headers: {
          Authorization: `Bearer ${tenantToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    return response;
  }

  /**
   * Login user
   *
   * @param {UserLoginDataInterface} userData User login data
   * @param {string} tenantToken Token of tenant
   *
   * @return {Promise<AccessTokenResponseInterface>}
   */
  public async loginUser(
    userData: UserLoginDataInterface,
    tenantToken: string
  ): Promise<AccessTokenResponseInterface> {
    this.logger.info(`Login user with data: ${JSON.stringify(userData)}`);

    const response = await request.json<AccessTokenResponseInterface>('/auth', {
      baseUrl: this.baseUri,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tenantToken}`
      },
      body: userData
    });

    return response;
  }

  /**
   * Verify user token
   *
   * @param {string} userToken Token of user
   * @param {string} tenantToken Token of tenant
   *
   * @return {Promise<UserVerificationResultInterface>}
   */
  public async verifyUserToken(
    userToken: string,
    tenantToken: string
  ): Promise<UserVerificationResultInterface> {
    this.logger.info(`Verify user with token: ${userToken}`);

    const response = (await request.json<UserVerificationResponseInterface>(
      '/auth/verify',
      {
        baseUrl: this.baseUri,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tenantToken}`
        },
        body: {
          token: userToken
        }
      }
    )).decoded;

    return response;
  }

  /**
   * Logout token
   *
   * @param {string} userToken Token of user
   * @param {string} tenantToken Token of tenant
   *
   * @return {Promise<void>}
   */
  public async logoutUser(
    userToken: string,
    tenantToken: string
  ): Promise<void> {
    this.logger.info(`Logout user with token: ${userToken}`);

    await request.json<string>('/auth/logout', {
      baseUrl: this.baseUri,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tenantToken}`
      },
      body: {
        token: userToken
      }
    });
  }

  /**
   * Delete user
   *
   * @param {string} userLogin Token of user
   * @param {string} tenantToken Token of tenant
   */
  public async deleteUser(
    userLogin: string,
    tenantToken: string
  ): Promise<void> {
    this.logger.info(`Delete user with login: ${userLogin}`);

    await request.json<void>(`/user/${userLogin}`, {
      baseUrl: this.baseUri,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tenantToken}`
      }
    });
  }

  /**
   * Set default logger
   */
  public setDefaultLogger() {
    winston.configure({
      level: 'warn',
      transports: [new winston.transports.Console()]
    });

    this.logger = winston;
  }
}
