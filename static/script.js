console.log("JS is working 😎");

    
function
registerUser(){
    let username=
    document.getElementById("username").value;
    let password=
    document.getElementById("password").value;
    let phone=
    document.getElementById("phone").value;
    fetch("/register",{
        method:"POST",
        headers:{
        "Content-Type":
        "application/json"
    },
    body:JSON.stringify({username:username,password:password,
        phone:phone})
   })
   .then(response=>
    response.json())
   .then(data=>{
        if (data.success){
            alert(data.message);
            window.location.href=
            "login";
        }
        else{
            alert(data.message);
        }
    })
        .catch(error=>{
        console.log(error);
        alert("Connection Error");
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
})

