module.exports = (app, client, upload) => {
    app.get("/chillingsPage", (req, res) => {
        if (req.session.user) {
            var ChillId = req.query.id
            //query to get all event information where event id corresponds to the event id in the db
            client.query(`SELECT * FROM chillings WHERE id = '${ChillId}'`, (err, result) => {
                res.render("chillingsPage", { 
                    userid: req.session.user.id, 
                    user: req.session.user.username, 
                    title: result.rows[0].title, 
                    location: result.rows[0].location, 
                    date: result.rows[0].date, 
                    information: result.rows[0].information, 
                    time: result.rows[0].time, 
                    id: result.rows[0].id, 
                    picture: result.rows[0].images, 
                    host: result.rows[0].host_id })
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

            if (err) throw err

            client.query(`SELECT * FROM chillings WHERE id = ${ChillId};`, (err, result2) => {

                if (err) throw err

                var allChillings = []

                for (var i = 0; i < result2.rows.length; i++) {
                    var eventResult = result2.rows[i]

                    allChillings.push(eventResult)
                }
                res.render("chillingsPage", { 
                    allChillings: allChillings, 
                    user: req.session.user.username, 
                    title: result.rows[0].title, 
                    location: result.rows[0].location, 
                    date: result.rows[0].date, 
                    information: result.rows[0].information, 
                    time: result.rows[0].time, 
                    id: result.rows[0].id, 
                    picture: result.rows[0].images,
                    host: result.rows[0].host_id})
            })
        })
    })
}