/*global QUnit*/

sap.ui.define([
	"com/aisppo/aisppoairdit1/controller/POLists.controller"
], function (Controller) {
	"use strict";

	QUnit.module("POLists Controller");

	QUnit.test("I should test the POLists controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
