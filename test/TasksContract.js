const TasksContract = artifacts.require("TasksContract");
contract("TasksContract",()=>{

before(async()=>{

this.taskcontract= await TasksContract.deployed();

})

it('desplegado?',async ()=>{

const adress =this.taskcontract.address;
assert.notEqual(adress,null);
assert.notEqual(adress,undefined);
assert.notEqual(adress,0x0);
assert.notEqual(adress,"");



})

it('obtener tareas',async()=>{

const tasksCounter=await this.taskcontract.taskCounter();
const task =await this.taskcontract.tasks(tasksCounter);

assert.equal(task.id.toNumber(),tasksCounter);
assert.equal(task.title,"primer tarea ejemplo");
assert.equal(task.description,"hacer algo");
assert.equal(task.done,false);
assert.equal(tasksCounter,1);

})

it('tarea creada',async()=>{
const result=await this.taskcontract.createTask("some task","description two");
const taskEvent=result.logs[0].args;
const tasksCounter=await this.taskcontract.taskCounter();
assert.equal(tasksCounter,2);
assert.equal(taskEvent.id.toNumber(),2);
assert.equal(taskEvent.title,"some task");
assert.equal(taskEvent.description,"description two");
assert.equal(taskEvent.done,false);


})

it('task toggle done',async()=>{
const result=await this.taskcontract.toggleDone(1);
const taskEvent=result.logs[0].args;
const task=await this.taskcontract.tasks(1);
assert.equal(task.done,true);
assert.equal(taskEvent.done,true);
assert.equal(taskEvent.id,1);



})

});
