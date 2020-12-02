// CLASS
class clCar {
	constructor(sCarName) {
		this._carname = sCarName;
	}
	present() {
		return "I have a " + this._carname;
	}
	static fnDescription(sName) {
		return sName + "'s Car Class";
	}
	get carName() {
		return this._carname;
	}
	set carName(x) {
		this._carname = x;
	}
}

class clModel extends clCar {
	constructor(sCarName, sCarModel) {
		super(sCarName);
		this._carmodel = sCarModel;
	}
	show() {
		return this.present() + ', it is a ' + this._carmodel;
	}
}

var oCar = new clCar("Opel");

clCar.fnDescription("Serhat"); // Serhat's Car Class

oCar.carname; // Opel
oCar.present(); // I have a Opel

oCar.carName = "Ford";
oCar.carName; // "Ford" 

var oCarModel = new clModel("Ford", "Mustang");

oCarModel.show(); // "I have a Ford, it is a Mustang"