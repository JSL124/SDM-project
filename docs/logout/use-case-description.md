# Use Case Description: Multi-Actor Logout

## Taiga ID
#40

## Name
Multi-Actor Logout

## Description
This use case describes how a `Fundraiser`, `Donee`, `User admin`, or `Platform manager` logs out of the system to securely end their session.

## Trigger
The actor selects the logout option on the system interface.

## Actor(s)
- Fundraiser
- Donee
- User admin
- Platform manager

## Preconditions
- The actor is currently logged into the system.
- The system is available and running.

## Normal Flow
1. The actor clicks the logout button or selects the logout option.
2. `LogoutPage` receives the logout request.
3. `LogoutPage` sends the request to `LogoutController.logout()`.
4. `LogoutController` processes the logout request.
5. `LogoutController` returns control to `LogoutPage.displayLoginPage()`.
6. `LogoutPage` displays the login page.

## Alternative Flow
NIL
