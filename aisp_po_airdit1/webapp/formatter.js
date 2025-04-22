sap.ui.define([], function() {
    "use strict";
    
    return {
        amountFormatter: function(amount) {
            debugger;
            if (!amount) return ""; 
                return `${amount} INR`;
        },
        statusFormattertest: function(status) {
            return status ? status : "Unknown"; 
        },
        indicationFormat: function(status) {
            console.log(status)
            if (!status) return "None"; 
            switch (status.toLowerCase()) {
                case "pending":
                    return "Indication11";
                case "in process":
                    return "Indication13";
                case "completed":
                    return "Success";
                default:
                    return "None";
            }
        },

        stateFormatter: function(status) {
            console.log(status)
            if (!status) return "None"; 
            switch (status.toLowerCase()) {
                case "pending":
                    return "Indication11";
                case "confirmed":
                    return "Success";
                case "completed":
                    return "Success";
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
        }
    };
});
