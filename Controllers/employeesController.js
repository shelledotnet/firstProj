//#region In-MemoryDB

// const data={
//     employees: require('../model/employees.json'),
//     setEmployees:function(data){
//         this.employees=data
//     }
// };

//#endregion

//#region connect to MongoDB
const Employee=require('../model/Employee')  
//#endregion

//#region  all resources

const getAllEmployees=async (req,res)=>{
    //#region In-Memory
    //res.json(data.employees);
    //#endregion

    //#region MongoDB
    const employees=await Employee.find();
    if(!employees)return res.status(204).json({'message':'No employees found.'});
    res.json(employees);
    //#endregion

}

const getEmployeeById=async (req,res)=>{
 //#region  MongoDB
 if(!req?.params?.id)return res.status(400).json({"message":`Employee id ${req.params.id} required`});
const employee=await Employee.findOne({_id: req.params.id}).exec();
if(!employee){  //if employee doesnt exist
    return res.status(204).json({"message":`No emloyee id matches ${req.params.id}`});
}
res.json(employee);
 //#endregion


    //#region In-Memory
    
    // const employee=data.employees.find(emp=>emp.id===parseInt(req.params.id));
    
    // if(!employee){  //if employee doesnt exist
    //     return res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    // }
    // res.json(employee);
    
    //#endregion
}

const createNewEmployee=async (req,res)=>{
    //#region In-Memory
    
    // const newEmployee={
    //     id:data.employees[data.employees.length - 1].id + 1 || 1,  //grab d empl last id +1
    //     firstName:req.body.firstName,
    //     lastName:req.body.lastName
    // }
    
   //#endregion
   
   //#region MongoDB
   if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({'message':'First and last names are required.'});
    }

    try{
        const result=await Employee.create({
            firstname:req.body.firstname,
            lastname:req.body.lastname
        });
        res.status(201).json(result);
    }catch(err){
        console.error(err)
    }
    //#endregion

    //#region In-Memory
    
    // data.setEmployees([...data.employees,newEmployee]); //seeting the newemployee to the employee
    // res.status(201).json(data.employees);
    
    //#endregion
}

const updateEmployee=async (req,res)=>{

    //#region In-Memory
    //const employee=data.employees.find(emp=>emp.id===parseInt(req.body.id));
    //#endregion

    //#region MongoDB
    if(!req?.body?.id){
        return res.status(400).json({'message':'id Parameter is required'});
    }
     const employee=await Employee.findOne({_id: req.body.id}).exec();
    
    //#endregion


    if(!employee){  //if employee doesnt exist
        return res.status(204).json({"message":`No emloyee id matches ${req.params.id}`});
    }
    if(req.body?.firstname)employee.firstname=req.body.firstname;
    if(req.body?.lastname)employee.lastname=req.body.lastname;
    const result=await employee.save();
    res.json(result);

    //#region  In-Memory
    /*
    const filteredArray=data.employees.filter(emp=>emp.id !== parseInt(req.body.id));  //exclude the new employee from the array
    const unsortedArray=[...filteredArray,employee]; //filteredArray all the array of employees  ,  the new employee we r updating
    Employee.setEmployees(unsortedArray.sort((a,b)=>a.id > b.id ? 1 : a.id < b.id ? -1:0)); //setting the new unsortedArray to setEmployess
    res.json(Employee.employees);
    */
    //#endregion

    
}

const deleteEmployee=async (req,res)=>{
      //#region  MongoDB
        if(!req?.body?.id)return res.status(400).json({'message':'Employee ID required'});
        const employee=await Employee.findOne({_id: req.body.id}).exec();
        if(!employee){  //if employee doesnt exist
            return res.status(204).json({"message":`No emloyee id matches ${req.params.id}`});
        }

        const result=await employee.deleteOne({_id: req.body.id});

        res.json(result);

      //#endregion


   //#region  In-Memory

    // const employee=data.employees.find(emp=>emp.id===parseInt(req.params.id));
    // if(!employee){  //if employee doesnt exist
    //     return res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    // }
    // const filteredArray=data.employees.filter(emp=>emp.id !== parseInt(req.body.id));  //exclude the new employee from the array (by deleting)
    // data.setEmployees([...filteredArray]);  //then setting the filteredArray to all setemployess
    // res.json(data.employees);
    
//#endregion
   }
//#endregion

module.exports={
    getAllEmployees,
    getEmployeeById,
    deleteEmployee,
    createNewEmployee,
    updateEmployee
};