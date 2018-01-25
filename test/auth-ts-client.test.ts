import AuthClient from '../src/auth-ts-client'

/**
 * AuthClient test
 */
describe('AuthClient test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('AuthClientClass is instantiable', () => {
    expect(new AuthClient()).toBeInstanceOf(AuthClient)
  })
})
