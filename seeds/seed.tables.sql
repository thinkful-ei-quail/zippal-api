BEGIN;

TRUNCATE
  "message",
  "conversation",
  "user";

INSERT INTO "user" ("id", "username", "display_name", "password", "active_conversations", "bio", "location", "fa_icon")
VALUES
  (1, 'Test_user1', 'Mark', '$2a$12$QbwJSK2p6QropmLqkRd3t.J4F2HwFEmS1cJ77brMa5SM1QcB3B9I2', 4, 'Just a test user on a website', 'USA', 'laptop-code'),
  (2, 'Test_user2', 'Tom', '$2a$12$QbwJSK2p6QropmLqkRd3t.J4F2HwFEmS1cJ77brMa5SM1QcB3B9I2', 1, 'Just a test user on a website', 'USA', 'biking'),
  (3, 'Test_user3', 'Travis', '$2a$12$QbwJSK2p6QropmLqkRd3t.J4F2HwFEmS1cJ77brMa5SM1QcB3B9I2', 1, 'Just a test user on a website', 'USA', 'cat'),
  (4, 'Test_user4', 'Hayley', '$2a$12$QbwJSK2p6QropmLqkRd3t.J4F2HwFEmS1cJ77brMa5SM1QcB3B9I2', 1, 'Just a test user on a website', 'USA', 'music'),
  (5, 'Test_user5', 'Kasie', '$2a$12$QbwJSK2p6QropmLqkRd3t.J4F2HwFEmS1cJ77brMa5SM1QcB3B9I2', 0, 'Just a test user on a website', 'USA', 'gamepad'),
  (6, 'Test_user6', 'Anon', '$2a$12$QbwJSK2p6QropmLqkRd3t.J4F2HwFEmS1cJ77brMa5SM1QcB3B9I2', 0, 'Just a test user on a website', 'USA', 'dumbbell'),
  (7, 'Test_user7', 'Plini', '$2a$12$QbwJSK2p6QropmLqkRd3t.J4F2HwFEmS1cJ77brMa5SM1QcB3B9I2', 0, 'Just a test user on a website', 'USA', 'mountain'),
  (8, 'Test_user8', 'Morpheus', '$2a$12$QbwJSK2p6QropmLqkRd3t.J4F2HwFEmS1cJ77brMa5SM1QcB3B9I2', 0, 'Just a test user on a website', 'USA', 'theater-masks');

INSERT INTO "conversation" ("id", "user_1", "user_2", "user_1_turn", "user_2_turn")
VALUES
  (1, 1, 2, true, false), -- have unread new message
  (2, 1, 3, true, false), -- on 1st message, draft
  (3, 1, 4, false, true), -- 1 message sent, unread by user_2
  (4, 1, 5, true, false); -- 2 messages sent, user_1 has draft of 3

INSERT INTO "message" ("id", "conversation_id", "sender_id", "sender_status", "receiver_id", "receiver_status", "content", "date_sent", "is_read")
VALUES
  (1, 1, 1, 'Awaiting Reply', 2, 'Read', 'Hello Tom, we should start a band with Travis', '2020-10-19T17:52:45.039Z', true),
  (2, 1, 2, 'Sent', 1, 'Received', 'Sounds good, we can call it Blink-182', '2020-10-20T17:52:45.039Z', false),
  (3, 2, 1, 'Pending', 3, 'Awaiting Message', 'This is a draft of a partially written message', null, false),
  (4, 3, 1, 'Awaiting Reply', 4, 'Read', 'This is a complete message that has been sent but not viewed yet', '2020-10-19T17:52:45.039Z', true),
  (5, 4, 1, 'Awaiting Reply', 5, 'Read', 'Hello Kasie! (1st Message)', '2020-10-13T17:52:45.039Z', true),
  (6, 4, 5, 'Awaiting Reply', 1, 'Read', 'Hello Mark, how are you? (2nd Message)', '2020-10-14T17:52:45.039Z', true),
  (7, 4, 1, 'Pending', 5, 'Awaiting Message', 'Draft: Write some elegant words here... (3rd Message)', null, false);

SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));
SELECT setval('conversation_id_seq', (SELECT MAX(id) from "conversation"));
SELECT setval('message_id_seq', (SELECT MAX(id) from "message"));

COMMIT;



