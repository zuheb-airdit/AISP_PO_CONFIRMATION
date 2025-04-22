sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
], (Controller, formatter) => {
    "use strict";

    return Controller.extend("com.aispasn.aispasnairdit.controller.ASNLists", {
        formatter: formatter,
        onInit() {
            debugger;
            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteASNLists")
                .attachPatternMatched(this._onRouteMatched, this);
            let oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel)
            let asnUpdModel = this.getOwnerComponent().getModel("zp-aisp-asnupdate-head-bndsample");
            this.getView().setModel(asnUpdModel, "asnModel")
            
        },

        _onRouteMatched: function () {
            this.getOwnerComponent().getModel("appView").setProperty("/layout", "OneColumn");
            this.byId("smartFilterBar").setVisible(true)
            this.refreshSmartTable();
            this.refreshNormalTable();
        },

        onClickofPONumber: function (oEvent) {
            this.byId("smartFilterBar").setVisible(false);
            let id = oEvent.getSource()?.getParent()?.getId()?.split("--")[2]?.trim();
            var oSelectedItem = oEvent.getSource();
            if (id === "idTableAsn") {
                let poNum = oSelectedItem.getBindingContext()?.getObject().Ebeln;
                let sourceTable = "smartTable";
                this.getOwnerComponent().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                this.getOwnerComponent().getRouter().navTo("RouteAsnDetails", {
                    poId: poNum,
                    source: sourceTable
                });
            } else {
                let sVbeln = oEvent.getSource()?.getSelectedItem()?.getBindingContext("asnModel").getObject().vbeln;
                let sourceTable = "normalTable";
                this.getOwnerComponent().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                this.getOwnerComponent().getRouter().navTo("RouteAsnDetails", {
                    poId: sVbeln,
                    source: sourceTable  // Pass source table as a parameter
                });
            }
        },

        onIconTabBarSelect: function (oEvent) {
            const sKey = oEvent.getParameter("key");

            switch (sKey) {
                case "open":
                    this.refreshSmartTable();
                    break;

                case "attachments":
                    // Normal Table bound to "asnModel" — refresh the model or force binding update
                    this.refreshNormalTable();
                    break;

                default:
                    console.warn("Unhandled tab key:", sKey);
            }
        },

        refreshSmartTable: function () {
            const oSmartTable = this.byId("smartTable");
            if (oSmartTable) {
                oSmartTable.rebindTable(); // 🔁 This forces data reload
            }
        },

        refreshNormalTable: function () {
            const oTable = this.byId("myTablde");
            const oModel = this.getView().getModel("asnModel");
            if (oTable && oModel) {
                oModel.refresh(true); // 🔄 This will refetch the backend OData
                oTable.getBinding("items").refresh(); // optional, depending on model setup
            }
        }






    });
});