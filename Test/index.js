var connectionToken = "90938125|-31949270489073781|90955037";
var DBName = "DELIVERY-DB";
var relationName = "SHIPMENT-TABLE";
var jpdbIRL="/api/irl";
var jpdbIML="/api/iml";
var jpdbBaseURL = "http://api.login2explore.com:5577";


function saveShipment(){
    var jsonStrObj = validateData();
    if(jsonStrObj===""){
        return "";
    }
    var putReq = createPUTRequest(connectionToken,jsonStrObj,DBName,relationName)
    jQuery.ajaxSetup({async:false})
    var responsObj = executeCommandAtGivenBaseUrl(putReq,jpdbBaseURL,jpdbIML)
    jQuery.ajaxSetup({async:true})
    resetShipment();
    $("#shipmentno").focus();
}

function changeShipment(){
    $("#shipmentChange").prop("disabled",true);
    jsonChange = validateData();
    var updateRequest=createUPDATERecordRequest(connectionToken,jsonChange,DBName,relationName,localStorage.getItem("recordNumber"))
    jQuery.ajaxSetup({async:false})
    var responsObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML)
    jQuery.ajaxSetup({async:true})
    resetShipment();
    console.log(responsObj);
    $("#shipmentno").focus();
}
function getShipment(){
    var shipmentJSONObject = getShipmentNumberJsonObj();
    var getRequest  = createGET_BY_KEYRequest(connectionToken,DBName,relationName,shipmentJSONObject);
    console.log(getRequest);
    jQuery.ajaxSetup({async:false})
    var responsObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL)
    console.log(responsObj);
    jQuery.ajaxSetup({async:true})
    if(responsObj.status === 400){
        $("#shipmentSave").prop("disabled",false);
        $("#shipmentReset").prop("disabled",false);
        $("#desc").focus();
    }else if (responsObj.status === 200){
        $("#shipmentno").prop("disabled",true)
        fillData(responsObj);
        
        $("#shipmentChange").prop("disabled",false);
        $("#shipmentReset").prop("disabled",false);
    }
}
function fillData(JsonObj){
    saveRecNo2LS(JsonObj);
    var data = JSON.parse(JsonObj.data).record;
    console.log(data);
    $("#desc").val(data.desc);
    $("#src").val(data.src);
    $("#dst").val(data.dst);
    $("#shipdate").val(data.shipdate);
    $("#deliverydate").val(data.deliverydate);
}
function saveRecNo2LS(jsonObj){
    var Data = JSON.parse(jsonObj.data);
    localStorage.setItem("recordNumber",Data.rec_no)

}
function getShipmentNumberJsonObj(){
    var shipmentNumber = $("#shipmentno").val();
    var jsonStr={
        shipmentno : shipmentNumber
    };
    return JSON.stringify(jsonStr);
}
function validateData(){
    shipmentNo=$("#shipmentno").val();
    description=$("#desc").val();
    source=$("#src").val();
    destination=$("#dst").val();
    shipDate=$("#shipdate").val();
    deliveryDate=$("#deliverydate").val();
    if(shipmentNo === ""){
        alert("shipment number is required");
        $("#shipmentno").focus();
        return "";
    }
    if(description === ""){
        alert("description is required");
        $("#desc").focus();
        return "";
    }
    if(source === ""){
        alert("source is required");
        $("#src").focus();
        return "";
    }
    if(destination === ""){
        alert("destination is required");
        $("#dst").focus();
        return "";
    }
    if(shipDate === ""){
        alert("ship Date is required");
        $("#shipdate").focus();
        return "";
    }
    if(deliveryDate === ""){
        alert("deliverydate is required");
        $("#deliverydate").focus();
        return "";
    }

    var jsonStrObj = {
        shipmentno : shipmentNo,
        desc : description,
        src :source,
        dst : destination,
        shipdate :shipDate,
        deliverydate : deliveryDate
    };

    return JSON.stringify(jsonStrObj);
}


function resetShipment(){
    $("#shipmentno").val("");
    $("#desc").val("");
    $("#src").val("");
    $("#dst").val("");
    $("#shipdate").val("");
    $("#deliverydate").val("");
    $("#shipmentno").prop("disabled",false);
    $("#shipmentSave").prop("disabled",true);
    $("#shipmentChange").prop("disabled",true);
    $("#shipmentReset").prop("disabled",true);
    $("#shipmentno").focus();
}