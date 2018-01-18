module.exports = (app, client, bcrypt) => {
    app.get("/signup", (req, res) => {
        res.render("signup")
    })

    app.post("/signup", (req, res) => {
        var firstname = req.body.firstname
        var lastname = req.body.lastname
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password

        var salt = bcrypt.genSalt(10, function(error, salt) {

            bcrypt.hash(password, salt, function(err, hash) {

                // Store hash in the password DB.
                if (err) console.log(err)
                // The query goes here
                const userCheck = {
                    text: `SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`,
                }
                const insertNewUser = {
                    text: `INSERT INTO users(firstname, lastname, email, username, password) values('${firstname}','${lastname}','${email}','${username}','${hash}')RETURNING *;`
                }

                client.query(userCheck, (err, result) => {
                    if (result.rows != 0) {
                        res.render("signup", { error: "Username is not Available" })
                    } else {
                        client.query(insertNewUser, (err, result2) => {
                            if (err) {
                                throw err
                            } else {
                                res.render("index")
                            }
                        })
                    }
                })
                bcrypt.compare(password, hash, function(err, res) {});
            });
        });
    })
}