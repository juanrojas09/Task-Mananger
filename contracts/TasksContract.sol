// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract{
    uint public taskCounter=0;
    
    constructor(){
        createTask("primer tarea ejemplo", "hacer algo");
    }

event TaskCreated(uint id, string title,string description, bool done, uint createdAt); //devuelve lo que hace una tarea

event TaskToggleDone(uint id,bool done);

event TaskDelete(uint id );

    struct Task{
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;

    }

mapping(uint256 =>Task) public tasks; //clave valor

//funcion para crear tareas, le paso los parametros, en tasks que es del mapping, es un clave valor un valor una tarea, defubi yb arreglo de tasks que le
//pasdo los atributos de la struct y despues incremento
function createTask(string memory _title, string memory _description) public{         
    taskCounter++;                                                                                   
    tasks[taskCounter]=Task(taskCounter, _title, _description,false,block.timestamp);
    emit TaskCreated(taskCounter, _title, _description, false, block.timestamp);
        
    
}

function toggleDone(uint _id) public{
   Task memory _task=tasks[_id];
      _task.done= !_task.done;
       tasks[_id]=_task;
       emit TaskToggleDone(_id,_task.done);
   


}

function deleteTask(uint _id) public{
Task memory _task=tasks[_id];
delete tasks[_id];
tasks[_id]=_task;

emit TaskDelete(_id);


}



}