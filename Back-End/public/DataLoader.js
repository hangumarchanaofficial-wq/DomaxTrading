let database;
async function dataLoader(){
    try{
        const response = await fetch('/Data.json');
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        database = await  response.json();
    }
    catch (error){
        console.log(error);
    }



}
document.addEventListener('DOMContentLoaded', dataLoader);
