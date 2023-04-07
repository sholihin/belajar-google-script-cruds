function doGet(e){
  
  var op = e.parameter.method;
  var ss=SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1JVS_pkeECXdDfBwwQ7plIumwsup1nJWER-YTLVp-1F8/edit#gid=764058683");
  var sheet = ss.getSheetByName("data_karyawan");
  
  if(op=="insert")
    return insert_value(e,sheet);
  
  //Make sure you are sending proper parameters 
  if(op=="read")
    return read_value(e,ss);
  
  if(op=="update")
    return update_value(e,sheet);
  
  if(op=="delete")
    return delete_value(e,sheet);

  if(op=="find")
    return searchName(e,sheet);
  
}

//find by name
function searchName(request, sheet) {
  try {
    var data = sheet.getDataRange().getValues();
    var result = [];
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][2].toLowerCase().indexOf(request.parameter.nama.toLowerCase()) != -1) {
        result.push({
          "created_at": data[i][0],
          "id": data[i][1],
          "nama": data[i][2],
          "jabatan": data[i][3],
          "salary": data[i][4],
          "updated_at": data[i][5]
        });
      }
    }

    var response = {};
    
    if (result.length > 0) {
      response.code = 200;
      response.message = "Data berhasil ditemukan";
      response.data = result;
    } else {
      response.code = 404;
      response.message = "Data tidak ditemukan";
      response.data = null;
    }
    
    var output  = ContentService.createTextOutput();
    output.setContent(JSON.stringify(response));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
  } catch (e) {
    console.error(e.message);
    throw new Error("Terjadi kesalahan dalam memproses data");
  }
}

//find all
function read_value(request, ss) {
  var output = {},
      sheetName = "data_karyawan",
      properties = getHeaderRow_(ss, sheetName),
      rows = getDataRows_(ss, sheetName),
      data = [],
      status = 200,
      message = "";

  if (rows.length > 0) {
    for (var r = 0, l = rows.length; r < l; r++) {
      var row = rows[r],
          record = {};

      for (var p in properties) {
        record[properties[p].replace(/\s+/g, '_')] = row[p];
      }

      data.push(record);
    }
  } else {
    status = 404;
    message = "Data not found";
  }

  output.status = status;
  output.message = message;
  output.data = data;

  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDataRows_(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
    .getValues();
}

function getHeaderRow_(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

//insert data
function insert_value(request,sheet){
 
  var id = request.parameter.id;
  var nama = request.parameter.nama;
  var jabatan = request.parameter.jabatan;
  var salary = request.parameter.salary;
  var flag=1;
  var lr= sheet.getLastRow();

  for(var i=1;i<=lr;i++){
    var id1 = sheet.getRange(i, 2).getValue()+1;
    if(id1==id){
      flag=0;
      var result="Id already exist..";
    }
  }

  //add new row with recieved parameter from client
  if(flag==1){
    var d = new Date();
    var currentTime = d.toLocaleString();
    var rowData = sheet.appendRow([currentTime, id1, nama, jabatan, salary]);  
    var result="Insertion successful";
  }

  result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
}

//update data
function update_value(request,sheet){

  var output  = ContentService.createTextOutput();
  var id = request.parameter.id;
  var nama = request.parameter.nama;
  var jabatan = request.parameter.jabatan;
  var salary = request.parameter.salary;
  var d = new Date();
  var updateAt = d.toLocaleString();
  var flag=0;
  var lr= sheet.getLastRow();
  for(var i=1;i<=lr;i++){
    var rid = sheet.getRange(i, 2).getValue();
    if(rid==id){
      sheet.getRange(i,3).setValue(nama);
      sheet.getRange(i,4).setValue(jabatan);
      sheet.getRange(i,5).setValue(salary);
      sheet.getRange(i,6).setValue(updateAt);
      var result="Updated successfully";
      flag=1;
    }
  }

  if(flag==0)
    var result="Id not found";
  
  result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   

}

//delete data
function delete_value(request,sheet){
  
  var output  = ContentService.createTextOutput();
  var id = request.parameter.id;
  var country = request.parameter.name;
  var flag=0;
  var lr= sheet.getLastRow();

  for(var i=1;i<=lr;i++){
    var rid = sheet.getRange(i, 2).getValue();
    if(rid==id){
      sheet.deleteRow(i);
      var result="Deleted successfully";
      flag=1;
    }
    
  }

  if(flag==0)
    var result="Id not found";
 
   result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   

}