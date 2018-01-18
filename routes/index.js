module.exports = (app, client, moment) => {
    app.get("/", (req, res) => {
        if (req.session.user) {
            //get all events from db
            client.query(`SELECT * FROM chillings ORDER by ID DESC`, (err, result) => {

                if (err) { throw err }

                var allChillings = []

                for (var i = 0; i < result.rows.length; i++) {
                    var eventResult = result.rows[i]

                    allChillings.push(eventResult)
                }
                res.render("index", { user: req.session.user.username, allChillings: allChillings })
            })
        } else {
            res.render("index")
        }
    })
}