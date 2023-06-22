import pool from '../config/postgres.js'

export const createMessage = async (req, res) => {
    const { msg, chatRoomID, userID } = req.body;
    console.log(2.1, [ msg, chatRoomID, userID ]);

    const client = await pool.connect();
    try{
        await client.query('BEGIN');

        const message = await client.query(
            'INSERT into chat_message(chat_room_id, sender, message_data) values ($1, $2, $3) RETURNING *;',
            [chatRoomID, userID, msg]
        );
        await client.query('COMMIT');
        console.log(2.1, message.rows);
        res.json(message.rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

export const getMessages = async (req, res) => {
    try{
        const chatMessage = await pool.query('SELECT message_data, sender, time_id from chat_message values where chat_room_id=$1;', [req.params.chatRoomID]);
        console.log(2.2, chatMessage.rows);
        res.json(chatMessage.rows);
    } catch (e) {
        res.json({ done: false, message: e })
        console.log(2.2, e);
    }
}