const express = require("express");
const router = express.Router();

router.get("/",(req, res)=>{
    res.status(200).json({
        ok:true,
        api: "livraria API",
    });
});

router.use("/livros", require("./livros.routes"));
router.use('/auth', require('./auth.routes'));

module.exports = router;