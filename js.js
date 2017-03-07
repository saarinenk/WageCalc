window.onload = function () {
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function (e) {
        var file = fileInput.files[0];
		var textType = /text.*/;
            
        // checks that uploaded file is a text-file
		if (file.type.match(textType)) {
            var reader = new FileReader();
			reader.onload = function (e) {
                
                var employees = {};
                
                // first splits csv-file to lines, then gets the name, time and work start and end times from the file.
                // Calls the wage counter function, which returns the wage.
                // Forms the wanted string and sends it to the reserved area
                
                var lines = this.result.split('\n');
                    
                for (var line = 1; line < lines.length - 1; line++) {
                    var personInfo = lines[line].split(",");
                    var wage = wage_counter(personInfo[3], personInfo[4]);
                    var time = personInfo[2].split('.')[1] + "/" + personInfo[2].split('.')[2]
                    if (employees[personInfo[0]] !== undefined) {
                        employees[personInfo[0]] = (Number(employees[personInfo[0]]) + wage);
                    } else {
                        employees[Number(personInfo[1])] = personInfo[0];
                        employees[personInfo[0]] = wage;
                    }
                };
                
                var list = new Array();
                list.push("Monthly Wages " + time + '\n')
                
                for (i in employees) {
                    if (!isNaN(i)) {
                        list.push(i + ", " + employees[i] + ", $" + employees[employees[i]].toFixed(2));
                    }
                }

                
                fileDisplayArea.innerText = list.join('\n');
                
            };

			reader.readAsText(file);

			} else {
				fileDisplayArea.innerText = "File not supported, it should be a text file!";
			}
		});
}

/* Counts the wage of one day using the start and end times. **/

function wage_counter(s, e) {
    var wage = 0.0
    var hours = 0.0
    var sArray = s.split(":")
    var eArray = e.split(":")
    var start_h = Number(sArray[0]) + (sArray[1] / 60.0)
    var end_h = Number(eArray[0]) + (eArray[1] / 60.0) 
    
// counts the wage and work hours of the employee, 
// taking evening work compensations into account.
// Handles all needed cases (for example days starting before 6 or ending after midnight).
    
    if (start_h < 6) {
      if (end_h > start_h) {
          hours = end_h - start_h
          if (end_h < 6) wage = hours * 3.75 + (end_h - start_h) * 1.15
          else if (end_h <= 18) wage = hours * 3.75 + (6 - start_h) * 1.15
          else wage = (hours * 3.75) + (end_h - 18 + 6 - start_h) * 1.15
      } else {
        hours = 24 - start_h + end_h
        wage = hours * 3.75 + (24 - 18 + end_h + 6 - start_h) * 1.15
      }
    } else if (start_h < 18) {
      if (end_h > start_h) {
          hours = end_h - start_h
          if (end_h <= 18) wage = hours * 3.75
          else wage = (hours * 3.75) + (end_h - 18) * 1.15
      } else {
        hours = 24 - start_h + end_h
        wage = hours * 3.75 + (24 - 18 + end_h) * 1.15
      }
    } else {
      if (end_h > start_h) {
        hours = end_h - start_h
        wage = hours * (3.75 + 1.15)
      }
      else {
        hours = 24 - start_h + end_h
        wage = ((24 - start_h) + end_h) * (3.75 + 1.15) 
      }
    }
    
        // adds overtime compensation to wage
    
    if (hours > 8) {
      if (hours < 10) wage += (hours - 8) * 3.75 * 0.25
      else if (hours < 12) wage += 2 * 3.75 * 0.25 + (hours - 10) * 3.75 * 0.5
      else wage += 2 * 3.75 * 0.25 + 2 * 3.75 * 0.5 + (hours - 12) * 3.75
    }
    return wage
  }
    
