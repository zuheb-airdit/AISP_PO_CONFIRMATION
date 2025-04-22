/*global QUnit*/

sap.ui.define([
	"com/aispasn/aispasnairdit/controller/ASNLists.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ASNLists Controller");

	QUnit.test("I should test the ASNLists controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
