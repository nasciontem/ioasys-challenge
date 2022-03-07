/**
 * Exports constant containing useful functionalities for other
 * modules and components.
 */
const utils = {
  getInitForPostRequests(body) {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email, password: body.password })
    }
  },

}

export default utils