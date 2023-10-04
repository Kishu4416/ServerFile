const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
// imported from schema
const Category = mongoose.model("Category")

// get all catagories
router.get(`/categries`,async(req,resp)=>{
    const categoryList = await Category.find();

    if(!categoryList){
        resp.status(500).json({success:false})
    }
    resp.send(categoryList);
})


// post catagory
router.post('/categries',async(req,resp)=>{
    let category = new Category({
        name:req.body.name,
    })

    // saved using mongossee
    category =await category.save();    

    if(!category)
    return resp.status(404).send("This category is not created");

     resp.status(200).send(category);
})


// get catagory by id
router.get('/categries/:id', async(req,resp)=>{
    const category = await Category.findById(req.params.id);
    if(!category) {
        resp.status(500).json({message: 'The category with the given ID was not found.'})
    } 
    resp.status(200).send(category);
})

module.exports = router;
