const bcrypt = require('bcryptjs')

// eslint-disable-next-line no-useless-escape
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UserService = {
  getCurrentUserProfile(db, userId) {
    return db
      .from('user')
      .select(
        'username',
        'display_name',
        'active_conversations',
        'bio',
        'location',
        'fa_icon'
      )
      .where({ id: userId })
  },
  hasUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user)
  },
  updateUser(db, userId, updateFields) {
    return db('user')
      .whereRaw('id = ?', [userId])
      .update(updateFields,['display_name', 'username', 'bio', 'location', 'fa_icon'])
  },
  validatePassword(password) {
    if(password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if(password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if(password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number, and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      display_name: user.display_name,
      username: user.username
    }
  },
}

module.exports = UserService