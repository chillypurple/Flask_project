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