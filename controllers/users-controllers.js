const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers',
  },
]

const getUsers = (req, res, next) => {
  res.json({users: DUMMY_USERS})
}
const signup = (req, res, next) => {}
const login = (req, res, next) => {}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
