module.exports = (searchbar, client) => {
    searchbar.get("/searchbar", (req, res) => {
        res.render("searchbar")
    })
    searchbar.post("/searchbar", (req, res) => {
        var title = req.body.title

        client.query(`SELECT * FROM chillings WHERE title = '${title}';`, (err, result) => {

            if (err) { throw err }

            var allChillings = []

            for (var i = 0; i < result.rows.length; i++) {
                var eventResult = result.rows[i]

                allChillings.push(eventResult)
            }
            res.render("index", { user: req.session.user.username, allChillings: allChillings })
        })
    })
}