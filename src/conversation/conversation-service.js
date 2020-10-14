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
      .where('con.user_1', user_id)
      .orWhere('con.user_2', user_id)
  },

  getById(db, id, user_id) {
    return ConversationService.getUsersConversations(db, user_id)
      .where('con.id', id)
      .first()
  }, 

  // beginNewConversation(db, newConversation) {
  //   return db
  //     .insert(newConversation)
  //     .into('conversation')
  //     .returning('*')
  //     .then(([conversation]) => {
  //       return ConversationService.getById(
  //         db,
  //         conversation.id,
  //         new
  //       )
  //     })
  // }
}

module.exports = ConversationService