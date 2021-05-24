import { Request, Response } from "express";
import { getManager } from "typeorm";
import { read } from "node:fs";
import {Task} from "../entity/Task";


/**
 * Welcome endpoint for task management service.
 *
 * @remarks
 * This method is for service testing, it returns a welcome message.
 *
 * @param _req - The request to the service
 * @param res - The response to the request
 *
 */
export const get = (_req: Request, res: Response) => {
  res.send("Hello, this is the agent's Tasks management service.");
};

/**
 * Create agent task request.
 *
 * @param _req - The request to the create a task
 * @param res - The response to the request
 *
 */
export const addTask = async (req: Request, res: Response) => {
    try{ 

        const task = Task.create({
            idAgent : req.body.idAgent,
            idVehicle : req.body.idVehicle, 
            taskTitle : req.body.taskTitle,
            description : req.body.description,
            idTaskState : req.body.idTaskState, 
            idEquipment : req.body.idEquipment, 
            idTaskModel : req.body.idTaskModel, 
            assignmentDate : req.body.assignmentDate, 
            endDate : req.body.endDate
        }); 
        await task.save(); 
        return res.send(task); 
    } catch (err){
        console.log(err); 
        return res.status(500).json(err); 
    }
}
        
/**
 * Get all tasks request.
 *
 * @param _req - The request to get all tasks.
 * @param res - The response to the request.
 *
 */
export async function getTasks(_req: Request, res: Response) {
    try{

        const tasks = await Task.find(); 
        console.log(tasks); 
        return res.json(tasks); 

    } catch (err){
        console.log(err); 
        return res.status(500).json(err); 
    }  
}

// Update task without updating its steps
export async function updateTaskState(req: Request, res: Response) {
    const id = req.params.id;
    try {
        const task = await Task.findOneOrFail(id);         
        task.idTaskState = req.body.idTaskState;  
        await task.save(); 
        return res.json(task); 
    } catch (err){
        console.log(err); 
        return res.status(500).json(err); 
    }
    
}

//Delete
export async function deleteTask(req: Request, res: Response) {
    let id = parseInt(req.params.id); 
    try {
        const task = await Task.findOneOrFail(id);  
        await task.remove(); 
        return res.json({ message: 'Task deleted successfully' })
    } catch (err){
        console.log(err); 
        return res.status(500).json(err);
    }
    
}

/**
 * Find a agent task request by id.
 *
 * @param _req - The request to find a task with parameter (TaskID).
 * @param res - The response to the request.
 *
 */
export async function getTask(req: Request, res: Response) {
    const id =req.params.id; 
    try {
        const task = await Task.findOneOrFail(id);  
        return res.json(task); 
    } catch (err){
        console.log(err); 
        return res.json({ message: 'Task not found' }); 
    }
    
}

// Find all the tasks of an Agent 
export async function getTaskByAgentId(req: Request, res: Response) {
    const id = req.params.id;
    console.log("paramatre id = ", id);
    try{
    const tasks = await getManager()
        .createQueryBuilder(Task, "task")
        .where("task.idAgent = :id", { id: id })
        .getMany();

    return res.send(tasks); 
    } catch(err){
        console.log(err); 
        return res.status(500).json(err);
    }
}