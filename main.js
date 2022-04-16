var savedAccs = JSON.parse(localStorage.getItem("generatedAccs"))

if (localStorage.getItem("generatedAccs") === null) {
    localStorage.setItem("generatedAccs", JSON.stringify({ "accounts": [] }))
}

function apiSuccess(data) {
    if (data.success) {
        data.accounts.forEach(account => {
            insertIntoTables(account)
            savedAccs.accounts.push(account)
        });
    } else {
        console.log(data.reason)
        return alert(`API Error: ${data.reason}`)
    }
    localStorage.setItem("generatedAccs", JSON.stringify(savedAccs))
}

function insertIntoTables(account, historyOnly) {
    if (!historyOnly) {
        let o_row = outputTable.insertRow(1);
        let o_cell1 = o_row.insertCell(0);
        let o_cell2 = o_row.insertCell(1);
        let o_cell3 = o_row.insertCell(2);

        o_cell1.innerHTML = account.username
        o_cell2.innerHTML = account.password
        o_cell3.innerHTML = `${account.username}:${account.password}`
    }

    let h_row = historyTable.insertRow(1);
    let h_cell1 = h_row.insertCell(0);
    let h_cell2 = h_row.insertCell(1);
    let h_cell3 = h_row.insertCell(2);

    h_cell1.innerHTML = account.username
    h_cell2.innerHTML = account.password
    h_cell3.innerHTML = `${account.username}:${account.password}`
}

function gkeyButtonSubmit() {
    if ($('#gkey')[0].readOnly) {
        $('#gkey').prop("readonly", false)
        $('#gkeybtn').html("Save key")
    } else {
        $('#gkey').prop("readonly", true)
        $('#gkeybtn').html("Edit key")
        console.log($('#gkey').val())
        localStorage.setItem("APIKey", $('#gkey').val())
    }
}

function toggleHistoryOutput() {
    if (!$('#outputDiv')[0].hidden) {
        $('#HOToggle').html("Output")
        $('#outputDiv').prop("hidden", true)
        $('#historyDiv').prop("hidden", false)
    } else {
        $('#HOToggle').html("History")
        $('#outputDiv').prop("hidden", false)
        $('#historyDiv').prop("hidden", true)
    }
}

$(document).ready(function () {
    var outputTable = $('#outputTable')[0]
    var historyTable = $('#historyTable')[0]

    if (savedAccs.accounts.length >= 1) {
        savedAccs.accounts.forEach(account => {
            insertIntoTables(account, true)
        });
    }

    $('#gkey').val(localStorage.getItem("APIKey"))
    $('form').on('submit', function (e) {
        e.preventDefault();
        
        if (!$('#gkey')[0].readOnly) {
            return alert("Please save your API key")
        }
        let formDataRaw = new FormData(e.target);
        let formData = Array.from(formDataRaw)
        
        $.ajax({
            type: "POST",
            url: "http://accounts.robloxalts.info/api/public/demand/generate",
            data: `{"apikey":"${formData[0][1]}","amount":${parseInt(formData[1][1])}}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: apiSuccess,
            error: function (err) {
                console.log(err)
                if (err.responseJSON?.reason) {
                    alert(`API Error: ${err.responseJSON.reason}`)
                } else if (err.status === 404) {
                    return alert("The server is offline")
                } else {
                    return alert("An unknown error occured")
                }
            }
        });
    });
});


