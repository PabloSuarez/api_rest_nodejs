'use strict';

let app = require('express')();
let Model = require('../postsApp/model');


/**
 * set Route
**/
app.route(`/api/createData/`)

.get((req, res) => {

    Model.find({}, (err, data) => {
      if(!err || !data){

        newModel = {
          'name':'pablo suarez',
          'description':'0ds9fusn ',
          'id':'1460432651875',
          'hide':false
        }

        Model.create(newModel, err => console.error(err));
      }
    })
});
