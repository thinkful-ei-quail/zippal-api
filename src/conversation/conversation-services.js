const ConversationService = {
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
      )
      .where('con.user_1', user_id)
      .orWhere('con.user_2', user_id)
  },

  getById(db, id, user_id) {
    return ConversationService.getUsersConversations(db, user_id)
      .where('con.id', id)
      .first()
  }
}

module.exports = ConversationService