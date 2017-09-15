window.onload = function () {
    lists();
    document.getElementById('frmRegister').addEventListener('submit', addOuchange);
    document.getElementById('frmRegister').addEventListener('submit', lists);
};
let idchange = null;

function addOuchange(e) {
    let nom = document.getElementById('txtName').value;
    let thrName = document.getElementById('txtSecondName').value;
    let email = document.getElementById('txtEmail').value;
    let phone = document.getElementById('txtPhone').value;
    let p = {
        Name: !nom ? "sem Name" : nom,
        SecondName: !thrName ? "sem thrName" : thrName,
        email: !thrName ? "sem txtEmail" : email,
        phone: !phone ? "sem txtPhone" : phone,
        nasc: new Date(document.getElementById('dtpDataBirth').value.replace("-", "/")),
        Sex: document.getElementById('rdoMale').checked ? 'M' : 'F',
        data: new Date()
    };

    if (idchange == null) {
        add(p)
    } else if (idchange > 0)
        change(p);
    else
        alert("Unknown Action");
    e.preventDefault();
}

function add(p) {
    let people = [];
    let idValid = 1;
    if (localStorage.getItem('value') !== null) {
        people = JSON.parse(localStorage.getItem('value'));
        if (people.length > 0)
            idValid = (function getIdValid() {
                for (let i = 0; i < people.length; i++)
                    if (people[i].Id != i + 1)
                        return i + 1;

                return people[people.length - 1].Id + 1;
            })();
    }

    let person = {
        Id: idValid,
        Name: p.Name,
        SecondName: p.SecondName,
        email: p.email,
        phone: p.phone,
        DataBirth: p.nasc.toLocaleString("en-GB").substring(0, 10),
        Sex: p.Sex,
        DataRegister: p.data.toLocaleString("en-GB")
    };
    people.push(person);
    people.sort(function (a, b) {
        return a.Id - b.Id;
    });
    localStorage.setItem('value', JSON.stringify(people));
    document.getElementById('frmRegister').reset();
}

function change(p) {
    let btn = document.getElementById('btnRegistertoSave');
    people = JSON.parse(localStorage.getItem('value'));
    for (let i = 0; i < people.length; i++) {
        if (people[i].Id == idchange) {
            people[i].Name = p.Name;
            people[i].SecondName = p.SecondName;
            people[i].email = p.email;
            people[i].phone = p.phone;
            people[i].DataBirth = p.nasc.toLocaleString("en-GB").substring(0, 10);
            people[i].Sex = p.Sex;
            people[i].DataRegister = p.data.toLocaleString("en-GB");
            btn.value = "Register";
            idchange = null;
            localStorage.setItem('value', JSON.stringify(people));
            document.getElementById('frmRegister').reset();
            break;
        }
    }
}

function preparechange(idRow) {
    document.getElementById('btnRegistertoSave').value = "to Save";
    let txtName = document.getElementById('txtName'),
        txtSecondName = document.getElementById('txtSecondName'),
        email = document.getElementById('txtEmail'),
        phone = document.getElementById('txtPhone'),
        dtpDataBirth = document.getElementById('dtpDataBirth'),
        rdoMale = document.getElementById('rdoMale'),
        rdoFemale = document.getElementById('rdoFemale');
    let people = JSON.parse(localStorage.getItem('value'));
    
    for (let i = 0; i < people.length; i++) {
        if (people[i].Id == idRow) {
            txtName.value = people[i].Name;
            txtSecondName.value = people[i].SecondName;
            email.value = people[i].email;
            phone.value = people[i].phone;
            dtpDataBirth.value = people[i].DataBirth.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
            rdoMale.checked = !(rdoFemale.checked = (people[i].Sex == 'F'));
            lists();

            idchange = null;
            if (idchange === null) {
                let th = document.getElementById("rowTable" + i);
                th.className = "alterationState";
            }
            idchange = people[i].Id;
            break;
        }
    }
}

function Delete(cod) {
    let people = JSON.parse(localStorage.getItem('value'));
    console.log(people);
    for (let i = 0; i < people.length; i++){
        if (people[i].Id == cod)
            people.splice(i, 1);
    }
    console.log(people);
    /*for(var i = cod; i<people.length; i++){
        people[i-1].Id = i;
    }*/
    localStorage.setItem('value', JSON.stringify(people));
    lists();
    if (people.length == 0)
        window.localStorage.removeItem("value");
}

function lists() {
    if (localStorage.getItem('value') === null)
        return;
    let people = JSON.parse(localStorage.getItem('value'));
    let tbody = document.getElementById("tbodyResults");
    tbody.innerHTML = '';
    for (let i = 0; i < people.length; i++) {
        let id = people[i].Id,
            Name = people[i].Name,
            SecondName = people[i].SecondName,
            email = people[i].email,
            phone = people[i].phone,
            nasc = people[i].DataBirth,
            Sex = people[i].Sex,
            data = people[i].DataRegister
        tbody.innerHTML += '<tr id="rowTable' + i + '">' +
            '<td>' + id + '</td>' +
            '<td>' + Name + '</td>' +
            '<td>' + SecondName + '</td>' +
            '<td>' + email + '</td>' +
            '<td>' + phone + '</td>' +
            '<td>' + nasc + '</td>' +
            '<td>' + Sex + '</td>' +
            '<td>' + data + '</td>' +
            '<td><button onclick=" Delete(\'' + id + '\')"> Delete</button></td>' +
            '<td><button onclick="preparechange(\'' + id + '\')">change</button></td>' +
            '</tr>';
    }
}
/*(function () {
    window.addEventListener('load', function () {
        let input, filter, ul, li, a, i;
        //input = document.getElementById('myInput');
       // window.alert(input);
        /*input.addEventListener('onkeyup', function () 
        {
            filter = input.value.toUpperCase();
            ul = document.getElementById("myUL");
            li = ul.getElementsByTagName('li');

            // Loop through all list items, and hide those who don't match the search query
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("a")[0];
                if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "none";
                } else {
                    li[i].style.display = "none";
                }
            }
        });
        document.getElementById("Add").addEventListener('click', function () {
            if (document.getElementById('formParent') == null) {
                let block = document.createElement('div');
                block.setAttribute('id', 'formParent');
                block.innerHTML = "<form method='post'><h2 class='text-center'>Create an account</h2><div class='form-group'><input class='form-control' name='text' placeholder='FirstName' type='text' /></div><div class='form-group'><input class='form-control' name='text' placeholder='SecondName' type='text' /></div><div class='form-group'><input class='form-control' name='email' placeholder='Email' type='email'/></div><div class='form-group'><input class='form-control' name='text' placeholder='Phone' type='text' /></div><div class='form-group'><button class='btn gtn-primary btn-block' type='button' id='txt' >Add contact</button></div></form>"
                document.body.appendChild(block);

                    block.addEventListener('click', function () {
                  window.alert(15);
                });
            } else {
                document.body.removeChild(document.getElementById('formParent'));
            }
        });
    });
})();*/
