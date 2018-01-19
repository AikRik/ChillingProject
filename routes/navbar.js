module.exports = (app, client) => {
    app.get("/navbar", (req, res) => {
        if (req.session.user) res.render("navbar", { user:req.session.user })
        else res.render("navbar")
    })
}