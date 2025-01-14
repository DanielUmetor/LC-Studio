import { connection as db } from '../config/index.js'
import { createToken } from '../middleware/AuthenticateUser.js'
import { compare, hash } from 'bcrypt'

class Users{
    fetchUsers(req,res){
        try{
            const strQry = `
            SELECT user_id, first_name, last_name, department from Users;
            `
            db.query(strQry, (err, results) => {
                if(err) throw err 
                res.json({
                    status: res.statusCode,
                    results})
            })
        } catch (e){
           res.json({
            status: 404,
            msg: e.message
           })
        }
    }
    fetchUser(req, res) {
        try{
            const strQry = `
            Select user_id, first_name, last_name, department from Users
            where user_id = ${req.params.id}
            `
            db.query(strQry, (err, result) => {
                if (err) throw new Error(err)
                    res.json({
                        status: res.statusCode,
                        result: result[0]
                    }) 
            })
        } catch (e) {
            res.json({
                status: 404,
                msg: 'Please try again.'
            })
        }
    }
    
     async registerUser(req, res) {
        try {
          let data = req.body;
          data.user_pass = await hash(data.user_pass, 12)
    
          let user = {
            email_add: data.email_add,
            user_pass: data.user_pass,
          };
    
          let strQry = `
                insert into  Monitoring
                set ?;
                `
          db.query(strQry, [data], (err) => {
            if (err) {
              res.json({
                status: res.statusCode,
                error: "This email has already been taken",
              });
            } else {
              const token = createToken(user);
              res.json({
                token,
                msg: 'Registration Successful.',
              })
            }
          });
        } catch (e) {
          res.json({
            status: 404,
            msg: e.message,
          });
        }
      }
    
    async login(req, res) {
        try {
          const { email_add, user_pass } = req.body;
    
          const strQry = `
                select *
                from Monitoring
                where email_add = '${email_add}'                  
                `;
          db.query(strQry, async (err, result) => {
            if (err) throw new Error(err)
            if (!result?.length) {
              res.json({
                status: 401,
                msg: "Invalid email. Please provide a valid email or register.",
              })
            } else {
                const isValidPass = await compare(req.body.user_pass, result[0].user_pass)
                
                console.log(isValidPass);
                
              if (isValidPass) {
                const token = createToken({
                  email_add,
                  user_pass,
                })
                res.json({
                  status: res.statusCode,
                  msg: "Login Successful.",
                  token,
                  result: result[0],
                })
              } else {
                res.json({
                  status: 401,
                  msg: "Invalid Password. Please input correct password or register.",
                  result
                })
              }
            }
          })
        } catch (e) {
          res.json({
            status: 404,
            msg: e.message,
          })
        }
      }
      
    async updateUser(req,res){
        try{
            const strQry = `
            Update Monitoring Set ? Where user_id = ${req.params.id};            
            `
            if(req.body.user_pass){
                let n = req.body.user_pass
                req.body.user_pass = await hash(req.body.user_pass, 12)
                
            }
            db.query(strQry,[req.body], (err, result) => {
                if (err) throw new Error(err)
                    res.json({
                        status: res.statusCode,
                        result
                    }) 
            })
        } catch (e) {
            res.json({
                status: 404,
                msg: 'Failed to update.'
            })
        }
    }

    // Logs Functionality 

//     addLog(req,res){
//         try {
//             const strQry = `
//                 Insert into logs(user_id) Where user_id = ${req.params.id};
//             `

//             db.query(strQry, (err,result) => {
//                 if (err) throw new Error(err)
//                     res.json({
//                         status: res.statusCode,
//                         result
//                     }) 
//             })
            
//         } catch (error) {
//             if(error){
//                 res.json({
//                     status: 404,
//                     result : `Couldn't find data`
//                 }) 
//             }
//         }
//     }
}

  export {
    Users
  }