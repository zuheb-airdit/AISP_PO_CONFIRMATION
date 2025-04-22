sap.ui.define([], function() {
    "use strict";
    
    return {
        amountFormatter: function(amount) {
            debugger;
            if (!amount) return ""; 
                return `${amount} INR`;
        },
        statusFormattertest: function(status) {
            debugger
            return status ? status : "Unknown"; 
        },
        indicationFormat: function(status) {
            console.log(status)
            debugger;
            
            if (!status) return "None"; 
            switch (status.toLowerCase()) {
                case "pending":
                    return "Indication11";
                case "partially released":
                    return "Indication13";
                    case "submitted":
                        return "Indication14";
                default:
                    return "None";
            }
        },

        stateFormatter: function(status) {
            debugger;
            console.log(status)
            if (!status) return "None"; 
            switch (status) {
                case "Completed":
                    return "Indication11";
                case "pending":
                    return "Indication13";
                default:
                    return "None";
            }
        },
        formatDate: function(date) {
            if (!date) return ""; 
            let oDate = new Date(date);
            if (isNaN(oDate.getTime())) {
                return date; 
            }
            let day = oDate.getDate().toString().padStart(2, "0");
            let month = (oDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
            let year = oDate.getFullYear();
            return `${day}.${month}.${year}`;
        },

        stateformater : function(status){
            debugger;
             console.log("cominisnjksjksdjk")
            if (!status) return "None"; 
            switch (status) {
                case "Pending":
                    return "Indication11";
                case "Partially Delivered":
                    return "Indication13";
                default:
                    return "None";
            }
        }
    };
});
