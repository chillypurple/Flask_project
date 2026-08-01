function
loginUser(){
    let username=
    document.getElementById("username").value;
    let password=
    document.getElementById("password").value;
    let phone=
    document.getElementById("phone").value;
    fetch("/login",{
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
            window.location.href=
            "my_contact";
            
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

setTimeout(function(){
    let msg=
    document.getElementById("flash-message");
    if(msg){
        msg.style.display="none";

    }
},3000);

    




