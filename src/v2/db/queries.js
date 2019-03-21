const createTable = {
  usersTable: `CREATE TABLE IF NOT EXISTS
        usersTable(
            id SERIAL PRIMARY KEY NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            firstName VARCHAR(100) NOT NULL,
            lastName VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            secondaryEmail VARCHAR(100) NOT NULL
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
            parentMessageId INT,
            senderEmail VARCHAR(100),
            receiverEmail VARCHAR(100),
            senderStatus VARCHAR(100) DEFAULT NULL,
            receiverStatus VARCHAR(100) DEFAULT NULL,
            status VARCHAR(100) NOT NULL,
            FOREIGN KEY (senderEmail) REFERENCES usersTable(email) ON DELETE SET NULL
        )`,

  groupTable: `CREATE TABLE IF NOT EXISTS
        groupTable(
            id SERIAL NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            createdBy VARCHAR(100) NOT NULL,
            role VARCHAR (250),
            FOREIGN KEY(createdBy) REFERENCES usersTable(email) ON DELETE CASCADE,
            PRIMARY KEY(id, createdBy)
        )`,

  groupMembersTable: `CREATE TABLE IF NOT EXISTS
        groupMembersTable(
            groupId INT NOT NULL,
            userId INT NOT NULL,
            userRole VARCHAR(100),
            FOREIGN KEY(groupId) REFERENCES groupTable(id) ON DELETE CASCADE,
            FOREIGN KEY(userId) REFERENCES usersTable(id) ON DELETE CASCADE,
            PRIMARY KEY(groupId, userId)
        )`,

  alterMessagesTable: `ALTER TABLE messagesTable
    ADD FOREIGN KEY(parentMessageId) REFERENCES messagesTable(id) ON DELETE SET NULL`,

  foreignReceiver: `ALTER TABLE messagesTable
    ADD FOREIGN KEY(receiverEmail) REFERENCES usersTable(email) ON DELETE SET NULL`,
};

const dropTable = {
  usersTable: 'DROP TABLE IF EXISTS  usersTable CASCADE',
  contactsTable: 'DROP TABLE IF EXISTS contactsTable CASCADE',
  messagesTable: 'DROP TABLE IF EXISTS messagesTable CASCADE',
  groupTable: 'DROP TABLE IF EXISTS groupTable CASCADE',
  groupMembersTable: 'DROP TABLE IF EXISTS groupMembersTable CASCADE',
};

export default {
  createTable,
  dropTable,
};
