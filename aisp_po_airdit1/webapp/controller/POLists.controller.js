sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"

], (Controller, formatter) => {
    "use strict";

    return Controller.extend("com.aisppo.aisppoairdit1.controller.POLists", {
        formatter: formatter,
        onInit() {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("RoutePOLists")
                .attachPatternMatched(this._onRouteMatched, this);
            let oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel)
        },

        _onRouteMatched: function () {
            this.getOwnerComponent().getModel("appView").setProperty("/layout", "OneColumn");
            this.byId("smartFilterBar").setVisible(true)
            const oSmartTable = this.byId("idSmartTablePend");
            if (oSmartTable) {
                oSmartTable.rebindTable();
            }
            const oSmartTableSub = this.byId("idSmartTableInprocess");
            if (oSmartTableSub) {
                oSmartTableSub.rebindTable();
            }
        },

        onClickofPONumber: function (oEvent) {
            this.byId("smartFilterBar").setVisible(false)
            let poNum = oEvent.getSource().getBindingContext().getObject().Ebeln;
            this.getOwnerComponent().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                poId: poNum
            });
        },

        onRebindPending: function (oEvent) {
            let oBindingParams = oEvent.getParameter("bindingParams");
            var oFilter1 = new sap.ui.model.Filter("Status","EQ","Pending");
            oBindingParams.filters.push(oFilter1);
        },

        onRebindInprocess: function (oEvent) {
            let oBindingParams = oEvent.getParameter("bindingParams");
            var oFilter1 = new sap.ui.model.Filter("Status", "EQ", "In Process");
            oBindingParams.filters.push(oFilter1);
        },

        
        onTabSelect: function (oEvent) {
            const sSelectedKey = oEvent.getParameter("key");
            if (sSelectedKey === "pending") {
                const oSmartTable = this.byId("idSmartTablePend");
                if (oSmartTable) {
                    oSmartTable.rebindTable();
                }
            } else if (sSelectedKey === "Inprocess") {
                const oSmartTableSub = this.byId("idSmartTableInprocess");
                if (oSmartTableSub) {
                    oSmartTableSub.rebindTable();
                }
            }
        },

    });
});