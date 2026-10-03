let cl = console.log;

const BASE_URL = `https://crud-firebase-e248a-default-rtdb.firebaseio.com/`;
const STUDENT_URL = `${BASE_URL}/students.json`;

const nameControl = document.getElementById('name');
const emailControl = document.getElementById('email');
const ageControl = document.getElementById('age');
const courseControl = document.getElementById('course');
const yearControl = document.getElementById('year');
const rollNoControl = document.getElementById('rollNo');
const cityControl = document.getElementById('city');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const studentTableBody = document.getElementById('studentTableBody');
const studentForm = document.getElementById('studentForm');

//==================================================================================
function snackBar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}
//=====================================================================================
function handleSpinner(flag) {
    if (flag) {
        spinner.classList.add('d-none');
    } else {
        spinner.classList.remove('d-none');
    }
}

//====================================================================================
let stdArray = [];
function fetchStdData() {
    handleSpinner();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', STUDENT_URL);
    xhr.send(null);
    xhr.onload = function () {
        let res = JSON.parse(xhr.response);
        if (xhr.status >= 200 && xhr.status <= 299) {
            for (let key in res) {
                res[key].id = key;
                stdArray.unshift(res[key]);
                templatingStudata(stdArray);
                // snackBar('Students data fatched successfully', 'success');
            }
        } else {
            snackBar('Unable to added employee data', 'error');
        }
        handleSpinner(true);
    }

    xhr.onerror = function () {
        handleSpinner(true);
        snackBar('Unable to connect to server', 'error');
    };
}
fetchStdData();
//====================================================================================
function onCreateStuData(eve) {
    eve.preventDefault();
    let stuObj = {
        name: nameControl.value,
        email: emailControl.value,
        age: ageControl.value,
        course: courseControl.value,
        year: yearControl.value,
        rollNO: rollNoControl.value,
        city: cityControl.value,
    }
    let xhr = new XMLHttpRequest();
    handleSpinner();
    xhr.open('POST', STUDENT_URL);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('TOKEN', 'JWT FROM LS');
    xhr.send(JSON.stringify(stuObj));
    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            stuObj.id = res.name;
            stdArray.unshift(stuObj);
            let tr = document.createElement('tr');
            tr.id = stuObj.id;
            tr.innerHTML = `<td>${1}</td>
                            <td>${stuObj.name}</td>
                            <td>${stuObj.email}</td>
                            <td>${stuObj.age}</td>
                            <td>${stuObj.course}</td>
                            <td>${stuObj.year}</td>
                            <td>${stuObj.rollNO}</td>
                            <td>${stuObj.city}</td>
                            <td class="action-column">
                                <button class="btn btn-sm btn-primary mr-2" onclick="oneditStudent(this)">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="ondeleteStudent(this)">Delete</button>
                            </td>`
            studentTableBody.prepend(tr);
            let firstTds = [...document.querySelectorAll('#studentTableBody tr td:first-child')];
            cl(firstTds);
            firstTds.forEach((td, i) => {
                td.innerHTML = i + 1;
            })
            studentForm.reset();
            snackBar('Student data Added successfully', 'success');
        } else {
            snackBar('Unable to added students data', 'error');
        }
        handleSpinner(true);
    }

    xhr.onerror = function () {
        handleSpinner(true);
        snackBar('Unable to connect to server', 'error');
    };
}

//=======================================================================================================
function templatingStudata(arr) {
    let result = '';
    arr.forEach((std, i) => {
        result += `<tr id=${std.id}>
                <td>${i + 1}</td>
                <td>${std.name}</td>
                <td>${std.email}</td>
                <td>${std.age}</td>
                <td>${std.course}</td>
                <td>${std.year}</td>
                <td>${std.rollNO}</td>
                <td>${std.city}</td>
                <td class="action-column">
                    <button class="btn btn-sm btn-primary mr-2" onclick="oneditStudent(this)">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="ondeleteStudent(this)">Delete</button>
                </td>
            </tr>`
    })
    studentTableBody.innerHTML = result;
}

function oneditStudent(ele) {
    let editId = ele.closest('tr').id;
    localStorage.setItem('editedId', editId);
    // let editObj = stdArray.find(obj => obj.id === editId);
    // nameControl.value = editObj.name;
    // emailControl.value = editObj.email;
    // ageControl.value = editObj.age;
    // courseControl.value = editObj.course;
    // yearControl.value = editObj.year;
    // rollNoControl.value = editObj.rollNO;
    // cityControl.value = editObj.city;
    // addBtn.classList.add('d-none');
    // updateBtn.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    const SINGLE_STU_URL = `${BASE_URL}/students/${editId}.json`
    xhr.open('GET', SINGLE_STU_URL);
    xhr.send(null);
    xhr.onload = function () {
        let res = JSON.parse(xhr.response)
        if (xhr.status >= 200 && xhr.status <= 299) {
            nameControl.value = res.name;
            emailControl.value = res.email;
            ageControl.value = res.age;
            courseControl.value = res.course;
            yearControl.value = res.year;
            rollNoControl.value = res.rollNO;
            cityControl.value = res.city;
            addBtn.classList.add('d-none');
            updateBtn.classList.remove('d-none');
            cancelBtn.classList.add('d-none');
        }
        else {
            snackBar('Unable to edit students data', 'error');
        }
        handleSpinner(true);
    }
    xhr.onerror = function () {
        handleSpinner(true);
        snackBar('Unable to connect to server', 'error');
    };
}
//========================================================
function onUpdate() {
    let updateId = localStorage.getItem('editedId');
    let updateObj = {
        name: nameControl.value,
        email: emailControl.value,
        age: ageControl.value,
        course: courseControl.value,
        year: yearControl.value,
        rollNO: rollNoControl.value,
        city: cityControl.value,
    }
    handleSpinner();
    let xhr = new XMLHttpRequest();
    const UPDATE_STD_URL = `${BASE_URL}/students/${updateId}.json`
    xhr.open('PUT', UPDATE_STD_URL);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('TOKEN', 'JWT FROM LS');
    xhr.send(JSON.stringify(updateObj));
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            let tds = document.getElementById(updateId).children;
            tds[1].innerHTML = res.name;
            tds[2].innerHTML = res.email;
            tds[3].innerHTML = res.age;
            tds[4].innerHTML = res.course;
            tds[5].innerHTML = res.year;
            tds[6].innerHTML = res.rollNO;
            tds[7].innerHTML = res.city;
            addBtn.classList.remove('d-none');
            updateBtn.classList.add('d-none');
            studentForm.reset();
            snackBar('Student Data Updated Successfully!!', 'success');

        } else {
            snackBar('Unable to update students data', 'error');
        }
        handleSpinner(true);
    }
    xhr.onerror = function () {
        handleSpinner(true);
        snackBar('Unable to connect to server', 'error');
    };

}
//======================================================
function ondeleteStudent(ele) {
    let deleteId = ele.closest('tr').id;
    Swal.fire({
        title: "Are you sure?",
        text: `You want to delete employee ID ${deleteId}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel"
    })
        .then(function (result) {
            if (result.isConfirmed) {
                handleSpinner();
                let xhr = new XMLHttpRequest();
                const Delete_URL = `${BASE_URL}/students/${deleteId}.json`
                xhr.open('DELETE', Delete_URL);
                xhr.send(null);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        document.getElementById(deleteId).remove();

                        let tr = document.querySelectorAll('tbody tr');
                        tr.forEach((tr, i) => {
                            tr.firstElementChild.innerHTML = i + 1;
                        })

                        if (tr.length === 0) {
                            let thead = document.querySelector('thead tr').remove();
                        }
                        snackBar("Deleted Student Successfully!!", 'success');
                    } else {
                        snackBar(`Unable to delete student ID ${deleteId}`, 'error');
                    }
                    handleSpinner(true);
                }
                xhr.onerror = function () {
                    snackBar('Unable to connect to server', 'error');
                    handleSpinner(true);
                }
            }

        });
}
//=========================================================================================
studentForm.addEventListener('submit', onCreateStuData);
updateBtn.addEventListener('click', onUpdate)



