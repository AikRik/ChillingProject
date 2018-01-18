module.exports = (app, client) => {
    app.get("/attend", (req, res) => {
        if (req.session.user) {
            res.render("profile")
        } else {
            res.render("index")
        }
    })

    app.post("/attend", (req, res) => {
        var ChillId = req.body.chillId
        var userId = req.session.user.id
        //query to insert req.session.user.id and event id into junction table
        client.query(`INSERT INTO ChillUsers(user_id, chillings_id) VALUES (${userId}, ${ChillId});`, (error, result) => {
            //query all events that user has attended from junction table
            client.query(`SELECT ChillUsers.user_id, chillings.id, chillings.title, chillings.location, chillings.date, chillings.information, chillings.time, chillings.host_id , chillings.images 
                FROM ChillUsers INNER JOIN chillings ON ChillUsers.chillings_id = chillings.id 
                WHERE ChillUsers.user_id = ${userId} ORDER by ID DESC;`, (err, result) => {

                if (err) { throw err }

                var allChillings = []

                for (var i = 0; i < result.rows.length; i++) {
                    var eventResult = result.rows[i]
                    allChillings.push(eventResult)
                }
                // query all events user has created
                client.query(`SELECT * FROM chillings WHERE host_id = '${userId}' ORDER by ID DESC;`, (err, result) => {

                    if (err) { throw err }

                    var hostChillings = []

                    for (var i = 0; i < result.rows.length; i++) {
                        var eventResult = result.rows[i]

                        hostChillings.push(eventResult)
                    }
                    res.render("profile", { allChillings: allChillings, hostChillings: hostChillings, user: req.session.user.username })
                })
            })
        })
    })
}