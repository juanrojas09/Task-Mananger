

App ={

    web3Provider: '',

    contracts:{
        },

    init:async()=>{
        console.log("Cargado");
        await App.loadEthereum();
        await  App.loadContracts();
        await App.loadAccount();
         App.render();
         App.renderTasks();
         App.deleteTasks();
         
        
    },
    loadEthereum: async()=>{
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            await window.ethereum.request({ method: "eth_requestAccounts" });
          } else if (web3) {
            web3 = new Web3(window.web3.currentProvider);
          } else {
            console.log(
              "No ethereum browser is installed. Try it installing MetaMask "
            );
          }
},

loadAccount: async()=>{

    const accounts=await window.ethereum.request({ method: 'eth_requestAccounts' });
    App.account=accounts[0];
    
},

loadContracts: async ()=>{
    const res= await fetch("TasksContract.json")
    const taskContractJson=await res.json()
    console.log(taskContractJson)

    App.contracts.taskcontract= TruffleContract(taskContractJson); //guarde el contrato creado en solidity

    App.contracts.taskcontract.setProvider(App.web3Provider); //forma en la q nuestro contrato conecta con la cuenta de metamask

    App.taskcontract=await App.contracts.taskcontract.deployed(); //utilizamos el contrato desplegado

},

render:async()=>{
    const key=App.account;
document.getElementById("account").innerText=key;


},

renderTasks: async()=>{
const taskCounter=await App.taskcontract.taskCounter();
const taskCounterToNumber=taskCounter.toNumber();
console.log(taskCounter);
let html="";

for(let i=1;i<=taskCounterToNumber;i++){
const task=await App.taskcontract.tasks(i); //aca lo que hago es recorrer la lista y luego defino una var tasks en la que la recorro con el indice i
const taskId=task[0]
const taskTitle=task[1]
const taskdescription=task[2]
const taskdone=task[3]
const taskcreated=task[4]//se aumentan los indices porque al ser mapping de clave valor, clave 1 ->titulo, 2 -> desc , etc, voy mostrando por cada iteracion los datos



let taskElement =`

<div  class="card bg-dark rounded-0 mb-3">
<div class="card-header d-flex justify-content-between align-items-center">
<span>${taskTitle}</span>
<div class="form-check form-switch">
  <input div class="form-check-input" data-id="${taskId}" type="checkbox" &{taskDone && "checked"} onchange="App.toggleDone(this)"/>
</div>
</div>
<div class="card-body bg-dark rounded-0 mb-2">
<span>${taskdescription}</span>
</div>
<p class="text-muted">Tarea creada el   ${new Date(
    taskcreated * 1000
  ).toLocaleString()}</p>



</div>



`;

   html += taskElement;
 
}
document.querySelector("#taskList").innerHTML=html;
//const list=document.querySelector("#boton");
//list.addEventListener('click',()=>{
//console.log("click")
//;
//})

/*function eliminarElemento(taskId){
	const list=document.querySelector("#boton");
	if (!list){
		alert("El elemento selecionado no existe");
	} else {
		padre = list.parentNode;
		padre.removeChild(list);
	}
    
}*/
/*function eliminarElemento(taskId){
    boton.addEventListener('click', function () {
        console.log("click")
        const list=document.querySelector("#boton").value;
        if (!list){
            alert("El elemento selecionado no existe");
        } else {
            padre = list.parentNode;
            padre.removeChild(list);
        }
    })
    }*/

},



createTask: async(title,description)=>{
    const result= await App.taskcontract.createTask(title,description,{
        from:App.account
    });
    console.log(result.logs[0].args);

},

toggleDone: async (element) => {
    const taskId = element.dataset.id;
    await App.taskcontract.toggleDone(taskId, { //llamo al contrato inteligente
      from: App.account,
    });
    window.location.reload();
  },


deleteTasks: ()=>{

}
};




