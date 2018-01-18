module.exports = (app, client) => {
    app.get("/createChillings", (req, res) => {
        if (req.session.user) {
            res.render("createChillings")
        } else { res.render("index") }
    })

    app.post("/createChillings", (req, res) => {
        let title = req.body.chillTitle,
            location = req.body.chillSpot,
            date = req.body.chillDate,
            information = req.body.chillInfo,
            time = req.body.chillTime,
            host_id = req.session.user.id

        // query to insert row with new event into the db
        var createChill = {
            text: `INSERT INTO chillings(title, location, date, information, time, host_id ) VALUES('${title}','${location}','${date}','${information}','${time}','${host_id}') RETURNING *;`
        }
        client.query(createChill, (error, res1) => {
            if (error) { throw error }
            var user_id = req.session.user.id
            //query all events that user has attended from junction table
            client.query(`SELECT ChillUsers.user_id, chillings.id, chillings.title, chillings.location, chillings.date, chillings.information, chillings.time, chillings.host_id , chillings.images FROM ChillUsers INNER JOIN chillings ON ChillUsers.chillings_id = chillings.id WHERE ChillUsers.user_id = ${user_id} ORDER by ID DESC;`, (err, result) => {

                if (err) { throw err }

                var allChillings = []

                for (var i = 0; i < result.rows.length; i++) {
                    var eventResult = result.rows[i]
                    allChillings.push(eventResult)
                }
                // query all events user has created
                client.query(`SELECT * FROM chillings WHERE host_id = '${host_id}' ORDER by ID DESC;`, (err, result1) => {

                    if (err) { throw err }

                    var hostChillings = []

                    for (var i = 0; i < result1.rows.length; i++) {
                        var eventResult = result1.rows[i]

                        hostChillings.push(eventResult)
                    }
                    res.render("profile", { allChillings: allChillings, hostChillings: hostChillings, user: req.session.user.username })
                })
            })
        })
    })
}