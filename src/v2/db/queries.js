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
            parentMessageId VARCHAR(100) NOT NULL,
            senderEmail VARCHAR(100) NOT NULL,
            receiverEmail VARCHAR(100) NOT NULL,
            status VARCHAR(100) NOT NULL,
            FOREIGN KEY (senderEmail) REFERENCES usersTable(email) ON DELETE CASCADE,
            FOREIGN KEY (receiverEmail) REFERENCES usersTable(email) ON DELETE CASCADE
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
};

const dropTable = {
  usersTable: 'DROP TABLE IF EXISTS  usersTable CASCADE',
  contactsTable: 'DROP TABLE IF EXISTS contactsTable CASCADE',
  messagesTable: 'DROP TABLE IF EXISTS messagesTable CASCADE',
//   sentMessagesTable: 'DROP TABLE IF EXISTS sentMessagesTable CASCADE',
//   inboxMessagesTable: 'DROP TABLE IF EXISTS inboxMessagesTable CASCADE',
  groupTable: 'DROP TABLE IF EXISTS groupTable CASCADE',
  groupMembersTable: 'DROP TABLE IF EXISTS groupMembersTable CASCADE',
};

export default {
  createTable,
  dropTable,
};
