export const TEST_DATA = {
  users: {
    standard: {
      username: 'standard_user',
      password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    },
    lockedOut: {
      username: 'locked_out_user',
      password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    },
    invalid: {
      username: 'invalid_user',
      password: 'wrong_password',
    },
  },
  errorMessages: {
    lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
    usernameRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
    firstNameRequired: 'Error: First Name is required',
  },
  checkoutInfo: {
    firstName: 'Vitor',
    lastName: 'Hugo',
    postalCode: '01000-000',
  },
  products: {
    backpack: 'Sauce Labs Backpack',
    bikeLight: 'Sauce Labs Bike Light',
  },
};
