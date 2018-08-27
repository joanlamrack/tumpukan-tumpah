const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class ObjectIdHelper{
	constructor(){

	}

	static extractIdStringFromObj(ObjWithId){
		return ObjWithId._id.toString();
	}

	static convertStringIntoObjId(ObjIdStr){
		return ObjectId(ObjIdStr);
	}

	static convertObjectIdToStr(ObjId){
		return ObjId.toString();
	}
}

module.exports=ObjectIdHelper;