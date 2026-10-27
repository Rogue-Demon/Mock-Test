import express from "express"
import cors from "cors";
import pool from "./db.js"


const app = express();

app.use(express.json())
app.use(cors())

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM profiles")
    console.log(result.rows)
    res.json({
        msg: "Welcome to the backend",
        users: result.rows
    })
} catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal server error" })
}

})

app.get("/events", async (req, res) => {
    try {
        const searchTerm = req.query.search;
        if (typeof searchTerm !== "string" || !searchTerm.trim()) {
            return res.status(400).json({ success: false, msg: "Please enter a title, date, or venue to search." });
        }

        const searchPattern = `%${searchTerm.trim()}%`;
        const result = await pool.query(
            `SELECT * FROM events
             WHERE title ILIKE $1
                OR venue ILIKE $1
                OR date::text ILIKE $1`,
            [searchPattern]
        );

        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Could not search for events." });
    }
})

app.post("/events", async (req, res) => {
    try {
        const { title, venue, date, time, totalSeats } = req.body;
        if (!title || !venue || !date || !Number.isInteger(totalSeats) || totalSeats < 1) {
            return res.status(400).json({ msg: "Please provide all required fields" })
        }

        const result = time
            ? await pool.query(
                'INSERT INTO events (title, venue, date, "time", totalSeats) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [title, venue, date, time, totalSeats]
            )
            : await pool.query(
                'INSERT INTO events (title, venue, date, totalSeats) VALUES ($1, $2, $3, $4) RETURNING *',
                [title, venue, date, totalSeats]
            );
        res.status(201).json({ success: true, msg: "Event created successfully", data: result.rows[0] })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Internal server error" })

    }
})




app.get("/profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM profiles WHERE id=$1", [id])
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Profile not found" })
        }
        res.json({ success: true, data: result.rows[0] })
    } catch (err) {
        res.status(500).json({ success: false, msg: "Internal server error" })
    }
})


app.put("/profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, age } = req.body;

        const result = await pool.query(
            `UPDATE profiles
             SET name = $1,
                 email = $2,
                 phone = $3,
                 address = $4,
                 age = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [name, email, phone, address, age, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Profile not found"
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err); 

        res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
