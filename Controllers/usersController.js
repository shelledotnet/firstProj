//#region In-MemoryDB
/*
const Employee={
    employees: require('../model/employees.json'),
    setEmployees:function(data){this.employees=data}
};
*/
//#endregion

//#region connect to MongoDB
const bcrypt=require('bcrypt');
const User=require('../model/User')  
//#endregion

//#region  all resources

const getAllUsers=async (req,res)=>{
    //#region In-Memory
    //res.json(Employee.employees);
    //#endregion

    //#region MongoDB
    const users=await User.find();
    if(!users)return res.status(204).json({'message':'No users found.'});
    res.json(users);
    //#endregion

}

const getUserById=async (req,res)=>{
 //#region  MongoDB
if(!req?.params?.id)return res.status(400).json({"message":`User ID ${req.params.id} required`});
const user=await User.findOne({_id: req.params.id}).exec();
if(!user){  //if employee doesnt exist
    return res.status(404).json({"message":`No user ID matches ${req.params.id}`});
}
res.json(user);
 //#endregion
//#region In-Memory
    /*
    const employee=data.employees.find(emp=>emp.id===parseInt(req.params.id));
    
    if(!employee){  //if employee doesnt exist
        return res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    }
    res.json(employee);
    */
    //#endregion
}

//this operation is on registerController
const createNewUser=async (req,res)=>{
    //#region In-Memory
    /*
    const newEmployee={
        id:data.employees[data.employees.length - 1].id + 1 || 1,  //grab d empl last id +1
        firstName:req.body.firstName,
        lastName:req.body.lastName
    }
    */
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
    /*
    data.setEmployees([...data.employees,newEmployee]); //seeting the newemployee to the employee
    res.status(201).json(data.employees);
    */
    //#endregion
}

const updateUserPwd=async (req,res)=>{

    //#region In-Memory
    //const employee=data.employees.find(emp=>emp.id===parseInt(req.body.id));
    //#endregion

    //#region MongoDB
    if(!req?.body?.id)return res.status(400).json({'message':'ID  is required'});
     const user=await User.findOne({_id: req.body.id}).exec();
    
    //#endregion

    if(!user)return res.status(400).json({"message":`No user ID matches ${req.body.id}`});
    try{
    if(req.user !== user.username)return res
      .status(403)
      .json({ "message": "only a user can update is password" });
    if(req?.body?.oldpassword && req?.body?.newpassword){
        const match=await bcrypt.compare(req?.body?.oldpassword,user.password);
        if(!match)return res.status(400).json({"message":`password: ${req.body.id} do not match `})
        else{
            
            const hashedPwd=await bcrypt.hash(req?.body?.newpassword, 10); //encrypt an sort of 10 round
            user.password=hashedPwd;
           const result=await user.save();
           res.json(result);

        }
        
    }
    return res.status(400).json({'message':'oldpassword and newpassword are required.'});
    }catch(err){
    res.status(500).json({'message':err.message});
   }

    //#region  In-Memory
    /*
    const filteredArray=data.employees.filter(emp=>emp.id !== parseInt(req.body.id));  //exclude the new employee from the array
    const unsortedArray=[...filteredArray,employee]; //filteredArray all the array of employees  ,  the new employee we r updating
    Employee.setEmployees(unsortedArray.sort((a,b)=>a.id > b.id ? 1 : a.id < b.id ? -1:0)); //setting the new unsortedArray to setEmployess
    res.json(Employee.employees);
    */
    //#endregion

    
}

const deleteUser=async (req,res)=>{
      //#region  MongoDB
        if(!req?.params?.id)return res.status(400).json({'message':'Employee ID required'});
        const user=await User.findOne({_id: req.params.id}).exec();
        if(!user)return res.status(204).json({"message":`No user ID matches ${req.params.id}`});
        const result=await user.deleteOne({_id: req.params.id});

        res.json(result);

      //#endregion


   //#region  In-Memory
/*
    const employee=data.employees.find(emp=>emp.id===parseInt(req.params.id));
    if(!employee){  //if employee doesnt exist
        return res.status(400).json({"message":`Employee ID ${req.body.id} not found`});
    }
    const filteredArray=data.employees.filter(emp=>emp.id !== parseInt(req.body.id));  //exclude the new employee from the array (by deleting)
    data.setEmployees([...filteredArray]);  //then setting the filteredArray to all setemployess
    res.json(data.employees);
    */
//#endregion
   }
//#endregion
module.exports={
    getAllUsers,
    getUserById,
    deleteUser,
    createNewUser,
    updateUserPwd
};