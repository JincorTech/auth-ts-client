# Auth client

This is a client library which encapsulates interaction with [Auth service](https://github.com/JincorTech/backend-auth). With its help you can:

1. Register users and tenants.
2. Get tokens for users and tenants after authorization.
3. Perform verification of tokens for users and tenants.
4. Deactivate tokens for users and tenants.
5. Remove users.

The user can be attached to several tenants through the field tenant. It is filled from the tenant's token in the [Auth service](https://github.com/JincorTech/backend-auth) service.

## Usage

### Initialize Auth client

```javascript
let client = new AuthClient('http://auth:3000')
```

### Work with Tenant

```javascript
let registerResult = await client.registerTenant('test@test.com', 'Password1')
// { id: 'af8b13ea-02a9-4e73-b8d9-58c8215757b9', email: 'test@test.com', login: '...' }
let token = await client.loginTenant('test@test.com', 'Password1')
```

### Work with User

To work with users you need a tenant token. Field `scope` is optional.

```javascript
let user = await client.createUser({
    email: 'test@test.com',
    login: 'test@test.com',
    password: 'Password1',
    scope: 'admin',
    sub: '123'
    }, 'tenant-token'
)
// { id: '55096b7d-0f14-446a-b50d-ee6bc8431e39', email: 'test@test.com', login:... }
```

More details can be received in the tests.


### Project setup

1. Clone the repo
2. `cd /path/to/repo`
3. `docker-compose build` - build development containers
4. `docker-compose run --rm authclient sh -c "yarn"`

#### Local testing

To run all tests just type `docker-compose run --rm authclient sh -c "yarn test"`