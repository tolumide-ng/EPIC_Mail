const createTable = {
  usersTable: `CREATE TABLE IF NOT EXISTS
        usersTable(
            id SERIAL PRIMARY KEY NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            firstName VARCHAR(100) NOT NULL,
            lastName VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL
        )`,

  contactsTable: `CREATE TABLE IF NOT EXISTS
        contactsTable(
            id SERIAL PRIMARY KEY NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL,
            firstName VARCHAR(100) NOT NULL,
            lastName VARCHAR(100) NOT NULL
        )`,

  messagesTable: `CREATE TABLE IF NOT EXISTS
        messagesTable(
            id SERIAL PRIMARY KEY NOT NULL UNIQUE,
            createdOn TIMESTAMP NOT NULL DEFAULT NOW(),
            subject VARCHAR(100) NOT NULL,
            message VARCHAR(255) NOT NULL,
            parentMessageId INT NOT NULL,
            senderEmail VARCHAR(100) NOT NULL,
            receiverEmail VARCHAR(100) NOT NULL,
            status VARCHAR(100) NOT NULL,
            FOREIGN KEY (senderEmail) REFERENCES usersTable(email) ON DELETE CASCADE,
            FOREIGN KEY (receiverEmail) REFERENCES usersTable(email) ON DELETE CASCADE
        )`,

  sentMessagesTable: `CREATE TABLE IF NOT EXISTS
        sentMessagesTable(
            senderId INT PRIMARY KEY NOT NULL,
            messageId INT NOT NULL,
            createdOn TIMESTAMP NOT NULL DEFAULT NOW(),
            FOREIGN KEY(senderId) REFERENCES usersTable(id) ON DELETE CASCADE,
            FOREIGN KEY(messageId) REFERENCES messagesTable(id) ON DELETE CASCADE
        )`,

  inboxMessagesTable: `CREATE TABLE IF NOT EXISTS
    inboxMessagesTable(
      receiverId INT PRIMARY KEY NOT NULL,
      messageId INT NOT NULL,
      createdOn TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY(receiverId) REFERENCES usersTable(id) ON DELETE CASCADE,
      FOREIGN KEY(messageId) REFERENCES messagesTable(id) ON DELETE CASCADE
    )`,

  groupTable: `CREATE TABLE IF NOT EXISTS
        groupTable(
            id SERIAL NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            createdBy VARCHAR(100) NOT NULL,
            FOREIGN KEY(createdBy) REFERENCES usersTable(email) ON DELETE CASCADE,
            PRIMARY KEY(id, createdBy)
        )`,

  groupMembersTable: `CREATE TABLE IF NOT EXISTS
        groupMembersTable(
            groupId INT NOT NULL PRIMARY KEY UNIQUE,
            memberId INT NOT NULL,
            createdBy VARCHAR(100) NOT NULL,
            FOREIGN KEY(groupId) REFERENCES groupTable(id) ON DELETE CASCADE,
            FOREIGN KEY(memberId) REFERENCES usersTable(id) ON DELETE CASCADE,
            FOREIGN KEY(createdBy) REFERENCES usersTable(email) ON DELETE CASCADE
        )`,

  alterMessagesTable: `ALTER TABLE messagesTable
    ADD FOREIGN KEY(parentMessageId) REFERENCES messagesTable(id) ON DELETE SET NULL`,
};

const dropTable = {
  usersTable: 'DROP TABLE IF EXISTS  usersTable CASCADE',
  contactsTable: 'DROP TABLE IF EXISTS contactsTable CASCADE',
  messagesTable: 'DROP TABLE IF EXISTS messagesTable CASCADE',
  groupTable: 'DROP TABLE IF EXISTS groupTable CASCADE',
  groupMembersTable: 'DROP TABLE IF EXISTS groupMembersTable CASCADE',
  sentMessagesTable: 'DROP TABLE IF EXISTS sentMessagesTable CASCADE',
  inboxMessagesTable: 'DROP TABLE IF EXISTS inboxMessagesTable CASCADE',
};

export default {
  createTable,
  dropTable,
};
