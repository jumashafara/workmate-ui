// const API_BASE_URL = 'https://workmate.api.dev.nonproftinnovations.io'
// const API_BASE_URL = 'http://workmate.api.nonproftinnovations.io/'
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://workmate.api.dev.nonproftinnovations.io' 
  : 'http://localhost:8000'
const API_ENDPOINT = `${API_BASE_URL}/api`
const ACCOUNTS_ENDPOINT = `${API_BASE_URL}/accounts`

// export
export { API_BASE_URL, API_ENDPOINT, ACCOUNTS_ENDPOINT }
