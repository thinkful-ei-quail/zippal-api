const ConversationService = {
  // get all conversations for a specific user
  getUsersConversations(db, user_id) {
    return db
      .from('conversation AS con')
      .select(
        'con.id',
        'con.user_1',
        'con.user_2',
        'con.date_created',
        'con.is_active',
        'con.user_1_turn',
        'con.user_2_turn',
      )
      .where({
        'con.user_1': user_id,
        'con.is_active': true
      })
      .orWhere({
        'con.user_2': user_id,
        'con.is_active': true
      })
  },

  getConversationTurns(db, id) {
    return db('conversation')
      .select('user_1_turn', 'user_2_turn')
      .where({ id })
      .first()
  },

  getDisplayNameAndIcon(db, userId) {
    return db('user')
      .select('display_name', 'fa_icon')
      .whereRaw('id = ?', [userId])
      .first()
  },

  getConversationMessages(db, conversation_id) {
    return db
      .from('message')
      .select('*')
      .where('conversation_id', conversation_id)
  },

  getById(db, id) {
    return db
      .from('conversation AS con')
      .select(
        'con.id',
        'con.date_created',
        'con.is_active',
        'con.user_1_turn',
        'con.user_2_turn',
        'user.display_name',
        'user.fa_icon'
      )
      .where('con.id', parseInt(id))
      .join('user', 'con.user_2', '=', 'user.id')
      .first()
  }, 

  getAvailableUsers(db) {
    // return an array of user ids that are open for pairing
    return db
      .from('user')
      .select(
        'id',
        'display_name',
        'username',
        'bio',
        'location',
        'fa_icon'
      )
      .where('active_conversations', '<', 5)
  },

  beginNewConversation(db, newConversation) {
    return db
      .insert(newConversation)
      .into('conversation')
      .returning('*')
  }, 

  incrementConversationCounts(db, user_1, user_2) {
    return db
      .transaction(async trx => {
        await trx('user')
          .where('id', user_1)
          .increment('active_conversations', 1)

        await trx('user')
          .where('id', user_2)
          .increment('active_conversations', 1)
      })
  }, 

  decrementConversationCounts(db, user_1, user_2) {
    return db
      .transaction(async trx => {
        await trx('user')
          .where('id', user_1)
          .decrement('active_conversations', 1)

        await trx('user')
          .where('id', user_2)
          .decrement('active_conversations', 1)
      })
  }, 

  deactivateConversation(db, conversationId) {
    return db
      .from('conversation')
      .where('id', conversationId)
      .update({
        is_active: false
      }, ['user_1', 'user_2'])
  }

}

// 1. See which active conversations are going on to see what users we have paired together
// 2. When make a request, send an array of active conversations to get the count
// 3. Query of the user table where active conversations less than 5 - returning user ids - filter out 
// - have an array with only available user ids
// 4. If user_2 already in five conversations, don't allow the pair and search for another user
// 5. 

module.exports = ConversationService