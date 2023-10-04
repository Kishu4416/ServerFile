const mongoose= require('mongoose');

const storeSchema=  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    timing:{
        type:String,
        required:true
    },
    location:{
        type:{type:String},
        coordinates:[]
    }
});
storeSchema.index({location:'2dsphere'});
module.exports = mongoose.model("Store",storeSchema);