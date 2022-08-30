const login = async(auth0) => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin
    })
};

const logout = async (auth0) => {

      await auth0.logout({
        returnTo: window.location.origin
      })
};

module.exports = { login, logout }