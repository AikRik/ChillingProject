module.exports = (app, client, upload) => {
    app.get("/chillingsPage", (req, res) => {
        if (req.session.user) {
            var ChillId = req.query.id
            //query to get all event information where event id corresponds to the event id in the db
            client.query(`SELECT * FROM chillings WHERE id = '${ChillId}'`, (err, result) => {

                var title = result.rows[0].title
                var location = result.rows[0].location
                var date = result.rows[0].date
                var time = result.rows[0].time
                var information = result.rows[0].information
                var messageId = result.rows[0].id
                var picture = result.rows[0].images
                var host = result.rows[0].host_id
                res.render("chillingsPage", { userid: req.session.user.id, user: req.session.user.username, title: title, location: location, date: date, information: information, time: time, id: messageId, picture: picture, host:host })
            })
        } else {
            res.render("index")
        }
    })
    app.post('/chillingsPage', upload.single('chillPictures'), function(req, res, next) {
        var ChillId = req.body.chillId
        var picture = req.file.path

        // the query to insert the data from the upload picture form into the database, and selecting the inserted data using returning *.     

        var uploadPicture = {
            text: `UPDATE chillings SET images = '${picture}' WHERE id = ${ChillId} RETURNING * ;`
        }

        client.query(uploadPicture, (err, result) => {

            if (err) console.log("Error", err);

            client.query(`SELECT * FROM chillings WHERE id = ${ChillId};`, (err, result2) => {
                var title = result.rows[0].title
                var location = result.rows[0].location
                var date = result.rows[0].date
                var time = result.rows[0].time
                var information = result.rows[0].information
                var messageId = result.rows[0].id
                var picture = result.rows[0].images
                var host = result.rows[0].host_id

                if (err) { throw err }

                var allChillings = []

                for (var i = 0; i < result2.rows.length; i++) {
                    var eventResult = result2.rows[i]

                    allChillings.push(eventResult)
                }
                res.render("chillingsPage", { allChillings: allChillings, user: req.session.user.username,title: title, location: location, date: date, information: information, time: time, id: messageId, picture: picture, host:host})
            })
        })
    })
}