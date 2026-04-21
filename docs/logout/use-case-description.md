# Use Case Description: Profile Logout

## Taiga ID
#40

## Name
Profile Logout

## Description
This use case describes how any logged-in profile type logs out of the system to end the current browser login state.

## Trigger
The actor selects the logout option on the system interface.

## Actor(s)
Any logged-in profile type

## Preconditions
- The actor is currently logged into the system.
- The system is available and running.

## Normal Flow
1. The actor clicks the logout button or selects the logout option.
2. `LogoutPage` receives the logout request.
3. `LogoutPage.logout()` clears the stored login/profile state.
4. `LogoutPage` displays the login page.

## Alternative Flow
NIL
