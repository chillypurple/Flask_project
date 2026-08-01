alert("salam");
throw new Error("test");
console.log("file js load shod");
console.warn("salam mehdi");
let editingUserId=null;
let editingRow=null;

function sendData(){
    let phone=
    document.getElementById("phone").value;
    let username=
    document.getElementById("username").value;
    if (editingUserId !== null){
        //UPDATE
        fetch("/update",{
            method:"POST",
            headers:{
            "Content-Type":
            "application/json"
        },
             body:JSON.stringify({id:editingUserId,username:username,phone:phone})
    })
        .then(response=>
        response.json())
           .then(data=>{
              editingRow.cells[1].textContent=username;
              editingRow.cells[2].textContent=phone;
              editingUserId=null;
              editingRow=null;
              document.getElementById("username").value="";
              document.getElementById("phone").value="";
            });
    
    }
   
    else {
        //INSERT
        fetch("/send",{
           method:
           "POST",
            headers:{
            "Content-Type":"application/json"
    },
            body:JSON.stringify({username:username,phone:phone
        })
    })
        .then(response=>
            response.json())
           .then(data=>{console.log(data);
               let table=
           document.getElementById("usertable");
               let tr=
           document.createElement("tr");
               let td1=
           document.createElement("td");
               let td2=
           document.createElement("td");
               let td3=
            document.createElement("td");
               let td4=
           document.createElement("td");
               let td5=
            document.createElement("td");   
               let deletebutton=
           document.createElement("button");
           deletebutton.textContent="Delete";
           deletebutton.className="delete-btn";  
           deletebutton.dataset.id=
           data.id;
           deletebutton.onclick=
           function(){
               deleteUser(deletebutton);
           }
               let editbutton=
           document.createElement("button");
           editbutton.textContent="Edit";
           editbutton.className="edit-btn";
           editbutton.dataset.id=
           data.id;
           editbutton.onclick=
           function(){
               editUser(editbutton);
           }
           
           
           
           td1.textContent=data.id;
           td2.textContent=data.username;
           td3.textContent=data.phone;
           tr.appendChild(td1);
           tr.appendChild(td2);
           tr.appendChild(td3);
           tr.appendChild(td4);
           tr.appendChild(td5)
           td4.appendChild(deletebutton);
           td5.appendChild(editbutton);
           table.appendChild(tr);
           document.getElementById("username").value="";
           document.getElementById("phone").value="";
           document.getElementById("usertable");
           document.querySelectorAll(".edit-button");
        

        });
    }     

}

    
function editUser(button){
    editingUserId=
    button.dataset.id;
    editingRow=button.parentElement.
    parentElement;
    fetch("/edit",{
        method:"POST",
        headers:{
        "Content-Type":
        "application/json"
        },
        body:JSON.stringify({id:editingUserId,username:username,phone:phone})
    })
    
    .then(response=>
        response.json())
    .then(data=>{
        document.getElementById("username").value=data.username;
        document.getElementById("phone").value=data.phone;
        console.log(data.username);
        console.log(data.phone);
    }); 
    
}





function
deleteUser(button){
    let id= 
    button.dataset.id;
    fetch("/delete",{
        method:"POST",
        headers:{
            "Content-Type":
            "application/json"
        },
        body:JSON.stringify({id:
            id})

    })
    .then(response=>
        response.json())
        .then(data=>{console.log(data);
            button.parentElement.parentElement.remove();
        })
}

document.getElementById("search-btn")
.addEventListener("click",
function
searchContact(){
    let keyword=
    document.getElementById("search-input").value;
    let message=
    document.getElementById("message");
    fetch("/search?name="+keyword)
    .then(response=>
        response.json())
        .then(data=>{
            let tbody=
            document.getElementById("result");
            tbody.innerHTML=""; 
            if (data.length==0){
            message.innerHTML=
            "Contact Not Found";
            return
            }
            message.innerHTML="";
            let row=
            document.createElement("tr");
            let cell1=
            document.createElement("td");
            let cell2=
            document.createElement("td");
            let cell3=
            document.createElement("td")
            cell1.innerHTML=data[0][0];
            cell2.innerHTML=data[0][1];
            cell3.innerHTML=data[0][2];
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            tbody.appendChild(row);
            

    });
})
document.getElementById("search-input")
.addEventListener("input",function(){
    document.getElementById("message")
    .innerHTML="";
}); 
document.getElementById("search-input")
.addEventListener("input",function(){
    document.getElementById("result")
    .innerHTML="";
});

