console.log("my_contact.js loaded")
console.log("salam mehdi");
window.onload=
function(){
    ShowContacts();
}
const addBtn =
document.getElementById("addBtn");
const addForm =
document.getElementById("addForm");
addBtn.addEventListener("click",function(){
    addForm.style.display="block";
});

const saveBtn=
document.getElementById("saveBtn");
saveBtn.addEventListener("click",SaveContact);
saveBtn.addEventListener("click",function(){
    addForm.style.display="none";
});

let selectedId=null;
function
SaveContact(){
    const name=
    document.getElementById("contactName").value;
    const phone=
    document.getElementById("contactPhone").value;
    if (name==""||phone==""){
        return;
    }
    if (selectedId==null){
    fetch("/AddContact",{
        method:"POST",
        headers:{
            "Content-Type":
            "application/json"
        },
        body:JSON.stringify({name:name,phone:phone})
    })
    .then(response=>
        response.json())
        .then(data=>{
            document.getElementById("contactName").value="";
            document.getElementById("contactPhone").value="";
            alert(data.message);
            ShowContacts();
        });
}
    else{
        fetch("/UpdateContact",{
            method:"POST",
            headers:{
                "Content-Type":
                "application/json"
            },
            body:JSON.stringify({id:selectedId,name:name,phone:phone})
        })
        .then(response=>
            response.json())
            .then(data=>{
                selectedId=null;
                document.getElementById("contactName").value="";
                document.getElementById("contactPhone").value="";
                alert("Update is successfully");
                ShowContacts();


            })
    }


}
function
ShowContacts(){
    fetch("/ShowContacts")
    .then(response=>
    response.json())
    .then(data=>{
        let table=
        document.getElementById("contactsTable");
        table.innerHTML="";
        data.forEach(function(contact){
            table.innerHTML+=`
                <tr>
                <td>${contact.id}</td>
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>
                <button onclick="DeleteContact(${contact.id})">Delete</button>
                </td>
                <td>
                <button onclick='StartUpdate(${JSON.stringify(contact)})'>Update</button>
                </td>
                </tr>`;
        
    });
    
    
    });
}

function
DeleteContact(id){
    fetch("/DeleteContact",{
        method:"POST",
        headers:{
            "Content-Type":
            "application/json"
        },
        body:JSON.stringify({id:id})
    })
        .then(response=>
            response.json())
            .then(data=>{
                alert(data.message);
                ShowContacts()
            })
}


function
FillForm(contact){
    selectedId=contact.id;
    document.getElementById("contactName").value=contact.name;
    document.getElementById("contactPhone").value=contact.phone;

}
function
ShowAddForm(){
    addForm.style.display="block";
}
function
StartUpdate(contact){
    ShowAddForm();
    FillForm(contact);
    }

function
SearchContact(){
    let searchName=
    document.getElementById("searchName").value;
    console.log(searchName);
    fetch("/search",{
        method:"POST",
        headers:{
            "Content-Type":
            "application/json"
        },
        body:JSON.stringify({searchName:searchName})
    })
    .then(response=>
        response.json())
        .then(data=>{
            console.log(data);
            console.log(data.length);

            if (data.length==0){
                alert("Contact Not Found");
            }
                else{
                alert("Contact is Here: "+JSON.stringify(data));
                
            }
        document.getElementById("searchName").value="";
    })
    
}

setTimeout(function(){
    let msg=
    document.getElementById("flash-message");
    if(msg){
        msg.style.display="none";

    }
},3000);

    

