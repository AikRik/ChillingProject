module.exports = (app, client) => {
    app.get("/navbar", (req, res) => {
        if (req.session.user) {
            var user = req.session.user
            res.render("navbar", { user })
        } else {
            res.render("navbar")
        }
    })
}