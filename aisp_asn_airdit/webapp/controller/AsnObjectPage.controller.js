sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/m/MessageBox"
], (Controller, JSONModel, Filter, FilterOperator, formatter, MessageBox) => {
    "use strict";

    return Controller.extend("com.aispasn.aispasnairdit.controller.AsnObjectPage", {
        onInit() {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteAsnDetails").attachPatternMatched(this._onObjectMatched, this);
            let asnUpdModel = this.getOwnerComponent().getModel("zp-aisp-asnupdate-head-bndsample");
            this.getView().setModel(asnUpdModel, "asnModel")
            this.getView().setModel(new sap.ui.model.json.JSONModel({
                sourceView: ""
            }), "viewModel");
        },

        _onObjectMatched: function (oEvent) {
            debugger;
            var oArgs = oEvent.getParameter("arguments");
            var poNum = oArgs.poId;
            var sourceTable = oArgs.source;
            console.log(poNum, sourceTable);
            var sourceView = (sourceTable === 'smartTable') ? "open" : "submitted";
            this.getView().getModel("viewModel").setProperty("/sourceView", sourceView);
            if (sourceTable === 'smartTable') {
                this.getDataForOpen(poNum)
            } else {
                this.getDataForSubmitted(poNum)
            }

        },

        getDataForOpen: function (poNum) {
            console.log("open")
            this.getView().setBusy(true)
            let oModel = this.getView().getModel();
            let oFilters = [new Filter("Ebeln", FilterOperator.EQ, poNum)];
            oModel.read("/ZP_MM_ASNPOITEM", {
                filters: oFilters,
                success: (res) => {
                    const type = res?.results?.[0]?.Type;
                    let resultData = res?.results?.map(item => ({
                        Ebeln: item.Ebeln,
                        Ebelp: item.Ebelp,
                        Txz01: item.Txz01,                    // Description
                        Matnr: item.Matnr,                    // Material Number
                        Menge: item.Menge,                    // PO Quantity
                        Deliveryqty: item.Deliveryqty,        // Delivery Qty (input field)
                        Rate: item.Netpr,                     // Rate per unit
                        Iamount: item.Netwr,                  // Item Amount (Netwr)
                        Taxper: item.Taxper,                  // Tax %
                        Taxval: item.Taxval,                  // Tax Amount
                        waers: item.waers,                    // Currency
                        status: item.Asnstatus,
                        Lgort: item.Lgort,
                        Total: item.Total,
                        Meins:item.Meins,
                        Pendingqty: item.Pendingqty       // Storage Location (optional if shown)
                    })) || [];
                    let json = new JSONModel({ results: resultData });
                    this.getView().setModel(json, "tableModel");
                    this.getView().setBusy(false)
                },
                error: (err) => {
                    console.error("Error fetching item data:", err);
                    this.getView().setBusy(false)
                }
            });
            // Load PO Header Data
            oModel.read("/ZP_MM_ASNPOHEAD", {
                filters: oFilters,
                success: (res) => {
                    let json = new JSONModel(res.results[0]);
                    this.getView().setModel(json, "headData");
                    this.getView().setBusy(false);
                },
                error: (err) => {
                    console.error("Error fetching header data:", err);
                    this.getView().setBusy(false);
                }
            });
        },

        getDataForSubmitted: function (poNum) {
            console.log("submitted");
            this.getView().setBusy(true)
            let oModel = this.getView().getModel("asnModel");
            let oFilters = [new Filter("Vbeln", FilterOperator.EQ, poNum)];
            oModel.read("/ZP_AISP_ASNUPDATE_ITEM", {
                filters: oFilters,
                success: (res) => {
                    let Ebeln = res.results[0].Ebeln;
                    let ddDate = res.results[0].Deliverydate;
                    this.headData(Ebeln,ddDate)
                    let resultData = res?.results?.map(item => ({
                        Ebeln: item.Ebeln,                // PO Number
                        Ebelp: item.Ebelp,                // Item Number
                        Vbeln: item.Vbeln,                // ASN Number
                        Txz01: item.txz01,                // Material Description
                        Matnr: item.matnr,                // Material Number
                        Menge: item.Menge,                // PO Quantity
                        POquantity: item.POquantity,      // PO Quantity (from response)
                        Deliveryqty: item.Dabmg,          // Delivery Quantity
                        Rate: item.Rate,                  // Rate per unit
                        Iamount: item.Amount,              // Item Amount (Total)
                        Taxper: item.Taxper,              // Tax Percentage
                        Taxval: item.Taxval,              // Tax Amount
                        Waers: item.Waers,                // Currency
                        websta: item.wbsta,               // Status
                        Lgort: item.Lpein,                // Storage Location (optional if shown)
                        Discount: item.Discount,          // Discount
                        Startdate: item.Startdate,        // Start Date (if available)
                        Enddate: item.Enddate,
                        Total: item.Total,
                        Pendingqty: item.Pendingqty,
                        DeliveryDate : item.Deliverydate,
                        Meins:item.meins,
                        posnr: item.posnr,
                        Ebtyp: item.Ebtyp,          // End Date (if available)
                        Serviceperformer: item.Serviceperformer, // Service Performer (if available)
                    })) || [];

                    let json = new JSONModel({ results: resultData });
                    this.getView().setModel(json, "tableModel");
                    this.getView().setBusy(false)

                },
                error: (err) => {
                    console.error("Error fetching item data:", err);
                    this.getView().setBusy(false)

                }
            });

        },
        headData: function (po, ddDate) {
            this.getView().setBusy(true);
            let oFiltersz = [new Filter("Ebeln", FilterOperator.EQ, po)];
            let oModel = this.getView().getModel("asnModel");
        
            oModel.read("/ZP_AISP_ASNUPDATE_HEAD", {
                filters: oFiltersz,
                success: (res) => {
                    let data = res.results[0] || {};
                    data.DeliveryDate = ddDate; // 🟢 Set DeliveryDate manually from argument
                    let json = new JSONModel(data);
                    this.getView().setModel(json, "headData"); // 🔐 Bindable in view
                    this.getView().setBusy(false);
                },
                error: (err) => {
                    console.error("Error fetching header data:", err);
                    this.getView().setBusy(false);
                }
            });
        },
        


        handleClose: function () {
            debugger;
            this.getOwnerComponent().getRouter().navTo("RouteASNLists");
        },

        onDeliveryQtyChange: function (oEvent) {
            var oInput = oEvent.getSource(); // The input field for Delivery Quantity
            var sValue = oInput.getValue(); // Get the value entered by the user
            var oContext = oInput.getBindingContext("tableModel"); // Get the context of the current row
            var oData = oContext.getObject(); // Get the data of the current row
            var deliveryQty = parseFloat(sValue);
            var poQty = parseFloat(oData.Menge);

            if (deliveryQty > poQty) {
                oInput.setValue(poQty);
            }
        },

        onCreateASN: function () {
            const oView = this.getView();
            const oModel = oView.getModel();
            const oTableData = oView.getModel("tableModel").getProperty("/results");
        
            const oDatePicker = oView.byId("idActualDate");
            const oDate = oDatePicker.getDateValue();
        
            if (!oDate) {
                sap.m.MessageBox.warning("Please select a valid Delivery Date.");
                return;
            }
        
            const sDeliveryDate = oDate.toISOString().split("T")[0];
        
            const payload = {
                asnItems: oTableData.map(item => ({
                    Ebeln: item.Ebeln,
                    Ebelp: item.Ebelp,
                    Txz01: item.Txz01,
                    Matnr: item.Matnr,
                    Menge: item.Menge,
                    Pendingqty: item.Pendingqty,
                    Deliveryqty: item.Deliveryqty,
                    Meins: item.Meins
                })),
                DeliveryDate: sDeliveryDate
            };
        
            // 🔹 Custom Confirmation Dialog
            const oDialog = new sap.m.Dialog({
                title: "Confirm ASN Creation",
                type: "Message",
                icon: "sap-icon://shipping-status",
                content: [
                    new sap.m.Text({
                        text: `You are about to create ASN for ${oTableData.length} item(s) with Delivery Date: ${sDeliveryDate}. Do you want to continue?`
                    })
                ],
                beginButton: new sap.m.Button({
                    text: "Yes, Create ASN",
                    type: "Emphasized",
                    press: () => {
                        oDialog.close();
                        sap.ui.core.BusyIndicator.show(0);
        
                        oModel.create("/createASN", payload, {
                            success: function (oData) {
                                sap.ui.core.BusyIndicator.hide();
                                MessageBox.success("ASN Created Successfully!", {
                                    title: "Success",
                                    onClose: function () {
                                        // Optional: navigate or refresh
                                        this.getOwnerComponent().getRouter().navTo("RouteAsnCreation");
                                    }.bind(this)
                                });
                                
                            },
                            error: function (oError) {
                                sap.ui.core.BusyIndicator.hide();
                                MessageBox.error("Failed to create ASN.");
                                console.error("Error:", oError);
                            }
                        });
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy(); // clean up
                }
            });
        
            oDialog.open();
        },
        
        

        onEditASN: function () {
            const oView = this.getView();
            const oEditButton = oView.byId("idEditBtn");
            const oDatePicker = oView.byId("idActualDate");
            const oTable = oView.byId("myTable");
            const oFooter = oView.byId("otbFooter");
            const aItems = oTable.getItems();
        
            const oCancelBtn = oView.byId("idCancelBtn");
            const oDeleteBtn = oView.byId("idDeleteBtn");
        
            const bIsInEditMode = oEditButton.getText() === "Edit";
        
            if (bIsInEditMode) {
                // === Enable Edit Mode ===
                oDatePicker?.setEditable(true);
                aItems.forEach(item => {
                    const oInput = item.getCells().find(cell => cell.getId().includes("idDelInpVal"));
                    oInput?.setEditable(true);
                });
        
                oEditButton.setText("Edit Cancel");
        
                // Hide Cancel and Delete buttons
                oCancelBtn?.setVisible(false);
                oDeleteBtn?.setVisible(false);
        
                // Remove any old Submit and add new
                const oOldSubmitBtn = sap.ui.getCore().byId("btnSubmit");
                if (oOldSubmitBtn) {
                    oFooter.removeAggregation("content", oOldSubmitBtn, true);
                    oOldSubmitBtn.destroy();
                }
        
                const oSubmitBtn = new sap.m.Button({
                    id: "btnSubmit",
                    text: "Submit",
                    type: "Success",
                    press: this.onSubmitASN.bind(this)
                });
                oFooter.addContent(oSubmitBtn);
        
            } else {
                // === Cancel Edit Mode ===
                oDatePicker?.setEditable(false);
                aItems.forEach(item => {
                    const oInput = item.getCells().find(cell => cell.getId().includes("idDelInpVal"));
                    oInput?.setEditable(false);
                });
        
                oEditButton.setText("Edit");
        
                // Show Cancel and Delete buttons again
                oCancelBtn?.setVisible(true);
                oDeleteBtn?.setVisible(true);
        
                // Remove Submit
                const oSubmitBtn = sap.ui.getCore().byId("btnSubmit");
                if (oSubmitBtn) {
                    oFooter.removeAggregation("content", oSubmitBtn, true);
                    oSubmitBtn.destroy();
                }
            }
        },
        
        onSubmitASN: async function () {
            const oView = this.getView();
            const oTable = oView.byId("myTable");
            const aItems = oTable.getItems();
            
            // Set busy state to true
            oView.setBusy(true); // Indicate that the operation is in progress
        
            let delDate = this.byId("idActualDate").getValue(); // "1/9/25" or similar
        
            const oPayload = {
                asnItems: []
            };
        
            aItems.forEach(item => {
                const oContext = item.getBindingContext("tableModel");
                const oData = oContext.getObject();
        
                // Format the DeliveryDate from 'DD/MM/YY' to 'YYYY-MM-DD'
                let formattedDeliveryDate = "";
                
                // Handle if delDate exists and is valid
                if (delDate) {
                    const dateParts = delDate.split("/");
        
                    // Validate the date format: ensure we have day, month, year
                    if (dateParts.length === 3) {
                        const day = dateParts[0].padStart(2, '0');  // Ensure day is 2 digits
                        const month = dateParts[1].padStart(2, '0'); // Ensure month is 2 digits
                        const year = "20" + dateParts[2];           // Assuming 'YY' to be in '20YY' format
        
                        // Create the formatted date as 'YYYY-MM-DD'
                        formattedDeliveryDate = `${year}-${month}-${day}`;
                    } else {
                        console.error("Invalid DeliveryDate format:", delDate);
                        // Handle invalid date (optional, maybe set it to a default value or skip)
                        formattedDeliveryDate = "Invalid Date";
                    }
                }
        
                const payloadRow = {
                    Ebeln: oData.Ebeln,                    // PO Number
                    Vbeln: oData.Vbeln,                    // Inbound Delivery
                    Ebelp: oData.Ebelp,                    // PO Item
                    posnr: oData.posnr,                    // Delivery Item
                    Ebtyp: oData.Ebtyp,                    // Item Category
                    Deliverydate: formattedDeliveryDate,   // Formatted Date (YYYY-MM-DD)
                    POquantity: oData.POquantity,          // PO Quantity
                    Menge: oData.Menge,                    // Delivered Quantity (editable input)
                    wbsta: oData.websta,                   // Status
                    matnr: oData.Matnr,                    // Material
                    meins: oData.Meins                     // UOM
                };
        
                oPayload.asnItems.push(payloadRow);
            });
        
            debugger;
            try {
                const oModel = oView.getModel("zp-aisp-asnupdate-head-bndsample"); // Replace with your OData model
        
                await oModel.create("/updateASN", oPayload, {
                    success: function (res) {
                        debugger;
                        // Set busy to false when the request is successful
                        oView.setBusy(false);
                        MessageBox.success("ASN updated successfully.");
                    },
                    error: function (oError) {
                        debugger;
                        // Set busy to false if the request fails
                        oView.setBusy(false);
                        MessageBox.error("Failed to update ASN.");
                        console.error(oError);
                    }
                });
        
            } catch (err) {
                // Set busy to false if an unexpected error occurs
                oView.setBusy(false);
                MessageBox.error("Unexpected error during submission.");
                console.error(err);
            }
        },

        onDeleteASN: async function () {
            const oView = this.getView();
            const oTable = oView.byId("myTable");
        
            const aSelectedItems = oTable.getSelectedItems();
        
            if (aSelectedItems.length === 0) {
                MessageBox.error("Please select at least one item to delete.");
                return; // Exit if no items are selected
            }
        
            const oPayload = {
                asnItems: []
            };
        
            aSelectedItems.forEach(item => {
                const oContext = item.getBindingContext("tableModel");
                const oData = oContext.getObject();
        
                // Prepare payload for each selected item
                const payloadRow = {
                    Ebeln: oData.Ebeln,  // PO Number
                    Vbeln: oData.Vbeln,  // Inbound Delivery
                    Ebelp: oData.Ebelp   // PO Item
                };
        
                oPayload.asnItems.push(payloadRow);
            });
        
            try {
                const oModel = oView.getModel("zp-aisp-asnupdate-head-bndsample"); // OData model
        
                // Set busy state while making the request
                oView.setBusy(true);
        
                // Send delete request to OData service
                await oModel.create("/DeleteASN", oPayload, {
                    success: function (res) {
                        // Set busy to false when the request is successful
                        oView.setBusy(false);
                        MessageBox.show("ASN(s) deleted successfully.");
                        // Optionally, remove deleted items from the table
                        aSelectedItems.forEach(item => {
                            oTable.removeItem(item);
                        });
                    },
                    error: function (oError) {
                        // Set busy to false on error
                        oView.setBusy(false);
                        MessageBox.error("Failed to delete ASN.");
                        console.error(oError);
                    }
                });
        
            } catch (err) {
                // Handle any unexpected errors
                oView.setBusy(false);
                MessageBox.error("Unexpected error during deletion.");
                console.error(err);
            }
        }
        
        
        
        
        
        
        
        
        
        
        


    });
});