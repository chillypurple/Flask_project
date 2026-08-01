function
ShowUsers(){
    console.log("ShowUsers Started")
    fetch("/admin/users")
    .then(response=>
        response.json())
        .then(data=>{
            console.log(data)
            let table=
            document.getElementById("users_body")
            table.innerHTML=""
            data.forEach(function(user){
                table.innerHTML+=`
                
                
                <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td>
                <a
                 href="/admin/contacts/${user.id}"
                class="btn btn-primary">
                 <i class="fa-solid
                fa-eye"></i>Contacts
                </a>
                </td>
                </tr>`
            })
        })
}
ShowUsers()





