sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/m/MessageBox"
], (Controller, JSONModel, Filter, FilterOperator, formatter, MessageBox) => {
    "use strict";

    return Controller.extend("com.aisppo.aisppoairdit1.controller.PoDetails", {
        formatter: formatter,
        onInit() {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this.getView().setBusy(true)
            this.byId("idItemDetails").setVisible(false)
            let poNum = oEvent.getParameter("arguments").poId;
            let oModel = this.getView().getModel();
            let oFilters = [new Filter("Ebeln", FilterOperator.EQ, poNum)];
            oModel.read("/FilteredPOItems", {
                filters: oFilters,
                success: (res) => {
                    debugger;
                    const type = res?.results?.[0]?.Type;
                    let resultData = res?.results?.map(item => ({
                        Ebeln: item.Ebeln,
                        Ebelp: item.Ebelp,
                        Txz01: item.Txz01,
                        Type: item.Type,
                        Matnr: item.Matnr,
                        Werks: item.Werks,
                        Menge: item.Menge,
                        Meins: item.Meins,
                        Confirmedqty: item.Confirmedqty,
                        eindt: item.eindt,
                        SubPackno: item.SubPackno,
                        knumv: item.knumv,
                        Discount: item.Discount, // Discount
                        Taxper: item.Taxper, // Tax Percentage
                        Taxval: item.Taxval, // Tax Value
                        Rate: item.Rate, // Rate
                        Iamount: item.Iamount, // Item Amount
                        Total: item.Total, // Total Price
                        Kposn: item.Kposn, // Condition Item
                        waers: item.waers, // Currency
                        Status: item.Status, // Status
                        Action: "" // New Action Field
                    })) || [];

                    const table = this.byId("myTable");
                    if (type === "Service") {
                        table.setMode("SingleSelectLeft");
                    } else {
                        table.setMode("None");
                    }
                    let json = new JSONModel({ results: resultData });
                    this.getView().setModel(json, "tableModel");
                },
                error: (err) => {
                    console.error("Error fetching data:", err);
                }
            });


            oModel.read("/FilteredPOHeaders", {
                filters: oFilters,
                success: (res) => {
                    debugger;
                    let json = new JSONModel(res.results[0]);
                    this.getView().setModel(json, "headData");
                    this.getView().setBusy(false)

                },
                error: (err) => {
                    console.error("Error fetching data:", err);
                    this.getView().setBusy(false)
                }
            });
        },

        onRowSelected: function (oEvent) {
            const oTable = oEvent.getSource();
            const oSelectedItem = oEvent.getParameter("listItem");
            const oContext = oSelectedItem.getBindingContext("tableModel");
            this.byId("idItemDetails").setVisible(true)
            if (!oContext) return;

            const oData = oContext.getObject();
            const sSubPackno = oData.SubPackno;

            if (!sSubPackno) {
                MessageBox.warning("No SubPackno found in selected row.");
                return;
            }

            const oModel = this.getView().getModel(); // assuming default model is for V4 service
            const sPath = "/ZC_MM_ESLL_CAP";
            const aFilters = [new sap.ui.model.Filter("SubPackno", sap.ui.model.FilterOperator.EQ, sSubPackno)];

            this.getView().setBusy(true);

            oModel.read(sPath, {
                filters: aFilters,
                success: (oData) => {
                    this.getView().setBusy(false);
                    console.log("Filtered Service Entries:", oData.results);
                    const oJsonModel = new sap.ui.model.json.JSONModel(oData);
                    this.getView().setModel(oJsonModel, "serviceDetails");
                },
                error: (err) => {
                    this.getView().setBusy(false);
                    console.error("Error fetching service details", err);
                    MessageBox.error("Failed to load service details.");
                }
            });
        },


        handleClose: function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("RoutePOLists");
            // this.byId("smartFilterBar").setVisible(true)

        },

        onSubmitPo: function () {
            let oView = this.getView();
            let oModel = oView.getModel();
            let oTableModel = oView.getModel("tableModel");
        
            if (!oTableModel) {
                MessageBox.error("No data available to submit.");
                return;
            }
        
            // Filter items with Action === "Confirm"
            let aFilteredItems = oTableModel.getProperty("/results").filter(item => item.Action === "Confirm");
        
            if (aFilteredItems.length === 0) {
                MessageBox.error("No items marked as 'Confirm' to process.");
                return;
            }
        
            // Prepare payload for action
            let oPayload = {
                poItems: aFilteredItems.map(item => ({
                    Ebeln: item.Ebeln,
                    Ebelp: item.Ebelp
                }))
            };
        
            oView.setBusy(true);
        
            // Call action via oModel.create()
            oModel.create("/confirmPOItem", oPayload, {
                success: function (oData) {
                    oView.setBusy(false);
        
                    // Build the success message with all items line by line
                    let successMessage = '';
                    if (oData.results && oData.results.length > 0) {
                        oData.results[0].forEach(item => {
                            successMessage += item.message + "\n";  // Append each message with a new line
                        });
                    }
        
                    // Display the success message
                    MessageBox.success(successMessage);
        
                    console.log("Response:", oData);
                },
                error: function (oError) {
                    oView.setBusy(false);
                    MessageBox.error("Error confirming PO items.");
                    console.error("Error:", oError);
                }
            });
        }
        






    });
});
