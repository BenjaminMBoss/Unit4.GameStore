const pg = require("pg")
const client = new pg.Client("postgres://localhost/gamestore_db")
const express = require("express")
const app = express();
// body Parser for .post
app.use(express.json());

//////////////////// Get, Post, Put, Delete for VideoGames //////////////////////
app.get('/api/videogames', async (req,res,next) => {
    try {
        const SQL = `
        SELECT *
        FROM videogames
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/videogames/:id', async (req,res,next) => {
    try {
        const SQL = `
        SELECT * FROM videogames WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        if (!response.rows.length) {
            next( {
                name: "id error",
                message: `Videogame with id: ${req.params.id} does not exist`
            })
        }   else {
            res.send(response.rows)
        }
        
    } catch (error) {
        next(error)
    }
})

app.post('/api/videogames', async (req,res,next) => {
    try {
        const SQL = `
        INSERT INTO videogames(name, genre) 
        VALUES($1, $2)
        RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.genre])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.put('/api/videogames/:id', async (req,res,next) => {
    try {
        const SQL = `
        UPDATE videogames
        SET name = $1, genre = $2
        WHERE id = $3
        `
        const response = await client.query(SQL, [req.body.name, req.body.genre, req.params.id])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.delete('/api/videogames/:id', async (req,res,next) => {
    try {
        const SQL = `
        DELETE FROM videogames WHERE id=$1
        `
        const response = await client.query(SQL,[req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})
///////////////// Get, Post, Put, Delete for BoardGames /////////////////////////////

app.get('/api/boardgames', async (req,res,next) => {
    try {
        const SQL = `
        SELECT *
        FROM boardgames
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/boardgames/:id', async (req,res,next) => {
    try {
        const SQL = `
        SELECT * FROM boardgames WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        if (!response.rows.length) {
            next( {
                name: "id error",
                message: `Boardgame with id: ${req.params.id} does not exist`
            })
        }   else {
            res.send(response.rows)
        }
        
    } catch (error) {
        next(error)
    }
})

app.post('/api/boardgames', async (req,res,next) => {
    try {
        const SQL = `
        INSERT INTO boardgames(name, minplayers, maxplayers) 
        VALUES($1, $2, $3)
        RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.minplayers, req.body.maxplayers])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.put('/api/boardgames/:id', async (req,res,next) => {
    try {
        const SQL = `
        UPDATE boardgames
        SET name = $1, minplayers = $2, maxplayers = $3
        WHERE id = $4
        `
        const response = await client.query(SQL, [req.body.name, req.body.minplayers, req.body.maxplayers, req.params.id])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.delete('/api/boardgames/:id', async (req,res,next) => {
    try {
        const SQL = `
        DELETE FROM boardgames WHERE id=$1
        `
        const response = await client.query(SQL,[req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

app.use((error,req,res,next) => {
    res.status(500)
    res.send(error)
})

app.use('*', (req,res,next) => {
    res.send('No such route exists')
})

//////////////////// Creating Tables + Seeding /////////////////////////////////
const init = async () => {
    await client.connect();
    console.log('connected to db')
    
    const SQL = `
        DROP TABLE IF EXISTS videogames;
        DROP TABLE IF EXISTS boardgames;

        CREATE TABLE videogames(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            genre VARCHAR(50)
        );

        INSERT INTO videogames(name, genre) VALUES ('Stardew Valley', 'Farming Simulation');
        INSERT INTO videogames(name, genre) VALUES ('Apex Legends', 'First-person Shooter');
        INSERT INTO videogames(name, genre) VALUES ('Pokemon Violet', 'Role-playing');

        CREATE TABLE boardgames(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            minplayers INTEGER,
            maxplayers INTEGER
        );

        INSERT INTO boardgames(name, minplayers, maxplayers) VALUES ('The Game of Life', 2, 6);
        INSERT INTO boardgames(name, minplayers, maxplayers) VALUES ('Risk', 3, 6);
        INSERT INTO boardgames(name, minplayers, maxplayers) VALUES ('Stratego', 2, 2);
    `
    await client.query(SQL)
    console.log('created table and seeded')

    const port = 3000;
    app.listen(port, () => {
        console.log(`listening at port ${port}`)
    })
}
init();