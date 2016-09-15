/**
 * Created by rohit on 14/9/16.
 */

var express = require('express');
var router = express.Router();

function getIndex(req, res){
    res.sendFile(__dirname+"/index.html");
}

router.get("/", getIndex);
router.get("/donors", getIndex);
router.get("/donors-detail", function(req, res){
    var query = {_id:req.query.donor_id,private_id:req.query.donor_private};
    var model = require('./models/donors');
    var response = require('./responseHandler');
    model.findOne(
        query,
        function (err, data) {
            if (err) {
                response.send500(res, err)
            }
            if (data) {
                getIndex(req, res);
            } else {
                response.send404(res);
            }
        }
    );
});
router.get("/patients", getIndex);

module.exports = router;