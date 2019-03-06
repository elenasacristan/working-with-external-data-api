//var xhr = new XMLHttpRequest();
//var data;

//xhr.open("GET", "https://swapi.co/api/");
//xhr.send();

//xhr.onreadystatechange = function() {
//console.log(this.readyState);

//   if(this.readyState == 4 && this.status == 200){

//  document.getElementById("data").innerHTML = this.responseText;  
// console.log(typeof(this.responseText));   this is a tring type
//console.log(typeof(JSON.parse(this.responseText))); // this is an object

//console.log(JSON.parse(this.responseText));
// document.getElementById("data").innerHTML = JSON.parse(this.responseText);

//   data=JSON.parse(this.responseText);


//   }
//};

//setTimeout(function(){

//console.log(data);},500);



///// now with Callbacks



//function getData(callback) {

//    var xhr = new XMLHttpRequest();
//    var data;

//    xhr.open("GET", "https://swapi.co/api/");
//    xhr.send();

//    xhr.onreadystatechange = function() {

//       if (this.readyState == 4 && this.status == 200) {
//          callback(JSON.parse(this.responseText));
//        }
//    };

//}

//function printDataToConsole(data){
//    console.log(data);
//}

//getData(printDataToConsole);

function getData(url, callback) {

    var xhr = new XMLHttpRequest();
    var data;

    xhr.open("GET", url);
    xhr.send();

    xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };

}

function createTableHeaders(obj) {

    var headers = [];

    Object.keys(obj).forEach(function(key) {
        headers.push(`<td>${key}</td>`);
    });

    return (`<tr>${headers}</tr>`)

}



function generatePaginationButtons(next, prev) {
    if (next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    }
    else if (next && !prev) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`;
    }
    else if (!next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`;
    }

}




function writeToDocument(url) {



    var tableRows = []; //this array will contain a row per item
    var element = document.getElementById("data");

    getData(url, function(data) {

       var pagination = "";

       if (data.next || data.previous) {
            pagination = generatePaginationButtons(data.next, data.previous);
        }
      
  
  
        
        
        var data = data.results;

        var tableheaders = createTableHeaders(data[0]); // we will pass the fist object in the array
        // console.dir(data);
        data.forEach(function(item) {

            individualRow = [];
            Object.keys(item).forEach(function(key) {
                var rowData = item[key].toString();
                var truncated = rowData.substring(0, 8); // we truncate the data because to fit it properly in the screen
                individualRow.push(`<td>${truncated}</td>`); // this will add the corresponding item matching the heading "key"

            })

            tableRows.push(`<tr>${individualRow}</tr>`);

            //document.getElementById("data").innerHTML += "<p>" + item.name + "</p>";
            element.innerHTML = `<table>${tableheaders}${tableRows}</table>${pagination}`;

        })

    });

}
