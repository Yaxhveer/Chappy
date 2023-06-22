import pool from '../config/postgres.js'

export const createChatRoom = async (req, res) => {

    const { firstUserID, secondUserID } = req.body;
    console.log(1.1, [firstUserID, secondUserID]);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const flag = await client.query(
            `select exists (select from chat_room where members = (ARRAY [$1, $2]) or members = (ARRAY [$2, $1]));`,
            [firstUserID, secondUserID]
        );

        if (flag.rows[0].exists){
            console.log("ChatRoom already exists.");
            await client.query('COMMIT');
            res.json({done: false, message: "ChatRoom already exists."})
        } else {
            const aa = await client.query(
                `INSERT into chat_room(members) values (ARRAY [$1, $2]) RETURNING *;`,
                [firstUserID, secondUserID]
            )
            await client.query('COMMIT');
            console.log(1.1, aa.rows[0]);
            res.json(aa.rows[0])
        }
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

export const getChatRoom = async (req, res) => {
    try {
        const chatRooms = await pool.query('SELECT chat_room_id, members from chat_room where $1 = ANY(members);',[req.params.userID])
        console.log(1.2, chatRooms.rows);
        res.json(chatRooms.rows);
    } catch (e) {
        res.json({ done: false, message: e })
        console.log(1.2, e);
    }
}

export const deleteChatRoom = async (req, res) => {
    try {
        console.log(1.3, req.params.chatRoomID);
        await pool.query('DELETE from chat_message where chat_room_id = $1;',[req.params.chatRoomID])
        const chatRooms = await pool.query('DELETE from chat_room where chat_room_id = $1;',[req.params.chatRoomID])
        console.log(1.3, chatRooms);
        res.json({ done: true });
    } catch (e) {
        res.json({ done: false, message: e })
        console.log(1.3, e);
    }
}