/**
 * Created by rohit on 18/9/16.
 */

var assert = require('chai').assert;
var superagent = require('superagent');
var testPort = process.env.PORT;
var host = 'localhost:'+testPort;

describe("server. testing on "+host, function(){
//    /donors, /patients, /donors-detail?donor_id=validDonorId&donor_private=validDonorPrivate
    it("should return index at /", function(done){getResponse(done, "/")});
    it("should return index at /donors", function(done){getResponse(done, "/donors")});
    it("should return index at /patients", function(done){getResponse(done, "/patients")});
    it("should return 404 at /donors-detail", function(done){getResponse(done, "/donors-detail", handle404)});
    it("should return donor with private at /api/donors POST", function(done){post(done, "/api/donors", verifyDonor)});
    it("should return array of donors at /api/donors", function(done){getResponse(done, "/api/donors", handleDonorsList)});
});

var postData = {
    success : [
        {
            "name":{
                "first": "ROHIT",
                "last": "reddy"
            },
            "coordinates":{
                "latitude": "66",
                "longitude": "100"
            },
            "contact_number": "+914445556667",
            "email": "asdf@asdf.ass",
            "blood_group": "ab+"
        }
    ],
    failure : [
        {
            "contact_number": "0091738s393393",
            "email": "rr.16566@.com",
            "blood_group": "BA+",
            "coordinates": {
                "longitude": '',
                "latitude": "12"
            },
            "name": {
                "last": "Reddy",
                "first": "Rohit"
            }
        }
    ]
};

function getResponse(done, resource, apiFwd){
    superagent.get(host+resource).end(function(err, res){
        if(err){done(new Error(err));}
        var contentType = res.headers['content-type'];
        contentType = contentType.split(";")[0];
        if(contentType == "text/html") {
            assert.equal(res.status, 200);
            done();
        }else{
            if(apiFwd){
                apiFwd(done, res);
            }else {
                handleAPISuccess(done, res);
            }
        }
    });
}

function post(done, resource, validationFn){
    var failed = [];
    for(var i=0; i<postData.success.length; i++) {
        superagent.post(host + resource, JSON.stringify(postData.success[i])).end(function(err, res) {
            if(err){done(new Error(err));}
            if(res.body.data){
                validationFn(res.body.data, done, true);
            }else{
                failed.push({data:JSON.stringify(postData.success[i]), err:res.body.status.message});
            }
        });
    }
    for(var i=0; i<postData.failure.length; i++) {
        superagent.post(host + resource, JSON.stringify(postData.failure[i])).end(function(err, res) {
            if(err){done(new Error(err));}
            if(res.body.data){
                try {
                    validationFn(res.body.data, done, false);
                    failed.push({data:JSON.stringify(postData.failure[i]), err:"passed test for wrong data"});
                }catch(e){

                }
            }else{
                if(res.body.status.status_code == 400) {
                    done();
                }else {
                    failed.push({data:JSON.stringify(postData.failure[i]), err:res.body.status.message});
                }
            }
        });
    }
}

function handleAPISuccess(done, res){
    if(res.body.status.status_code == 404 || res.body.status.status_code == 500){
        done(new Error(JSON.stringify(res.body.status)));
    }else{
        done();
    }
}

function handle404(done, res){
    if(res.body.status.status_code == 404){
        done();
    }
}

function handleDonorsList(done, res){
    if(res.body.data instanceof Array){
        if(res.body.data.length > 0){
            var donor = res.body.data[0];
            try {
                verifyDonor(donor, done, false, false);
            }catch(e){
                done(e);
            }
        }
        done();
    }else{
        done(new Error("improper list response"));
    }
}

function verifyDonor(donor, done, hasPrivate){
    if(!donor.name.first){
        throw new Error("fname not present");
    }
    if(!donor.email){
        throw new Error("email not present");
    }
    if(!donor.contact_number){
        throw new Error("contact not present");
    }
    if(!(donor.coordinates && donor.coordinates.latitude && donor.coordinates.longitude)){
        throw new Error("location not present");
    }
    if(!hasPrivate && donor.private_id){
        throw new Error("private id should not be returned");
    }
    if(!hasPrivate && donor.private_id){
        throw new Error("private id should not be returned");
    }
    if(donor.ip_address){
        throw new Error("ip address should not be returned");
    }
}